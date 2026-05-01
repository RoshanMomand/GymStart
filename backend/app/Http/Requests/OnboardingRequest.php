<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OnboardingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'age' => 'required|integer|min:13|max:120',
            'gender' => 'required|in:male,female,other',
            'weight_kg' => 'required|numeric|min:30|max:500',
            'height_cm' => 'required|integer|min:100|max:250',
            'fitness_goal' => 'required|in:lose_weight,build_muscle,maintain',
            'experience_level' => 'required|in:beginner,intermediate,advanced',
            'training_days'  => 'required|integer|min:1|max:7',
            'meals_per_day'  => 'nullable|integer|min:3|max:5',
            'activity_level' => 'required|in:sedentary,light,moderate,active,very_active',
            'workout_preference' => 'required|in:gym,home,outdoor',
            'food_preferences' => 'required|array|min:1',
            'food_preferences.*' => 'required|string',
            'food_dislikes' => 'nullable|array',
            'food_dislikes.*' => 'nullable|string',
            'dietary_preferences' => 'nullable|array',
            'dietary_preferences.*' => 'nullable|string',
            'allergies' => 'nullable|array',
            'allergies.*' => 'nullable|string',
        ];
    }

    /**
     * Get custom error messages for validation failures
     */
    public function messages(): array
    {
        return [
            'age.required' => 'Age is required',
            'age.min' => 'You must be at least 13 years old',
            'gender.required' => 'Gender is required',
            'weight_kg.required' => 'Weight is required',
            'height_cm.required' => 'Height is required',
            'fitness_goal.required' => 'Fitness goal is required',
            'experience_level.required' => 'Experience level is required',
            'training_days.required' => 'Number of training days is required',
            'activity_level.required' => 'Activity level is required',
            'workout_preference.required' => 'Workout preference is required',
            'food_preferences.required' => 'Please select at least one food preference',
            'food_preferences.min' => 'Please select at least one food preference',
        ];
    }
}
