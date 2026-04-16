<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * MealPlan model
 *
 * Represents a personalised meal plan belonging to a user.
 *
 * Table: meal_plans
 * Columns: see /docs/DATABASE_SCHEMA.md
 *
 * TODO: Add relationships (belongsTo User)
 * TODO: Add fillable / casts arrays
 */
class MealPlan extends Model
{
    use HasFactory;

    // TODO: define $fillable
    // TODO: define $casts

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
