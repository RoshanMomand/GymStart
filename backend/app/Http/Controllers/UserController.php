<?php

    namespace App\Http\Controllers;

    use App\Http\Requests\StoreUserRequest;
    use App\Models\User;
    use App\Services\UserService;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Hash;
    use Symfony\Component\HttpFoundation\JsonResponse;

    class UserController extends Controller
    {
        public function __construct (protected UserService $userService)
        {
            $this->userService = $userService;
        }

        /**
         * Display a listing of the resource.
         */
        public function index (Request $request)
        {
            $path = $request->path();
            return response()->json(['message' => "UserController index method called at path: $path"], 200, ['Content-Type' => 'application/json']);
        }

        /**
         * Store a newly created resource in
         * storage.
         */
        public function store (StoreUserRequest $request)
        {
            $validatedData = $request->input();

            return response()->json([
                'data'    => $validatedData,
                'message' => 'This is the information of the user and it is successfully created'], 201);
        }

        public function register (StoreUserRequest $request)
        {
            try
            {
                $user = User::query()->create([
                    'name'     => $request->input('name'),
                    'email'    => $request->input('email'),
                    'password' => Hash::make($request->input('password')),]);

                $token = $user->createToken('auth_token')->plainTextToken;

                return response()->json([
                    'message' => 'User registered successfully',
                    'data'    => [
                        'user'  => $user,
                        'token' => $token,],]);

            }
            catch (\Exception $e)
            {
                return response()->json([
                    'message' => 'Failed to register user',
                    'error'   => $e->getMessage()], 500);
            }
        }

        /**
         * Handle user login.
         * POST /api/login
         */
        public function login (Request $request)
        {
            try
            {
                $credentials = $request->validate([
                    'email'    => 'required|email',
                    'password' => 'required|string',]);

                $user = User::where('email', $credentials['email'])->first();

                if (!$user || !Hash::check($credentials['password'], $user->password))
                {
                    return response()->json([
                        'message' => 'Invalid credentials',
                        'error'   => 'The provided credentials do not match our records.'], 401);
                }

                $token = $user->createToken('auth_token')->plainTextToken;

                return response()->json([
                    'message' => 'Login successful',
                    'data'    => [
                        'user'  => $user,
                        'token' => $token,],], 200);

            }
            catch (\Exception $e)
            {
                return response()->json([
                    'message' => 'Login failed',
                    'error'   => $e->getMessage()], 500);
            }
        }

        /**
         * Handle user logout.
         * POST /api/logout
         */
        public function logout (Request $request)
        {
            try
            {
                // Revoke the current token
                $request->user()->currentAccessToken()->delete();

                return response()->json([
                    'message' => 'Logged out successfully',], 200);

            }
            catch (\Exception $e)
            {
                return response()->json([
                    'message' => 'Logout failed',
                    'error'   => $e->getMessage()], 500);
            }
        }

        public function onboarding (Request $request): JsonResponse
        {
            return response()->json(['message' => 'onboarding endpoint'], 501);
        }

    }
