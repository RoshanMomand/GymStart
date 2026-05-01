<?php

namespace App\Services;

use App\Models\Food;
use App\Models\Meal;
use App\Models\MealPlan;
use App\Models\MealPlanType;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Support\Collection;

class MealPlanService
{
    private const DISTRIBUTIONS = [
        3 => [
            1 => 0.30,
            2 => 0.40,
            3 => 0.30,
        ],
        4 => [
            1 => 0.25,
            2 => 0.25,
            3 => 0.25,
            4 => 0.25,
        ],
        5 => [
            1 => 0.20,
            2 => 0.20,
            3 => 0.20,
            4 => 0.20,
            5 => 0.20,
        ],
    ];

    // Keyword→category mapping for food classification
    private const PROTEIN_KEYWORDS  = ['chicken', 'salmon', 'tuna', 'beef', 'turkey', 'shrimp', 'egg', 'tofu', 'tempeh', 'skyr', 'cottage', 'yogurt', 'protein', 'fish'];
    private const CARB_KEYWORDS     = ['rice', 'pasta', 'potato', 'oat', 'quinoa', 'bread', 'wrap', 'sweet'];
    private const VEGETABLE_KEYWORDS= ['broccoli', 'pepper', 'spinach', 'zucchini', 'carrot', 'cauliflower', 'vegetable', 'salad'];
    private const MEAT_KEYWORDS     = ['chicken', 'beef', 'turkey', 'salmon', 'tuna', 'shrimp', 'fish'];

    // Dislike/allergy options sent from the frontend are category names (e.g. "Dairy", "Nuts"),
    // not specific food names (e.g. "Milk", "Almonds"). These maps expand each category term
    // to the specific food-name keywords that should be excluded from the meal plan.
    private const DISLIKE_EXPANSION = [
        'nuts'       => ['almond', 'walnut', 'cashew', 'peanut', 'macadamia', 'pistachio', 'hazelnut', 'pecan'],
        'dairy'      => ['milk', 'yogurt', 'skyr', 'cottage', 'ricotta', 'mozzarella', 'cheddar', 'kefir', 'cream'],
        'seafood'    => ['salmon', 'tuna', 'shrimp', 'cod', 'tilapia', 'mackerel', 'sardine', 'haddock'],
        'red meat'   => ['beef', 'lamb', 'pork', 'venison'],
        'pork'       => ['pork'],
        'gluten'     => ['pasta', 'bread', 'wrap', 'pita', 'tortilla', 'couscous', 'bulgur', 'muesli', 'granola'],
        'eggs'       => ['egg'],
        'egg'        => ['egg'],
        'soy'        => ['tofu', 'tempeh', 'edamame'],
        'mushrooms'  => ['mushroom'],
        'onions'     => ['onion'],
        'garlic'     => ['garlic'],
        'raw fish'   => ['salmon', 'mackerel', 'sardine', 'haddock'],
    ];

    private const ALLERGY_EXPANSION = [
        'gluten-free'    => ['pasta', 'bread', 'wrap', 'pita', 'tortilla', 'couscous', 'bulgur', 'oat', 'muesli', 'granola'],
        'dairy-free'     => ['milk', 'yogurt', 'skyr', 'cottage', 'ricotta', 'mozzarella', 'cheddar', 'kefir', 'cream'],
        'nut-free'       => ['almond', 'walnut', 'cashew', 'peanut', 'macadamia', 'pistachio', 'hazelnut', 'pecan'],
        'egg-free'       => ['egg'],
        'shellfish-free' => ['shrimp'],
        'soy-free'       => ['tofu', 'tempeh', 'edamame'],
    ];

    public function __construct(
        private readonly NutritionCalculatorService $calculator,
        private readonly FoodApiService $foodApiService,
    ) {}

    public function generateForUser(User $user): MealPlan
    {
        $profile = $user->profile;

        // ── 1. Calculate nutritional needs ───────────────────────────────
        $bmr     = $this->calculator->calculateBMR($profile->age, $profile->gender, $profile->weight_kg, $profile->height_cm);
        $tdee    = $this->calculator->calculateTDEE($bmr, $profile->activity_level, $profile->training_days ?? 0);
        $restCal = $this->calculator->calculateCalorieTarget($tdee, $profile->fitness_goal);
        $trainCal= $this->calculator->trainingDayCalories($restCal);

        $restMacros  = $this->calculator->calculateMacros($restCal, $profile->fitness_goal);
        $trainMacros = $this->calculator->calculateMacros($trainCal, $profile->fitness_goal);

        // ── 2. Fetch real nutritional data from OpenFoodFacts for preferences ──
        //    Results are cached in the foods table; local seeds serve as fallback.
        $this->foodApiService->fetchAndStoreForPreferences($profile->food_preferences ?? []);

        // ── 3. Select foods based on preferences ─────────────────────────
        $categorized = $this->selectFoodsForUser($profile);

        // ── 3. Remove any existing plan for this user ─────────────────────
        MealPlan::where('user_id', $user->id)->each(function ($plan) {
            $plan->types()->each(function ($type) {
                $type->meals()->each(function ($meal) {
                    $meal->items()->delete();
                });
                $type->meals()->delete();
            });
            $plan->types()->delete();
            $plan->delete();
        });

        // ── 4. Persist plan ───────────────────────────────────────────────
        $mealPlan = MealPlan::create([
            'user_id'      => $user->id,
            'goal'         => $profile->fitness_goal,
            'calories'     => $restCal,
            'protein'      => $restMacros['protein'],
            'carbs'        => $restMacros['carbs'],
            'fats'         => $restMacros['fats'],
            'is_active'    => true,
            'generated_at' => now(),
        ]);

        // Training day
        $trainingType = $mealPlan->types()->create([
            'type'     => 'training',
            'calories' => $trainCal,
            'protein'  => $trainMacros['protein'],
            'carbs'    => $trainMacros['carbs'],
            'fats'     => $trainMacros['fats'],
        ]);

        // Rest day
        $restType = $mealPlan->types()->create([
            'type'     => 'rest',
            'calories' => $restCal,
            'protein'  => $restMacros['protein'],
            'carbs'    => $restMacros['carbs'],
            'fats'     => $restMacros['fats'],
        ]);

        $mealsPerDay = $profile->meals_per_day ?? 4;
        $this->buildMealsForType($trainingType, $categorized, $trainCal, $mealsPerDay, isTrainingDay: true);
        $this->buildMealsForType($restType,     $categorized, $restCal,  $mealsPerDay, isTrainingDay: false);

        return $mealPlan->load('types.meals.items.food');
    }

    public function getPlanForUser(int $userId): ?MealPlan
    {
        return MealPlan::where('user_id', $userId)
            ->with('types.meals.items.food')
            ->latest('generated_at')
            ->first();
    }

    // ── Private helpers ───────────────────────────────────────────────────

    private function selectFoodsForUser(UserProfile $profile): array
    {
        $preferences = array_map('strtolower', $profile->food_preferences ?? []);
        $dietary     = $profile->dietary_preferences ?? [];

        // Expand category-level dislike/allergy terms to specific food-name keywords.
        // e.g. "Dairy" → ['milk','yogurt','skyr',...], "Nut-free" → ['almond','walnut',...]
        $dislikes  = $this->expandCategoryTerms($profile->food_dislikes ?? [], self::DISLIKE_EXPANSION);
        $allergies = $this->expandCategoryTerms($profile->allergies     ?? [], self::ALLERGY_EXPANSION);

        $excluded    = array_merge($dislikes, $allergies);
        $isVegetarian= !empty(array_intersect(['Vegetarian', 'Vegan', 'Pescatarian'], $dietary));
        $isVegan     = in_array('Vegan', $dietary);

        $allFoods = Food::all();

        // 1. Try to match user's own preferences first
        $preferred = $allFoods->filter(function (Food $food) use ($preferences, $excluded, $isVegetarian, $isVegan) {
            $name = strtolower($food->name);
            $matchesPref = collect($preferences)->contains(fn($p) => str_contains($name, $p) || str_contains($p, $name));
            return $matchesPref
                && !$this->isExcluded($name, $excluded)
                && !($isVegetarian && $this->matchesKeywords($name, self::MEAT_KEYWORDS))
                && !($isVegan && $this->matchesKeywords($name, ['egg', 'dairy', 'milk', 'cheese', 'yogurt', 'skyr']));
        });

        // 2. If too few preferred foods, supplement with defaults that pass restrictions
        if ($preferred->count() < 6) {
            $supplemental = $allFoods->filter(function (Food $food) use ($preferred, $excluded, $isVegetarian, $isVegan) {
                if ($preferred->contains('id', $food->id)) return false;
                $name = strtolower($food->name);
                return !$this->isExcluded($name, $excluded)
                    && !($isVegetarian && $this->matchesKeywords($name, self::MEAT_KEYWORDS))
                    && !($isVegan && $this->matchesKeywords($name, ['egg', 'dairy', 'milk', 'cheese', 'yogurt', 'skyr']));
            })->take(10);

            $preferred = $preferred->merge($supplemental);
        }

        return $this->categorize($preferred);
    }

    private function buildMealsForType(MealPlanType $type, array $categorized, int $totalCalories, int $mealsPerDay, bool $isTrainingDay): void
    {
        $distribution  = self::DISTRIBUTIONS[$mealsPerDay] ?? self::DISTRIBUTIONS[4];
        $preWorkoutIdx = (int) ceil($mealsPerDay / 2);

        foreach ($distribution as $orderIndex => $ratio) {
            $mealCalories = (int) round($totalCalories * $ratio);

            $mealType = match(true) {
                $isTrainingDay && $orderIndex === $preWorkoutIdx     => 'pre_workout',
                $isTrainingDay && $orderIndex === $preWorkoutIdx + 1 => 'post_workout',
                default                                              => 'standard',
            };

            $meal = $type->meals()->create([
                'type'        => $mealType,
                'order_index' => $orderIndex,
            ]);

            $this->composeMeal($meal, $categorized, $mealCalories, $orderIndex);
        }
    }

    private function composeMeal(Meal $meal, array $categorized, int $targetCalories, int $slotIndex): void
    {
        $proteins    = $categorized['protein']   ?? [];
        $carbs       = $categorized['carb']      ?? [];
        $vegetables  = $categorized['vegetable'] ?? [];

        // Rotate food picks per slot to avoid identical days
        $protein = $proteins[($slotIndex - 1) % max(1, count($proteins))] ?? null;
        $carb    = $carbs[($slotIndex - 1) % max(1, count($carbs))]       ?? null;
        $veg     = $vegetables[($slotIndex - 1) % max(1, count($vegetables))] ?? null;

        $isSnack = $slotIndex === 4;

        // Slot composition ratios
        $items = [];
        if ($protein) {
            $items[] = ['food' => $protein, 'ratio' => $isSnack ? 1.0 : 0.50];
        }
        if ($carb && !$isSnack) {
            $items[] = ['food' => $carb, 'ratio' => 0.35];
        }
        if ($veg && !$isSnack && $slotIndex !== 1) {
            $items[] = ['food' => $veg, 'ratio' => null]; // fixed portion for veg
        }

        foreach ($items as $item) {
            $food  = $item['food'];
            // Vegetables get a fixed realistic 150g serving; other foods are calorie-targeted
            $grams = $item['ratio'] === null
                ? 150
                : $this->gramsFor($food, (int) round($targetCalories * $item['ratio']));

            $meal->items()->create([
                'food_id' => $food->id,
                'grams'   => $grams,
            ]);
        }
    }

    // How many grams of $food to reach $targetCalories
    private function gramsFor(Food $food, int $targetCalories): int
    {
        if ($food->calories <= 0) return 100;
        $raw = (int) round(($targetCalories / $food->calories) * 100);
        return max(30, min(500, $raw));
    }

    private function categorize(Collection $foods): array
    {
        $result = ['protein' => [], 'carb' => [], 'vegetable' => [], 'other' => []];

        foreach ($foods as $food) {
            $name = strtolower($food->name);
            if ($this->matchesKeywords($name, self::PROTEIN_KEYWORDS)) {
                $result['protein'][] = $food;
            } elseif ($this->matchesKeywords($name, self::CARB_KEYWORDS)) {
                $result['carb'][] = $food;
            } elseif ($this->matchesKeywords($name, self::VEGETABLE_KEYWORDS)) {
                $result['vegetable'][] = $food;
            } else {
                // Classify by dominant macro
                if ($food->protein >= $food->carbs) {
                    $result['protein'][] = $food;
                } else {
                    $result['carb'][] = $food;
                }
            }
        }

        return $result;
    }

    // Converts a list of raw terms (which may be category names like "Dairy", "Nuts",
    // or specific food names like "garlic") into a flat array of matchable keywords.
    // Unknown terms are kept as-is so exact-name matching still works for them.
    private function expandCategoryTerms(array $terms, array $expansionMap): array
    {
        $result = [];
        foreach ($terms as $term) {
            $key = strtolower($term);
            if (isset($expansionMap[$key])) {
                $result = array_merge($result, $expansionMap[$key]);
            } else {
                $result[] = $key;
            }
        }
        return array_unique($result);
    }

    private function isExcluded(string $name, array $excluded): bool
    {
        foreach ($excluded as $ex) {
            if ($ex && (str_contains($name, $ex) || str_contains($ex, $name))) {
                return true;
            }
        }
        return false;
    }

    private function matchesKeywords(string $text, array $keywords): bool
    {
        foreach ($keywords as $kw) {
            if (str_contains($text, $kw)) return true;
        }
        return false;
    }
}
