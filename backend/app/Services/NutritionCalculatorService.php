<?php

    namespace App\Services;

    class NutritionCalculatorService
    {
        private const array ACTIVITY_MULTIPLIERS = [
            'sedentary'   => 1.2,
            'light'       => 1.375,
            'moderate'    => 1.55,
            'active'      => 1.725,
            'very_active' => 1.9,];

        // Mifflin-St Jeor BMR equation
        public function calculateBMR (int $age, string $gender, float $weightKg, int $heightCm): float
        {
            $base = (10 * $weightKg) + (6.25 * $heightCm) - (5 * $age);

            return match ($gender)
            {
                'male' => $base + 5,
                'female' => $base - 161,
                default => $base - 78, // average for 'other'
            };
        }

        // trainingDays adds ~250 kcal per session spread over the week (ACSM estimate for 45-60min moderate session)
        public function calculateTDEE (float $bmr, string $activityLevel, int $trainingDays = 0): float
        {
            $multiplier = self::ACTIVITY_MULTIPLIERS[$activityLevel];
            $tdee = $bmr * $multiplier;
            $tdee += ($trainingDays * 250) / 7;
            return $tdee;
        }

        public function calculateCalorieTarget (float $tdee, string $goal): int
        {
            return (int)round(match ($goal)
            {
                'lose_weight' => $tdee - 500,
                'build_muscle' => $tdee + 300,
                default => $tdee,
            });
        }

        // Returns protein/carbs/fats in grams
        public function calculateMacros (int $calories, string $goal): array
        {
            [$pRatio, $cRatio, $fRatio] = match ($goal)
            {
                'lose_weight' => [0.40, 0.30, 0.30],
                'build_muscle' => [0.28, 0.50, 0.22],
                default => [0.30, 0.40, 0.30],
            };

            return [
                'protein' => (int)round(($calories * $pRatio) / 4),
                'carbs'   => (int)round(($calories * $cRatio) / 4),
                'fats'    => (int)round(($calories * $fRatio) / 9)];
        }

        // Training days get +10% calories to fuel performance
        public function trainingDayCalories (int $baseCalories): int
        {
            return (int)round($baseCalories * 1.10);
        }
    }
