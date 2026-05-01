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
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');

            // Basic Info
            $table->integer('age')->nullable()
                ->comment('Age in years');
            $table->enum('gender', ['male', 'female', 'other'])->nullable()
                ->comment('Gender');

            // Body metrics
            $table->decimal('weight_kg', 5, 2)->nullable()
                ->comment('Body weight in kilograms');
            $table->unsignedSmallInteger('height_cm')->nullable()
                ->comment('Height in centimetres');

            // Fitness level
            $table->enum('fitness_goal', ['lose_weight', 'build_muscle', 'maintain'])->nullable()
                ->comment('lose_weight, build_muscle, or maintain');
            $table->enum('experience_level', ['beginner', 'intermediate', 'advanced'])->nullable()
                ->comment('Training experience level');
            $table->tinyInteger('training_days')->nullable()
                ->comment('Days per week willing to train (1-7)');
            $table->enum('activity_level', ['sedentary', 'light', 'moderate', 'active', 'very_active'])->nullable()
                ->comment('Daily activity level');

            // Preferences
            $table->enum('workout_preference', ['gym', 'home', 'outdoor'])->nullable()
                ->comment('Preferred workout location');
            $table->json('food_preferences')->nullable()
                ->comment('Preferred food types');
            $table->json('food_dislikes')->nullable()
                ->comment('Foods to avoid');

            // Status
            $table->boolean('onboarding_completed')->default(false)
                ->comment('Whether onboarding is complete');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
