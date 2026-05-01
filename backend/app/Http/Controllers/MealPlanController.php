<?php

namespace App\Http\Controllers;

use App\Models\MealPlan;
use App\Services\MealPlanService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MealPlanController extends Controller
{
    public function __construct(private readonly MealPlanService $mealPlanService) {}

    // GET /api/mealplans — return current user's plan
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        $plan = $this->mealPlanService->getPlanForUser($user->id);

        if (!$plan) {
            return response()->json(['message' => 'No meal plan found. Complete onboarding to generate one.'], 404);
        }

        return response()->json(['data' => $this->formatPlan($plan)]);
    }

    // POST /api/mealplans/generate — (re-)generate plan for current user
    public function generate(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user->profile || !$user->profile->onboarding_completed) {
            return response()->json(['message' => 'Complete onboarding before generating a meal plan.'], 422);
        }

        try {
            $plan = $this->mealPlanService->generateForUser($user);
            return response()->json(['message' => 'Meal plan generated successfully.', 'data' => $this->formatPlan($plan)], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to generate meal plan.', 'error' => $e->getMessage()], 500);
        }
    }

    private function formatPlan(MealPlan $plan): array
    {
        return [
            'id'           => $plan->id,
            'goal'         => $plan->goal,
            'generated_at' => $plan->generated_at,
            'daily_targets'=> [
                'calories' => $plan->calories,
                'protein'  => $plan->protein,
                'carbs'    => $plan->carbs,
                'fats'     => $plan->fats,
            ],
            'day_types' => $plan->types->map(fn($type) => [
                'type'     => $type->type,
                'calories' => $type->calories,
                'protein'  => $type->protein,
                'carbs'    => $type->carbs,
                'fats'     => $type->fats,
                'meals'    => $type->meals->sortBy('order_index')->values()->map(fn($meal) => [
                    'slot'      => $meal->order_index,
                    'meal_name' => match($meal->type) {
                        'pre_workout'  => 'Pre-Workout',
                        'post_workout' => 'Post-Workout',
                        default        => 'Meal ' . $meal->order_index,
                    },
                    'type'       => $meal->type,
                    'calories'   => $meal->items->sum(fn($item) => round(($item->grams / 100) * $item->food->calories)),
                    'protein'    => $meal->items->sum(fn($item) => round(($item->grams / 100) * $item->food->protein)),
                    'carbs'      => $meal->items->sum(fn($item) => round(($item->grams / 100) * $item->food->carbs)),
                    'fats'       => $meal->items->sum(fn($item) => round(($item->grams / 100) * $item->food->fats)),
                    'foods'      => $meal->items->map(fn($item) => [
                        'name'     => $item->food->name,
                        'grams'    => $item->grams,
                        'calories' => (int) round(($item->grams / 100) * $item->food->calories),
                        'protein'  => (int) round(($item->grams / 100) * $item->food->protein),
                        'carbs'    => (int) round(($item->grams / 100) * $item->food->carbs),
                        'fats'     => (int) round(($item->grams / 100) * $item->food->fats),
                    ]),
                ]),
            ]),
        ];
    }
}
