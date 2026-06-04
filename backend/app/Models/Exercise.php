<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exercise extends Model
{
    protected $fillable = [
        'external_id',
        'name',
        'body_part',
        'equipment',
        'target',
        'difficulty',
        'category',
        'description',
        'secondary_muscles',
        'gif_url',
        'video_url',
        'instructions',
    ];

    protected $casts = [
        'instructions'      => 'array',
        'secondary_muscles' => 'array',
    ];

    public function workoutSets(): HasMany
    {
        return $this->hasMany(WorkoutSet::class);
    }
}
