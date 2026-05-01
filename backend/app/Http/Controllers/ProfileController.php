<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * Return the authenticated user's profile.
     * GET /profile
     *
     * TODO: Resolve the user from the request (auth middleware)
     * TODO: Delegate to UserService::getProfile()
     * TODO: Return user profile resource
     */
    public function show(Request $request): JsonResponse
    {
        // TODO: implement
        return response()
            ->json(['message' => 'profile endpoint'], 501);

    }

}
