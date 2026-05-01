<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MealPlan extends Model
{
    protected $fillable = [
        'user_id',
        'goal',
        'calories',
        'protein',
        'carbs',
        'fats',
        'is_active',
        'generated_at',
    ];

    protected $casts = [
        'generated_at' => 'datetime',
        'is_active'    => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function types(): HasMany
    {
        return $this->hasMany(MealPlanType::class);
    }
}
