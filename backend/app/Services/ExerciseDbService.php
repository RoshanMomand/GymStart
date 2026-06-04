<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Throwable;

class ExerciseDbService
{
    private string $apiKey;
    private string $apiHost;
    private string $baseUrl = 'https://exercisedb.p.rapidapi.com';

    public function __construct()
    {
        $this->apiKey = config('services.exercisedb.key');
        $this->apiHost = config('services.exercisedb.host');
    }

    /**
     * Get all available body parts
     *
     * @return array
     */
    public function getBodyParts(): array
    {
        try {
            $response = Http::withHeaders([
                'x-rapidapi-key' => $this->apiKey,
                'x-rapidapi-host' => $this->apiHost,
            ])->get("{$this->baseUrl}/status");

            if (!$response->successful()) {
                return [
                    'error' => 'Failed to fetch body parts',
                    'status' => $response->status(),
                ];
            }

            return $response->json();
        } catch (Throwable $e) {
            return [
                'error' => 'Failed to fetch body parts',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get exercises by body part (chest, back, legs, etc.)
     *
     * @param string $bodyPart
     * @param int $limit
     * @return array
     */
    public function getExercisesByBodyPart(string $bodyPart, int $limit = 10): array
    {
        try {
            $response = Http::withHeaders([
                'x-rapidapi-key' => $this->apiKey,
                'x-rapidapi-host' => $this->apiHost,
            ])->get("{$this->baseUrl}/exercises/bodyPart/{$bodyPart}", [
                'limit' => $limit,
            ]);

            if (!$response->successful()) {
                return [
                    'error' => 'Failed to fetch exercises',
                    'status' => $response->status(),
                ];
            }

            return $this->formatExercises($response->json());
        } catch (Throwable $e) {
            return [
                'error' => 'Failed to fetch exercises',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get exercises by target muscle (biceps, triceps, chest, etc.)
     *
     * @param string $target
     * @param int $limit
     * @return array
     */
    public function getExercisesByTarget(string $target, int $limit = 10): array
    {
        try {
            $response = Http::withHeaders([
                'x-rapidapi-key' => $this->apiKey,
                'x-rapidapi-host' => $this->apiHost,
            ])->get("{$this->baseUrl}/exercises/target/{$target}", [
                'limit' => $limit,
            ]);

            if (!$response->successful()) {
                return [
                    'error' => 'Failed to fetch exercises',
                    'status' => $response->status(),
                ];
            }

            return $this->formatExercises($response->json());
        } catch (Throwable $e) {
            return [
                'error' => 'Failed to fetch exercises',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get exercises by equipment (dumbbell, barbell, cable, etc.)
     *
     * @param string $equipment
     * @param int $limit
     * @return array
     */
    public function getExercisesByEquipment(string $equipment, int $limit = 10): array
    {
        try {
            $response = Http::withHeaders([
                'x-rapidapi-key' => $this->apiKey,
                'x-rapidapi-host' => $this->apiHost,
            ])->get("{$this->baseUrl}/exercises/equipment/{$equipment}", [
                'limit' => $limit,
            ]);

            if (!$response->successful()) {
                return [
                    'error' => 'Failed to fetch exercises',
                    'status' => $response->status(),
                ];
            }

            return $this->formatExercises($response->json());
        } catch (Throwable $e) {
            return [
                'error' => 'Failed to fetch exercises',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get exercise by ID
     *
     * @param string $id
     * @return array
     */
    public function getExerciseById(string $id): array
    {
        try {
            $response = Http::withHeaders([
                'x-rapidapi-key' => $this->apiKey,
                'x-rapidapi-host' => $this->apiHost,
            ])->get("{$this->baseUrl}/exercises/exercise/{$id}");

            if (!$response->successful()) {
                return [
                    'error' => 'Exercise not found',
                    'status' => $response->status(),
                ];
            }

            $exercise = $response->json();
            return $this->formatExercise($exercise);
        } catch (Throwable $e) {
            return [
                'error' => 'Failed to fetch exercise',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get exercises filtered by body part AND equipment type (client-side filter)
     */
    public function getExercisesByBodyPartAndEquipment(
        string $bodyPart,
        array $equipmentTypes,
        int $limit = 5
    ): array {
        $exercises = $this->getExercisesByBodyPart($bodyPart, $limit * 8);

        if (isset($exercises['error']) || empty($exercises)) {
            return [];
        }

        $filtered = collect($exercises)
            ->filter(fn($ex) => in_array($ex['equipment'] ?? '', $equipmentTypes))
            ->take($limit)
            ->values()
            ->toArray();

        return count($filtered) >= 1 ? $filtered : array_slice($exercises, 0, $limit);
    }

    /**
     * Format a single exercise from API response
     *
     * @param array $exercise
     * @return array
     */
    private function formatExercise(array $exercise): array
    {
        return [
            'id' => $exercise['id'] ?? null,
            'name' => $exercise['name'] ?? 'Unknown',
            'body_part' => $exercise['bodyPart'] ?? null,
            'equipment' => $exercise['equipment'] ?? null,
            'target' => $exercise['target'] ?? null,
            'gif_url' => $exercise['gifUrl'] ?? null,
            'instructions' => $exercise['instructions'] ?? [],
        ];
    }

    /**
     * Format multiple exercises from API response
     *
     * @param array $exercises
     * @return array
     */
    private function formatExercises(array $exercises): array
    {
        return collect($exercises)->map(function ($exercise) {
            return $this->formatExercise($exercise);
        })->toArray();
    }
}
