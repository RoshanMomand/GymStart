<?php

namespace App\Http\Controllers;

use App\Http\Requests\OnboardingRequest;
use App\Models\UserProfile;
use App\Services\MealPlanService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class OnboardingController extends Controller
{
    public function __construct(private readonly MealPlanService $mealPlanService) {}

    /**
     * Store/update user onboarding profile
     *
     * This method creates or updates a user's profile with onboarding data.
     * All required fields are validated through OnboardingRequest.
     *
     * @param OnboardingRequest $request Validated request data
     * @return JsonResponse Success or error response with profile data
     */
    public function store(OnboardingRequest $request): JsonResponse
    {
        try {
            // Get the authenticated user
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'message' => 'Unauthorized: User not authenticated',
                ], 401);
            }

            // Check if profile already exists for this user
            $profile = UserProfile::where('user_id', $user->id)->first();

            if ($profile) {
                // Update existing profile
                $profile->update([
                    'age' => $request->age,
                    'gender' => $request->gender,
                    'weight_kg' => $request->weight_kg,
                    'height_cm' => $request->height_cm,
                    'fitness_goal' => $request->fitness_goal,
                    'experience_level' => $request->experience_level,
                    'training_days'       => $request->training_days,
                    'meals_per_day'       => $request->meals_per_day ?? 4,
                    'activity_level'      => $request->activity_level,
                    'workout_preference'  => $request->workout_preference,
                    'food_preferences'    => $request->food_preferences,
                    'food_dislikes'       => $request->food_dislikes,
                    'dietary_preferences' => $request->dietary_preferences ?? [],
                    'allergies'           => $request->allergies ?? [],
                    'onboarding_completed'=> true,
                ]);
            } else {
                // Create new profile
                $profile = UserProfile::create([
                    'user_id'             => $user->id,
                    'age'                 => $request->age,
                    'gender'              => $request->gender,
                    'weight_kg'           => $request->weight_kg,
                    'height_cm'           => $request->height_cm,
                    'fitness_goal'        => $request->fitness_goal,
                    'experience_level'    => $request->experience_level,
                    'training_days'       => $request->training_days,
                    'meals_per_day'       => $request->meals_per_day ?? 4,
                    'activity_level'      => $request->activity_level,
                    'workout_preference'  => $request->workout_preference,
                    'food_preferences'    => $request->food_preferences,
                    'food_dislikes'       => $request->food_dislikes,
                    'dietary_preferences' => $request->dietary_preferences ?? [],
                    'allergies'           => $request->allergies ?? [],
                    'onboarding_completed'=> true,
                ]);
            }

            // Generate personalized meal plan immediately after onboarding
            $mealPlan = $this->mealPlanService->generateForUser($user->fresh(['profile']));

            return response()->json([
                'message' => 'Onboarding completed successfully',
                'data' => [
                    'user_id'   => $user->id,
                    'profile'   => $profile,
                    'meal_plan' => [
                        'id'            => $mealPlan->id,
                        'goal'          => $mealPlan->goal,
                        'daily_calories'=> $mealPlan->calories,
                        'protein_g'     => $mealPlan->protein,
                        'carbs_g'       => $mealPlan->carbs,
                        'fats_g'        => $mealPlan->fats,
                    ],
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error completing onboarding',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Retrieve the authenticated user's onboarding profile
     *
     * @return JsonResponse Profile data or error response
     */
    public function show(): JsonResponse
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'message' => 'Unauthorized: User not authenticated',
                ], 401);
            }

            $profile = UserProfile::where('user_id', $user->id)->first();

            if (!$profile) {
                return response()->json([
                    'message' => 'User profile not found',
                ], 404);
            }

            return response()->json([
                'data' => $profile,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving profile',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
