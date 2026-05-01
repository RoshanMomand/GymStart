<?php

namespace Database\Seeders;

use App\Models\Meal;
use App\Models\MealPlanType;
use Illuminate\Database\Seeder;

class MealSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $type = MealPlanType::query()->first();
        Meal::query()->create([
            'meal_plan_type_id' => $type->id,
            'type' => 'standard',
            'order_index' => 1,
        ]);

        Meal::query()->create([
            'meal_plan_type_id' => $type->id,
            'type' => 'pre_workout',
            'order_index' => 2,
        ]);

        Meal::query()->create([
            'meal_plan_type_id' => $type->id,
            'type' => 'post_workout',
            'order_index' => 3,
        ]);

    }
}
