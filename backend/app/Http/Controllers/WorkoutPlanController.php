<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class WorkoutPlanController extends Controller
{
    /**
     * Return the authenticated user's workout plan.
     * GET /workout-plan
     *
     * TODO: Resolve the user from the request (auth middleware)
     * TODO: Delegate to WorkoutPlanService::getPlanForUser()
     * TODO: Return workout plan resource
     */
    public function index(Request $request): JsonResponse
    {
        // TODO: implement
        return response()->json(['message' => 'workout-plan endpoint'], 501);
    }
}
