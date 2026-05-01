<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class UserController extends Controller
{
    public function __construct(protected UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $path = $request->path();
        return response()->json(['message' => "UserController index method called at path: $path"], 200, ['Content-Type' => 'application/json']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $validatedData = $request->input();

        return response()->json([
            'data' => $validatedData,
            'message' => 'This is the information of the user and it is successfully created'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }


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
