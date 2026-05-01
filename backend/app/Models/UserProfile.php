<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'age',
        'gender',
        'weight_kg',
        'height_cm',
        'fitness_goal',
        'experience_level',
        'training_days',
        'meals_per_day',
        'activity_level',
        'workout_preference',
        'food_preferences',
        'food_dislikes',
        'dietary_preferences',
        'allergies',
        'onboarding_completed',
    ];

    protected $casts = [
        'food_preferences' => 'array',
        'food_dislikes' => 'array',
        'dietary_preferences' => 'array',
        'allergies' => 'array',
        'onboarding_completed' => 'boolean',
    ];

    /**
     * Get the user that owns this profile
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
