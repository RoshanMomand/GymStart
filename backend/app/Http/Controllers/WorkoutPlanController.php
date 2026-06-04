<?php

namespace App\Http\Controllers;

use App\Services\WorkoutPlanService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkoutPlanController extends Controller
{
    public function __construct(protected WorkoutPlanService $workoutPlanService) {}

    public function store(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();

            if (!$user->profile) {
                return response()->json([
                    'error'   => 'User profile not found',
                    'message' => 'Please complete onboarding first',
                ], 400);
            }

            $workoutPlan = $this->workoutPlanService->generateForUser($user);

            return response()->json([
                'message' => 'Workout plan created successfully',
                'data'    => [
                    'id'           => $workoutPlan->id,
                    'training_days' => count($workoutPlan->exercises ?? []),
                    'schedule'     => $workoutPlan->exercises,
                    'created_at'   => $workoutPlan->created_at,
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error'   => 'Failed to create workout plan',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(): JsonResponse
    {
        $user        = auth()->user();
        $workoutPlan = $this->workoutPlanService->getPlanForUser($user);

        if (!$workoutPlan) {
            return response()->json([
                'error'   => 'No workout plan found',
                'message' => 'Please complete onboarding or generate a plan first',
            ], 404);
        }

        return response()->json([
            'data' => [
                'id'                  => $workoutPlan->id,
                'schedule'            => $workoutPlan->exercises,
                'rest_day_exercises'  => $workoutPlan->rest_day_exercises ?? [],
                'is_active'           => $workoutPlan->is_active,
                'created_at'          => $workoutPlan->created_at,
                'updated_at'          => $workoutPlan->updated_at,
            ],
        ]);
    }
}
