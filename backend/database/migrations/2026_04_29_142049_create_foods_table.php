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
        Schema::create('foods', function (Blueprint $table) {
            $table->id();
            $table->integer('external_id')->nullable();
            $table->string('name')->nullable();
            $table->integer('calories')->nullable();
            $table->integer('protein')->nullable();
            $table->integer('carbs')->nullable();
            $table->integer('fats')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('foods');
    }
};
// public function up(): void
// {
//     Schema::create('meal_items', function (Blueprint $table) {
//         $table->id();
//         $table->foreignId('meal_id')
//             ->nullable()
//             ->constrained('meals')
//             ->cascadeOnDelete();

//         $table->string('food_name')->nullable();

//         $table->integer('grams')->nullable();
//         $table->integer('calories')->nullable();
//         $table->integer('protein')->nullable();
//         $table->integer('carbs')->nullable();
//         $table->integer('fats')->nullable();

//         $table->integer('external_id')->nullable();
//         $table->timestamps();
//     });
// }
