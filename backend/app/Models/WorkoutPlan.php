<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkoutPlan extends Model
{
    protected $fillable = [
        'user_id',
        'exercises',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'exercises' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the user that this workout plan belongs to
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
