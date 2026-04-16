<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Handle user onboarding submission.
     * POST /user/onboarding
     *
     * TODO: Validate request data (name, age, weight, fitness goal, etc.)
     * TODO: Delegate to UserService::processOnboarding()
     * TODO: Return created user resource
     */
    public function onboarding(Request $request): JsonResponse
    {
        // TODO: implement
        return response()->json(['message' => 'onboarding endpoint'], 501);
    }
}
