<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;


class MealPlan extends Model
{
    protected $fillable = ['goal', 'is_active',];

    public function types(): HasMany
    {
        return $this->hasMany(MealPlanType::class);
    }
}
