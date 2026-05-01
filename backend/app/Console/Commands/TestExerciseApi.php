<?php

namespace App\Console\Commands;

use App\Services\ExerciseDbService;
use Illuminate\Console\Command;

class TestExerciseApi extends Command
{
    protected $signature = 'test:exercise-api {body_part=chest} {limit=10}';
    protected $description = 'Test ExerciseDB API connection';

    public function handle()
    {
        $service = new ExerciseDbService();
        $bodyPart = $this->argument('body_part');
        $limit = $this->argument('limit');

        $this->info("Testing ExerciseDB API with body_part: {$bodyPart}, limit: {$limit}");
        $this->line('');

        $result = $service->getExercisesByBodyPart($bodyPart , (int)$limit);

        if (isset($result['error'])) {
            $this->error(" ERROR: {$result['error']}");
            if (isset($result['message'])) {
                $this->line("Message: {$result['message']}");
            }
            $this->line("Full response: " . json_encode($result));
            return 1;
        }

        $this->info(" SUCCESS! Got " . count($result) . " exercises");
        $this->line('');
        $this->table(
            ['ID' , 'Name' , 'Body Part' , 'Target' , 'Equipment'] ,
            array_map(function ($exercise) {
                return [
                    $exercise['id'] ?? 'N/A' ,
                    substr($exercise['name'] ?? 'N/A' , 0 , 30) ,
                    $exercise['body_part'] ?? 'N/A' ,
                    $exercise['target'] ?? 'N/A' ,
                    $exercise['equipment'] ?? 'N/A' ,
                ];
            } , array_slice($result , 0 , 5))
        );

        $this->line('');
        $this->info("Showing " . count($result) . " of" . count($result) . " results...");

        return 0;
    }
}
