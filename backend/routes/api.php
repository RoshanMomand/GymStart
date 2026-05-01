<?php

use App\Http\Controllers\MealPlanController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// ── Public routes ────────────────────────────────────────────────────────────

Route::get('/onboarding', [UserController::class, 'onboarding']);

// ── Protected routes (require auth token) ────────────────────────────────────
// TODO: Uncomment auth middleware once Sanctum is configured
// Route::middleware('auth:sanctum')->group(function () {

Route::get('/user/{id}',         [UserController::class,     'show']);
Route::get('/user',        [UserController::class,     'index']);
Route::post('/user', [UserController::class, 'store']);
Route::get('/meal-plan',    [MealPlanController::class,    'index']);
Route::get('/profile',      [ProfileController::class,     'show']);

// });