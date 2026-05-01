<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name' , 'email' , 'password'])]
#[Hidden(['password' , 'remember_token'])]
class User extends Authenticatable
{

    use HasFactory , Notifiable , HasApiTokens;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime' ,
            'password' => 'hashed' ,
        ];
    }

    // Get the user's profile
    public function profile(): HasOne
    {
        return $this->hasOne(UserProfile::class);
    }

    // Get the user's workout plan
    public function workoutPlan(): HasOne
    {
        return $this->hasOne(WorkoutPlan::class);
    }
}
