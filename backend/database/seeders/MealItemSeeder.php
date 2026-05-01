<?php

namespace Database\Seeders;

use App\Models\Food;
use App\Models\Meal;
use App\Models\MealItem;
use Illuminate\Database\Seeder;

class MealItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $meals = Meal::all();
        $foods = Food::all();

        // First meal
        // E.g. if there are more items you can use the index
        // But you can also use a for loop. In the future
        MealItem::query()->create([
            'meal_id' => $meals[0]->id,
            'food_id' => $foods[0]->id,
            'grams' => '200',
        ]);
        MealItem::query()->create([
            'meal_id' => $meals[0]->id,
            'food_id' => $foods[1]->id,
            'grams' => '100'
        ]);

        // Second Meal
        MealItem::query()->create([
            'meal_id' => $meals[1]->id,
            'food_id' => $foods[0]->id,
            'grams' => '150'
        ]);
        MealItem::query()->create([
            'meal_id' => $meals[1]->id,
            'food_id' => $foods[1]->id,
            'grams' => '200'
        ]);

        // Third Meal
        MealItem::query()->create([
            'meal_id' => $meals[2]->id,
            'food_id' => $foods[2]->id, // broccoli
            'grams' => 100,
        ]);

    }
}
