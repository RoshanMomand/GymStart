<?php

    namespace App\Services;

    use App\Models\Exercise;
    use App\Models\User;
    use App\Models\WorkoutPlan;

    class WorkoutPlanService
    {
        // Gym equipment per experience level — home/outdoor is a future feature
        // Beginners: machines only — learn movement patterns safely
        // Intermediate: machines + cable + dumbbell (add free-weight variety)
        // Advanced: everything including plate-loaded / barbell work
        private const EQUIPMENT_BY_LEVEL = [
            'beginner'     => [
                'leverage machine',
                'smith machine'],
            'intermediate' => [
                'leverage machine',
                'smith machine',
                'cable',
                'dumbbell',
                'ez barbell'],
            'advanced'     => [
                'leverage machine',
                'smith machine',
                'cable',
                'dumbbell',
                'ez barbell',
                'barbell',
                'olympic barbell',
                'trap bar'],];

        // Difficulty levels that each experience level may receive
        // Advanced users can handle all difficulties; beginners only get beginner exercises
        private const DIFFICULTY_BY_LEVEL = [
            'beginner'     => ['beginner'],
            'intermediate' => [
                'beginner',
                'intermediate'],
            'advanced'     => [
                'beginner',
                'intermediate',
                'advanced'],];

        private const SETS_REPS = [
            'lose_weight'  => [
                'sets' => 3,
                'reps' => '12-15'],
            'build_muscle' => [
                'sets' => 4,
                'reps' => '8-12'],
            'maintain'     => [
                'sets' => 3,
                'reps' => '10-12'],];

        // Training splits keyed by number of training days
        // Body part values must match ExerciseDB / exercises table exactly
        private const SPLITS = [
            // 1 day: single full body session
            1 => [
                [
                    'Full Body',
                    [
                        'chest',
                        'back',
                        'upper legs',
                        'shoulders']],],
            // 2 days: upper / lower — each muscle group 1x/week
            2 => [
                [
                    'Upper Body',
                    [
                        'chest',
                        'back',
                        'shoulders',
                        'upper arms']],
                [
                    'Lower Body',
                    [
                        'upper legs',
                        'lower legs']],],
            // 3 days: Full Body A/B/C — each muscle group 3x/week (more frequency = better for beginners & intermediates)
            // PPL at 3 days only hits each group 1x/week which is too low
            3 => [
                [
                    'Full Body A',
                    [
                        'chest',
                        'back',
                        'upper legs']],
                [
                    'Full Body B',
                    [
                        'shoulders',
                        'back',
                        'upper legs']],
                [
                    'Full Body C',
                    [
                        'chest',
                        'upper arms',
                        'upper legs']],],
            // 4 days: Upper / Lower — each muscle group 2x/week
            4 => [
                [
                    'Upper A',
                    [
                        'chest',
                        'back',
                        'shoulders']],
                [
                    'Lower A',
                    [
                        'upper legs',
                        'lower legs']],
                [
                    'Upper B',
                    [
                        'chest',
                        'back',
                        'upper arms']],
                [
                    'Lower B',
                    [
                        'upper legs',
                        'lower legs']],],
            // 5 days: Upper / Lower / Push / Pull / Legs
            5 => [
                [
                    'Upper',
                    [
                        'chest',
                        'back',
                        'shoulders',
                        'upper arms']],
                [
                    'Lower',
                    [
                        'upper legs',
                        'lower legs']],
                [
                    'Push',
                    [
                        'chest',
                        'shoulders',
                        'upper arms']],
                [
                    'Pull',
                    [
                        'back',
                        'upper arms']],
                [
                    'Legs',
                    [
                        'upper legs',
                        'lower legs']],],
            // 6 days: PPL x2 — each muscle group 2x/week with high volume
            6 => [
                [
                    'Push A',
                    [
                        'chest',
                        'shoulders',
                        'upper arms']],
                [
                    'Pull A',
                    [
                        'back',
                        'upper arms']],
                [
                    'Legs A',
                    [
                        'upper legs',
                        'lower legs']],
                [
                    'Push B',
                    [
                        'chest',
                        'shoulders']],
                [
                    'Pull B',
                    [
                        'back',
                        'upper arms']],
                [
                    'Legs B',
                    [
                        'upper legs',
                        'lower legs']],],];

        public function generateForUser (User $user): WorkoutPlan
        {
            $profile = $user->profile;
            $trainingDays = min((int)($profile->training_days ?? 3), 6);
            $split = self::SPLITS[$trainingDays];

            $level = $profile->experience_level ?? 'beginner';
            $goal = $profile->fitness_goal ?? 'maintain';
            $equipment = self::EQUIPMENT_BY_LEVEL[$level] ?? self::EQUIPMENT_BY_LEVEL['beginner'];
            $difficulty = self::DIFFICULTY_BY_LEVEL[$level] ?? self::DIFFICULTY_BY_LEVEL['beginner'];
            $setsReps = self::SETS_REPS[$goal] ?? self::SETS_REPS['maintain'];

            // Fewer training days → more exercises per session
            $exercisesPerDay = $trainingDays <= 3 ? 6 : 4;

            $schedule = [];

            foreach ($split as $index => [$label, $bodyParts])
            {
                $dayExercises = [];
                $perBodyPart = max(2, (int)ceil($exercisesPerDay / count($bodyParts)));

                foreach ($bodyParts as $bodyPart)
                {
                    $exercises = Exercise::where('body_part', $bodyPart)->whereIn('equipment', $equipment)->whereIn('difficulty', $difficulty)->inRandomOrder()->limit($perBodyPart)->get();

                    foreach ($exercises as $exercise)
                    {
                        $dayExercises[] = [
                            'id'                => $exercise->external_id,
                            'name'              => $exercise->name,
                            'body_part'         => $exercise->body_part,
                            'equipment'         => $exercise->equipment,
                            'target'            => $exercise->target,
                            'difficulty'        => $exercise->difficulty,
                            'category'          => $exercise->category,
                            'description'       => $exercise->description,
                            'secondary_muscles' => $exercise->secondary_muscles ?? [],
                            'gif_url'           => $exercise->gif_url,
                            'video_url'         => $exercise->video_url,
                            'instructions'      => $exercise->instructions ?? [],
                            'sets'              => $setsReps['sets'],
                            'reps'              => $setsReps['reps'],];
                    }
                }

                $schedule[] = [
                    'day_number' => $index + 1,
                    'label'      => $label,
                    'exercises'  => $dayExercises,];
            }

            $restDayExercises = $this->buildRestDay($level);

            return WorkoutPlan::updateOrCreate(['user_id' => $user->id], [
                'exercises'          => $schedule,
                'rest_day_exercises' => $restDayExercises,
                'is_active'          => true,]);
        }

         /**
         * Build rest day cardio options based on experience level.
         * Science basis (PubMed):
         * - Cycling/elliptical cause the least muscle damage (concentric-dominant, no eccentric impact)
         *   compared to running which causes DOMS via eccentric/plyometric contractions.
         *   [Wilson et al. 2012, Beattie et al. 2017 — interference effect meta-analyses]
         * - Plyometric cardio (burpees, jump rope, sprints) significantly impairs recovery
         *   and interferes with strength adaptations via AMPK-mTOR pathway conflict.
         * - For all levels: intensity should stay at 30-60% VO2max (light/moderate).
         * Beginner:  machine-based only (bike, elliptical, treadmill) — zero eccentric load
         * Intermediate: + controlled non-jumping body weight cardio (walking variations, slow run)
         * Advanced:  + higher-effort body weight cardio, excluding only pure plyometric/burpee movements
         */
        private function buildRestDay (string $level): array
        {
            // Movements that always cause too much fatigue/muscle damage regardless of level
            $alwaysExcluded = [
                'burpee',
                'jack burpee',
                'dumbbell burpee',
                'double under jump rope',
                'wheel run',
                'bear crawl',];

            // Machine-based equipment = low/zero eccentric load (safest for all levels)
            $machineEquipment = [
                'stationary bike',
                'elliptical machine',
                'leverage machine',
                'stepmill machine'];

            // Plyometric body weight movements excluded for beginners and intermediates
            $plyometricExcluded = [
                'jump rope',
                'jack jump (male)',
                'star jump (male)',
                'skips',
                'astride jumps (male)',
                'swing 360',
                'quick feet run',
                'short stride run',
                'ski step',
                'semi squat jump (male)',
                'scissor jumps (male)',
                'skater hops',
                'push to run',];

            $query = Exercise::where('body_part', 'cardio')->whereNotIn('name', $alwaysExcluded)->orderByRaw("CASE equipment
                WHEN 'stationary bike'    THEN 1
                WHEN 'elliptical machine' THEN 2
                WHEN 'leverage machine'   THEN 3
                WHEN 'stepmill machine'   THEN 4
                ELSE                           5
            END");

            if ($level === 'beginner')
            {
                // 3 options only — evidence-based least-interference cardio for beginners:
                // 1. Stationary bike  — concentric-only, zero eccentric, highest evidence
                // 2. Elliptical       — low-impact, mimics cycling mechanics
                // 3. Incline treadmill walking — lowest intensity, no plyometric component
                return Exercise::whereIn('name', [
                    'stationary bike run v. 3',
                    'walk elliptical cross trainer',
                    'walking on incline treadmill',])->get()->map(fn ($exercise) => [
                    'id'        => $exercise->external_id,
                    'name'      => $exercise->name,
                    'equipment' => $exercise->equipment,
                    'gif_url'   => $exercise->gif_url,
                    'video_url' => $exercise->video_url,
                    'duration'  => '20-30 min',])->toArray();
            } elseif ($level === 'intermediate')
            {
                // Machine + controlled body weight (no jumping/plyometric)
                $query->where(function ($q) use ($machineEquipment, $plyometricExcluded) {
                    $q->whereIn('equipment', $machineEquipment)->orWhere(function ($q2) use ($plyometricExcluded) {
                        $q2->where('equipment', 'body weight')->whereNotIn('name', $plyometricExcluded);
                    });
                });
            }
            // advanced: all cardio minus always-excluded (query already has whereNotIn)

            return $query->get()->map(fn ($exercise) => [
                'id'        => $exercise->external_id,
                'name'      => $exercise->name,
                'equipment' => $exercise->equipment,
                'gif_url'   => $exercise->gif_url,
                'video_url' => $exercise->video_url,
                'duration'  => '20-30 min',])->toArray();
        }

        public function getPlanForUser (User $user): ?WorkoutPlan
        {
            return WorkoutPlan::where('user_id', $user->id)->where('is_active', true)->first();
        }
    }
