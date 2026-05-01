<?php

namespace Database\Seeders;

use App\Models\MealPlan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MealPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MealPlan::query()->create([
            'goal' => 'weight_loss',
            'is_active' => true,
        ]);
    }
}
