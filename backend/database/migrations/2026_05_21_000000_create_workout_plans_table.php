<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('workout_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');

            $table->json('exercises')->nullable()
                ->comment('Array of exercise IDs from ExerciseDB API');

            $table->text('notes')->nullable()
                ->comment('Additional notes about the workout plan');

            $table->boolean('is_active')->default(true)
                ->comment('Whether this plan is currently active');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workout_plans');
    }
};
