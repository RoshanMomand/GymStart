<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * User model
 *
 * Represents an app user. Stores basic profile and onboarding data.
 *
 * Table: users
 * Columns: see /docs/DATABASE_SCHEMA.md
 *
 * TODO: Add relationships (hasOne WorkoutPlan, hasOne MealPlan)
 * TODO: Add fillable / hidden / casts arrays
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // TODO: define $fillable
    // TODO: define $hidden
    // TODO: define $casts
}
