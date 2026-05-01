<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Meal extends Model
{

    protected $fillable = [
        'meal_plan_type_id',
        'type',
        'order_index',
    ];

    public function mealPlanType(): BelongsTo
    {
        return $this->belongsTo(MealPlanType::class, 'meal_plan_type_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(MealItem::class,);
    }
}
