<?php

namespace App\Services;

use App\Models\Food;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FoodApiService
{
    private const API_URL = 'https://world.openfoodfacts.org/cgi/search.pl';
    private const USER_AGENT = 'GymStart/1.0 (fitness app; contact@gymstart.app)';

    // Fetch nutritional data for each preference term and store/update in the foods table.
    // Returns the number of foods successfully cached.
    public function fetchAndStoreForPreferences(array $preferences): int
    {
        $stored = 0;

        foreach ($preferences as $term) {
            try {
                $food = $this->searchBestMatch($term);
                if ($food) {
                    $stored++;
                }
            } catch (\Throwable $e) {
                Log::warning("OpenFoodFacts search failed for '{$term}': " . $e->getMessage());
            }
        }

        return $stored;
    }

    // Keywords that indicate processed/undesirable products
    private const PROCESSED_KEYWORDS = [
        'nugget' , 'crispy' , 'seasoned' , 'marinated' , 'breaded' , 'flavored' , 'flavoured' ,
        'sauce' , 'mcnugget' , 'frozen' , 'ready' , 'instant' , 'microwave' , 'meal kit' ,
        'protein powder' , 'supplement' , 'protein bar' , 'shake' , 'mix' , 'battered' ,
    ];

    // Search OpenFoodFacts for a single term and store the best-scored result.
    // Prefers simple/generic products over branded or highly processed ones.
    // Skips API call if a matching food already exists locally.
    private function searchBestMatch(string $term): ?Food
    {
        $termLower = strtolower($term);

        // Use local cache first — avoids redundant API calls
        $existing = Food::whereRaw('LOWER(name) LIKE ?' , ['%' . $termLower . '%'])->first();
        if ($existing) {
            return $existing;
        }

        $response = Http::timeout(10)->withHeaders(['User-Agent' => self::USER_AGENT])->get(self::API_URL , [
            'search_terms' => $term ,
            'search_simple' => 1 ,
            'action' => 'process' ,
            'json' => 1 ,
            'page_size' => 25 , // fetch more to have a bigger pool to score
        ]);

        if (!$response->successful()) {
            return null;
        }

        $products = $response->json()['products'] ?? [];
        $scored = [];

        foreach ($products as $product) {
            $name = trim($product['product_name'] ?? '');

            // Cast all macro values to float — API sometimes returns empty strings instead of null
            $n = $product['nutriments'] ?? [];
            $calories = is_numeric($n['energy-kcal_100g'] ?? '') ? (float)$n['energy-kcal_100g'] : null;
            $protein = is_numeric($n['proteins_100g'] ?? '') ? (float)$n['proteins_100g'] : null;
            $carbs = is_numeric($n['carbohydrates_100g'] ?? '') ? (float)$n['carbohydrates_100g'] : null;
            $fat = is_numeric($n['fat_100g'] ?? '') ? (float)$n['fat_100g'] : null;

            // Hard requirements: name + all four macros must be numeric and present
            if (!$name || $calories === null || $calories <= 0
                || $protein === null || $carbs === null || $fat === null) {
                continue;
            }

            // Macro sanity: kcal derived from macros should be ≥75% of stated value
            $derivedKcal = ($protein * 4) + ($carbs * 4) + ($fat * 9);
            if ($derivedKcal < $calories * 0.75) {
                continue;
            }

            $score = $this->scoreProduct($product , $termLower);
            $scored[] = compact('score' , 'product' , 'name' , 'calories' , 'protein' , 'carbs' , 'fat');
        }

        if (empty($scored)) {
            return null;
        }

        // Pick highest-scoring product
        usort($scored , fn ($a , $b) => $b['score'] <=> $a['score']);
        $best = $scored[0];

        $label = $this->titleCase($term);
        $barcode = $best['product']['code'] ?? null;

        return Food::create([
            'external_id' => $barcode ,
            'name' => $label ,
            'calories' => (int)round($best['calories']) ,
            'protein' => (int)round($best['protein']) ,
            'carbs' => (int)round($best['carbs']) ,
            'fats' => (int)round($best['fat']) ,
            'source' => 'api' ,
        ]);
    }

    // Score a product — higher = more suitable for a meal plan.
    // Prefers: simple names, high completeness, few ingredients, no processing keywords.
    private function scoreProduct(array $product , string $searchTerm): int
    {
        $score = 0;
        $nameLower = strtolower($product['product_name'] ?? '');
        $nameLen = strlen($nameLower);
        $completeness = (float)($product['completeness'] ?? 0);
        $ingredients = strtolower($product['ingredients_text'] ?? '');
        $ingWordCount = $ingredients ? count(explode(',' , $ingredients)) : 99;

        // +20 if product name directly contains the search term
        if (str_contains($nameLower , $searchTerm)) {
            $score += 20;
        }

        // +15 for high completeness (more nutritional data available)
        if ($completeness >= 0.7) {
            $score += 15;
        } elseif ($completeness >= 0.5) {
            $score += 7;
        }

        // Name length: shorter names usually mean simpler/more generic products
        if ($nameLen <= 20) {
            $score += 20;
        } elseif ($nameLen <= 35) {
            $score += 10;
        } elseif ($nameLen > 60) {
            $score -= 15;
        }

        // Few ingredients = simpler product
        if ($ingWordCount <= 2) {
            $score += 15;
        } elseif ($ingWordCount <= 5) {
            $score += 8;
        } elseif ($ingWordCount > 15) {
            $score -= 10;
        }

        // Penalise processed/branded product keywords
        foreach (self::PROCESSED_KEYWORDS as $keyword) {
            if (str_contains($nameLower , $keyword)) {
                $score -= 25;
                break;
            }
        }

        return $score;
    }

    private function titleCase(string $str): string
    {
        return implode(' ' , array_map('ucfirst' , explode(' ' , strtolower($str))));
    }

    // Legacy method kept for the FoodController search endpoint
    public function getAllFoods(?string $query = null)
    {
        try {
            $response = Http::timeout(8)->withHeaders(['User-Agent' => self::USER_AGENT])->get(self::API_URL , [
                'search_terms' => $query ,
                'search_simple' => 1 ,
                'action' => 'process' ,
                'json' => 1 ,
                'page_size' => 20 ,
            ]);

            if (!$response->successful()) {
                return ['error' => 'Failed to fetch food data' , 'status' => $response->status()];
            }

            $products = $response->json()['products'] ?? [];

            return collect($products)->map(function ($product) {
                return [
                    'name' => $product['product_name'] ?? 'Unknown' ,
                    'brand' => $product['brands'] ?? null ,
                    'image' => $product['image_url'] ?? null ,
                    'nutrition' => [
                        'calories' => $product['nutriments']['energy-kcal_100g'] ?? null ,
                        'protein' => $product['nutriments']['proteins_100g'] ?? null ,
                        'carbs' => $product['nutriments']['carbohydrates_100g'] ?? null ,
                        'fat' => $product['nutriments']['fat_100g'] ?? null ,
                    ] ,
                ];
            });
        } catch (\Throwable $e) {
            return ['error' => 'Failed to fetch food data' , 'message' => $e->getMessage()];
        }
    }
}
