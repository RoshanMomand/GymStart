<?php

    use App\Http\Controllers\FoodController;
    use App\Http\Controllers\MealPlanController;
    use App\Http\Controllers\OnboardingController;
    use App\Http\Controllers\ProfileController;
    use App\Http\Controllers\UserController;
    use App\Http\Controllers\WorkoutLogController;
    use App\Http\Controllers\WorkoutPlanController;
    use Illuminate\Support\Facades\Route;

// ── Public routes ────────────────────────────────────────────────────────────

    Route::get('/onboarding', [UserController::class, 'onboarding']);
    Route::get('/foods/search', [FoodController::class, 'search']);

// Register and Login endpoints (public)
    Route::post('/register', [UserController::class, 'register']);
    Route::post('/login', [UserController::class, 'login']);

// ── Protected routes (require auth token) ────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        // Logout endpoint
        Route::post('/logout', [UserController::class, 'logout']);

        // Onboarding endpoints
        Route::post('/onboarding', [OnboardingController::class, 'store']);
        Route::get('/onboarding/profile', [OnboardingController::class, 'show']);

        // Workout Plan endpoints
        Route::post('/workout-plans', [WorkoutPlanController::class, 'store']);
        Route::get('/workout-plans', [WorkoutPlanController::class, 'show']);

        // Workout Log endpoints
        Route::get('/workout-sessions', [WorkoutLogController::class, 'indexSessions']);
        Route::post('/workout-sessions', [WorkoutLogController::class, 'storeSession']);
        Route::get('/workout-sessions/{session}', [WorkoutLogController::class, 'showSession']);
        Route::delete('/workout-sessions/{session}', [WorkoutLogController::class, 'destroySession']);
        Route::post('/workout-sessions/{session}/sets', [WorkoutLogController::class, 'storeSets']);
        Route::patch('/workout-sessions/{session}/sets/{set}', [WorkoutLogController::class, 'updateSet']);
        Route::delete('/workout-sessions/{session}/sets/{set}', [WorkoutLogController::class, 'destroySet']);

        Route::get('/mealplans', [MealPlanController::class, 'index']);
        Route::post('/mealplans/generate', [MealPlanController::class, 'generate']);
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::patch('/profile', [ProfileController::class, 'update']);
        Route::patch('/profile/name', [ProfileController::class, 'updateName']);
        Route::patch('/profile/weight', [ProfileController::class, 'updateWeight']);
        Route::get('/profile/weight-history', [ProfileController::class, 'weightHistory']);

    });
