<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WorkoutPlanController;
use App\Http\Controllers\MealPlanController;
use App\Http\Controllers\ProfileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| All routes here are prefixed with /api automatically by Laravel.
| Authentication is handled via Laravel Sanctum tokens.
|
*/

// ── Public routes ────────────────────────────────────────────────────────────

Route::post('/user/onboarding', [UserController::class, 'onboarding']);

// ── Protected routes (require auth token) ────────────────────────────────────
// TODO: Uncomment auth middleware once Sanctum is configured
// Route::middleware('auth:sanctum')->group(function () {

Route::get('/workout-plan', [WorkoutPlanController::class, 'index']);
Route::get('/meal-plan',    [MealPlanController::class,    'index']);
Route::get('/profile',      [ProfileController::class,     'show']);

// });
