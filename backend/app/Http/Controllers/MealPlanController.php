<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MealPlanController extends Controller
{
    /**
     * Return the authenticated user's meal plan.
     * GET /meal-plan
     *
     * TODO: Resolve the user from the request (auth middleware)
     * TODO: Delegate to MealPlanService::getPlanForUser()
     * TODO: Return meal plan resource
     */
    public function index(Request $request): JsonResponse
    {
        // TODO: implement
        return response()->json(['message' => 'meal-plan endpoint'], 501);
    }
}
