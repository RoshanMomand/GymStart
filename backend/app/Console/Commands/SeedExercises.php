<?php

namespace App\Console\Commands;

use App\Models\Exercise;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class SeedExercises extends Command
{
    protected $signature = 'exercises:seed {--fresh : Truncate table before seeding} {--limit=10 : Results per API request (depends on RapidAPI plan)}';
    protected $description = 'Seed all exercises from ExerciseDB into the local database';

    private const BODY_PARTS = [
        'back', 'cardio', 'chest', 'lower arms', 'lower legs',
        'neck', 'shoulders', 'upper arms', 'upper legs', 'waist',
    ];

    private string $apiKey;
    private string $apiHost;
    private string $baseUrl = 'https://exercisedb.p.rapidapi.com';

    public function handle(): int
    {
        $this->apiKey  = config('services.exercisedb.key');
        $this->apiHost = config('services.exercisedb.host');

        if (!$this->apiKey || !$this->apiHost) {
            $this->error('RAPIDAPI_KEY or RAPIDAPI_HOST not set in .env');
            return 1;
        }

        if ($this->option('fresh')) {
            Exercise::truncate();
            $this->info('Table truncated.');
        }

        $limit = (int) $this->option('limit');
        $this->info("Fetching exercises from ExerciseDB (limit={$limit} per request)…");

        $exercises = $this->fetchAllByBodyPart($limit);

        if (empty($exercises)) {
            $this->error('No exercises retrieved. Check API key and host.');
            return 1;
        }

        $this->info('Fetched ' . count($exercises) . ' unique exercises. Inserting…');
        $this->insertExercises($exercises);

        $this->info('Done! ' . Exercise::count() . ' exercises in database.');
        return 0;
    }

    private function fetchAllByBodyPart(int $limitPerRequest): array
    {
        $all = [];

        foreach (self::BODY_PARTS as $bodyPart) {
            $this->line("  {$bodyPart}…");
            $offset = 0;
            $totalForPart = 0;

            do {
                $batch = $this->fetchPage($bodyPart, $limitPerRequest, $offset);

                if (empty($batch)) {
                    break;
                }

                $all = array_merge($all, $batch);
                $totalForPart += count($batch);
                $offset += $limitPerRequest;

                // If we got fewer than the limit, we've reached the end
                if (count($batch) < $limitPerRequest) {
                    break;
                }

                // Delay between pages to respect rate limits
                sleep(1);

            } while (true);

            $this->line("    {$totalForPart} exercises");

            // Delay between body parts
            sleep(1);
        }

        // Deduplicate by external id
        $unique = [];
        foreach ($all as $ex) {
            $id = (string)($ex['id'] ?? '');
            if ($id !== '' && !isset($unique[$id])) {
                $unique[$id] = $ex;
            }
        }

        return array_values($unique);
    }

    private function fetchPage(string $bodyPart, int $limit, int $offset): array
    {
        try {
            // rawurlencode preserves spaces as %20 (required for URL paths)
            $encoded  = rawurlencode($bodyPart);
            $response = Http::timeout(20)
                ->withHeaders([
                    'x-rapidapi-key'  => $this->apiKey,
                    'x-rapidapi-host' => $this->apiHost,
                ])
                ->get("{$this->baseUrl}/exercises/bodyPart/{$encoded}", [
                    'limit'  => $limit,
                    'offset' => $offset,
                ]);

            if (!$response->successful()) {
                $this->warn("    Page offset={$offset} failed ({$response->status()})");
                return [];
            }

            $data = $response->json();
            return is_array($data) ? $data : [];

        } catch (\Throwable $e) {
            $this->warn("    Error: {$e->getMessage()}");
            return [];
        }
    }

    private function insertExercises(array $exercises): void
    {
        foreach (array_chunk($exercises, 100) as $chunk) {
            $rows = array_map(fn($ex) => [
                'external_id'       => (string)($ex['id'] ?? ''),
                'name'              => $ex['name'] ?? '',
                'body_part'         => $ex['bodyPart']   ?? $ex['body_part']   ?? null,
                'equipment'         => $ex['equipment']  ?? null,
                'target'            => $ex['target']     ?? null,
                'difficulty'        => $ex['difficulty'] ?? null,
                'category'          => $ex['category']   ?? null,
                'description'       => $ex['description'] ?? null,
                'secondary_muscles' => json_encode($ex['secondaryMuscles'] ?? $ex['secondary_muscles'] ?? []),
                'gif_url'           => $ex['gifUrl']     ?? $ex['gif_url']   ?? null,
                'video_url'         => null,
                'instructions'      => json_encode($ex['instructions'] ?? []),
                'created_at'        => now(),
                'updated_at'        => now(),
            ], $chunk);

            $rows = array_values(array_filter($rows, fn($r) => $r['external_id'] !== ''));

            Exercise::upsert(
                $rows,
                ['external_id'],
                ['name', 'body_part', 'equipment', 'target', 'difficulty', 'category',
                 'description', 'secondary_muscles', 'gif_url', 'instructions', 'updated_at']
            );
        }
    }
}
