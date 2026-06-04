<?php

namespace App\Http\Controllers;

use App\Models\WeightLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'workout_preference'    => 'sometimes|in:gym,home,outdoor',
            'training_days'         => 'sometimes|integer|min:1|max:7',
            'food_preferences'      => 'sometimes|array',
            'food_preferences.*'    => 'string',
            'dietary_preferences'   => 'sometimes|array',
            'dietary_preferences.*' => 'string',
            'allergies'             => 'sometimes|array',
            'allergies.*'           => 'string',
            'food_dislikes'         => 'sometimes|array',
            'food_dislikes.*'       => 'string',
        ]);

        $profile = Auth::user()->profile;

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        $profile->update($request->only([
            'workout_preference', 'training_days',
            'food_preferences', 'dietary_preferences',
            'allergies', 'food_dislikes',
        ]));

        return response()->json(['message' => 'Profile updated', 'data' => $profile]);
    }

    public function updateName(Request $request): JsonResponse
    {
        $request->validate(['name' => 'required|string|min:2|max:255']);
        $user = Auth::user();
        $user->update(['name' => $request->name]);
        return response()->json(['message' => 'Name updated', 'data' => ['name' => $user->name]]);
    }

    public function show(Request $request): JsonResponse
    {
        $user = Auth::user();
        $profile = $user->profile;

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        return response()->json(['data' => $profile]);
    }

    public function updateWeight(Request $request): JsonResponse
    {
        $request->validate([
            'weight_kg' => 'required|numeric|min:30|max:500',
        ]);

        $user    = Auth::user();
        $profile = $user->profile;

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        $profile->update(['weight_kg' => $request->weight_kg]);

        $log = WeightLog::create([
            'user_id'   => $user->id,
            'weight_kg' => $request->weight_kg,
            'logged_at' => now(),
        ]);

        // Delta vs most recent previous log entry
        $previous = WeightLog::where('user_id', $user->id)
            ->where('id', '<', $log->id)
            ->orderByDesc('logged_at')
            ->first();

        $delta = $previous ? round($request->weight_kg - $previous->weight_kg, 2) : null;

        return response()->json([
            'message' => 'Weight updated',
            'data'    => [
                'weight_kg'    => $profile->weight_kg,
                'logged_at'    => $log->logged_at,
                'delta_kg'     => $delta,
            ],
        ]);
    }

    public function weightHistory(): JsonResponse
    {
        $logs = WeightLog::where('user_id', Auth::id())
            ->orderByDesc('logged_at')
            ->limit(90)
            ->get()
            ->map(fn ($log) => [
                'id'        => $log->id,
                'weight_kg' => $log->weight_kg,
                'logged_at' => $log->logged_at,
            ]);

        return response()->json(['data' => $logs]);
    }
}
