<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MealPlanType extends Model
{
    protected $fillable = [
        'mealplan_id',
        'type',
        'calories',
        'carbs',
        'protein',
        'fats',
    ];


    public function mealplan(): BelongsTo
    {
        return $this->belongsTo(MealPlan::class);
    }

    public function meals(): HasMany
    {
        return $this->hasMany(Meal::class);
    }
}
