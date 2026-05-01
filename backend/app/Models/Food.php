<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Food extends Model
{
    protected $table = 'foods';
    protected $fillable = [
        'external_id',
        'name',
        'calories',
        'protein',
        'carbs',
        'fats',
        'source',
    ];

    public function mealItems(): HasMany
    {
        return $this->hasMany(MealItem::class, 'food_id');
    }
}
