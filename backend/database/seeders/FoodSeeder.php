<?php

namespace Database\Seeders;
use App\Models\Food;
use Illuminate\Database\Seeder;

class FoodSeeder extends Seeder
{

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Food::query()->create([
            'name' => 'Apple',
            'calories' => 250,
            'carbs' => 50,
            'protein' => 30,
            'fats' => 170,
        ]);

        Food::query()->create([
            'name' => 'Banana',
            'calories' => 300,
            'carbs' => 100,
            'protein' => 100,
            'fats' => 100,
        ]);

        Food::query()->create([
            'name' => 'Carrot',
            'calories' => 400,
            'carbs' => 20,
            'protein' => 30,
            'fats' => 200,
        ]);


    }
}
