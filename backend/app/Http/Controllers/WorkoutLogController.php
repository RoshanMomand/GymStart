<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use App\Models\WorkoutSession;
use App\Models\WorkoutSet;
use App\Services\WorkoutPlanService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkoutLogController extends Controller
{
    public function __construct(protected WorkoutPlanService $workoutPlanService) {}

    // ── Sessions ─────────────────────────────────────────────────────────────

    public function indexSessions(): JsonResponse
    {
        $sessions = WorkoutSession::where('user_id', auth()->id())
            ->with(['sets.exercise'])
            ->orderByDesc('trained_at')
            ->get()
            ->map(fn ($session) => $this->formatSession($session));

        return response()->json(['data' => $sessions]);
    }

    public function storeSession(Request $request): JsonResponse
    {
        $data = $request->validate([
            'day_name'   => 'required|string|max:100',
            'trained_at' => 'nullable|date',
            'notes'      => 'nullable|string|max:1000',
        ]);

        $plan = $this->workoutPlanService->getPlanForUser(auth()->user());

        if (!$plan) {
            return response()->json(['error' => 'No active workout plan found'], 404);
        }

        $session = WorkoutSession::create([
            'user_id'         => auth()->id(),
            'workout_plan_id' => $plan->id,
            'day_name'        => $data['day_name'],
            'trained_at'      => $data['trained_at'] ?? now(),
            'notes'           => $data['notes'] ?? null,
        ]);

        return response()->json([
            'message' => 'Session created',
            'data'    => $this->formatSession($session->load('sets.exercise')),
        ], 201);
    }

    public function showSession(WorkoutSession $session): JsonResponse
    {
        $this->authorizeSession($session);

        return response()->json([
            'data' => $this->formatSession($session->load('sets.exercise')),
        ]);
    }

    public function destroySession(WorkoutSession $session): JsonResponse
    {
        $this->authorizeSession($session);
        $session->delete();

        return response()->json(['message' => 'Session deleted']);
    }

    // ── Sets ─────────────────────────────────────────────────────────────────

    public function storeSets(Request $request, WorkoutSession $session): JsonResponse
    {
        $this->authorizeSession($session);

        $data = $request->validate([
            'sets'                  => 'required|array|min:1',
            'sets.*.external_id'    => 'required|string',
            'sets.*.set_number'     => 'required|integer|min:1',
            'sets.*.reps_completed' => 'required|integer|min:0',
            'sets.*.weight_kg'      => 'nullable|numeric|min:0',
            'sets.*.notes'          => 'nullable|string|max:500',
        ]);

        $externalIds = collect($data['sets'])->pluck('external_id')->unique()->values();

        $exercises = Exercise::whereIn('external_id', $externalIds)
            ->pluck('id', 'external_id');

        $created = [];

        foreach ($data['sets'] as $setData) {
            $exerciseId = $exercises->get($setData['external_id']);

            if (!$exerciseId) {
                return response()->json([
                    'error' => "Exercise not found: {$setData['external_id']}",
                ], 422);
            }

            $created[] = WorkoutSet::create([
                'workout_session_id' => $session->id,
                'exercise_id'        => $exerciseId,
                'set_number'         => $setData['set_number'],
                'reps_completed'     => $setData['reps_completed'],
                'weight_kg'          => $setData['weight_kg'] ?? null,
                'notes'              => $setData['notes'] ?? null,
            ]);
        }

        return response()->json([
            'message' => 'Sets logged',
            'data'    => $this->formatSession($session->load('sets.exercise')),
        ], 201);
    }

    public function updateSet(Request $request, WorkoutSession $session, WorkoutSet $set): JsonResponse
    {
        $this->authorizeSession($session);

        $data = $request->validate([
            'reps_completed' => 'sometimes|integer|min:0',
            'weight_kg'      => 'sometimes|nullable|numeric|min:0',
            'notes'          => 'sometimes|nullable|string|max:500',
        ]);

        $set->update($data);

        return response()->json([
            'message' => 'Set updated',
            'data'    => $this->formatSession($session->load('sets.exercise')),
        ]);
    }

    public function destroySet(WorkoutSession $session, WorkoutSet $set): JsonResponse
    {
        $this->authorizeSession($session);
        $set->delete();

        return response()->json(['message' => 'Set deleted']);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function authorizeSession(WorkoutSession $session): void
    {
        abort_if($session->user_id !== auth()->id(), 403, 'Forbidden');
    }

    private function formatSession(WorkoutSession $session): array
    {
        return [
            'id'              => $session->id,
            'workout_plan_id' => $session->workout_plan_id,
            'day_name'        => $session->day_name,
            'trained_at'      => $session->trained_at,
            'notes'           => $session->notes,
            'sets'            => $session->sets->map(fn ($set) => [
                'id'             => $set->id,
                'exercise_id'    => $set->exercise?->external_id,
                'exercise_name'  => $set->exercise?->name,
                'set_number'     => $set->set_number,
                'reps_completed' => $set->reps_completed,
                'weight_kg'      => $set->weight_kg,
                'notes'          => $set->notes,
            ]),
        ];
    }
}
