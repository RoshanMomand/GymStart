<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * WorkoutPlan model
 *
 * Represents a personalised workout plan belonging to a user.
 *
 * Table: workout_plans
 * Columns: see /docs/DATABASE_SCHEMA.md
 *
 * TODO: Add relationships (belongsTo User)
 * TODO: Add fillable / casts arrays
 */
class WorkoutPlan extends Model
{
    use HasFactory;

    // TODO: define $fillable
    // TODO: define $casts

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
