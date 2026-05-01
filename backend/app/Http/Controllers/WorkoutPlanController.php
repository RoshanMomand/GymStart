<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkoutPlanRequest;
use App\Http\Requests\UpdateWorkoutPlanRequest;
use App\Models\WorkoutPlan;
use App\Services\ExerciseDbService;
use App\Services\WorkoutPlanService;
use Illuminate\Http\JsonResponse;

class WorkoutPlanController extends Controller
{

    public function __construct(
        protected WorkoutPlanService $workoutPlanService ,
        private ExerciseDbService    $exerciseDbService
    )
    {
        $this->workoutPlanService = $workoutPlanService;
        $this->middleware('auth:sanctum');
    }

    /**
     * Store a newly created workout plan for authenticated user
     */
    public function store(StoreWorkoutPlanRequest $request): JsonResponse
    {
        try {
            $user = auth()->user();
            $userProfile = $user->profile;

            if (!$userProfile) {
                return response()->json([
                    'error' => 'User profile not found' ,
                    'message' => 'Please complete onboarding first' ,
                ] , 400);
            }

            // Fetch exercises from ExerciseDB API based on body part
            // Quantity = training_days_per_week * 4
            // TODO:: Quantity needs to be dynamic, based on the users preferences of training days and fitness level.
            $exerciseQuantity = $userProfile->training_days * 4;

            $exercises = $this->exerciseDbService->getExercisesByBodyPart(
                $request->body_part ,
                limit: $exerciseQuantity
            );

            if (isset($exercises['error'])) {
                return response()->json([
                    'error' => 'Failed to fetch exercises from API' ,
                    'message' => $exercises['message'] ?? $exercises['error'] ,
                ] , 500);
            }

            // Extract exercise IDs
            $exerciseIds = collect($exercises)->map(function ($exercise) {
                return $exercise['id'] ?? null;
            })->filter()->toArray();

            // Create or update workout plan (pulling fitness level from profile)
            $workoutPlan = WorkoutPlan::updateOrCreate(
                ['user_id' => $user->id] ,
                [
                    'exercises' => $exerciseIds ,
                    'notes' => $request->notes ,
                    'is_active' => true ,
                ]
            );

            return response()->json([
                'message' => 'Workout plan created successfully' ,
                'data' => [
                    'id' => $workoutPlan->id ,
                    'fitness_level' => $userProfile->experience_level ,
                    'training_days_per_week' => $userProfile->training_days ,
                    'exercises_count' => count($exerciseIds) ,
                    'created_at' => $workoutPlan->created_at ,
                ]
            ] , 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create workout plan' ,
                'message' => $e->getMessage() ,
            ] , 500);
        }
    }

    /**
     * Display the workout plan for an authenticated user
     */
    public function show(): JsonResponse
    {
        $user = auth()->user();
        $workoutPlan = $user->workoutPlan;
        $userProfile = $user->profile;

        if (!$workoutPlan) {
            return response()->json([
                'error' => 'No workout plan found' ,
                'message' => 'User has not created a workout plan yet' ,
            ] , 404);
        }

        return response()->json([
            'data' => [
                'id' => $workoutPlan->id ,
                'fitness_level' => $userProfile->experience_level ,
                'training_days_per_week' => $userProfile->training_days ,
                'exercises_count' => count($workoutPlan->exercises ?? []) ,
                'is_active' => $workoutPlan->is_active ,
                'notes' => $workoutPlan->notes ,
                'created_at' => $workoutPlan->created_at ,
                'updated_at' => $workoutPlan->updated_at ,
            ]
        ] , 200);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WorkoutPlan $workoutPlan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWorkoutPlanRequest $request , WorkoutPlan $workoutPlan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WorkoutPlan $workoutPlan)
    {
        //
    }

}
