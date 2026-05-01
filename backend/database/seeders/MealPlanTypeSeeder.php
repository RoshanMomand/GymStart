<?php

namespace Database\Seeders;

use App\Models\MealPlan;
use App\Models\MealPlanType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MealPlanTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mealPlan = MealPlan::query()->inRandomOrder()->first();
        MealPlanType::query()->create([
            'meal_plan_id' => $mealPlan->id,
            'type' => 'training',
            'calories' => 2000,
            'carbs' => 100,
            'protein' => 150,
            'fats'=>50,
        ]);
        MealPlanType::query()->create([
            'meal_plan_id' => $mealPlan->id,
            'type' => 'rest',
            'calories' => 1800,
            'carbs' => 50,
            'protein' => 150,
            'fats' => 50,
        ]);
    }
}
