<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('meal_plans', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete()->after('id');
            $table->integer('calories')->nullable()->after('goal');
            $table->integer('protein')->nullable()->after('calories');
            $table->integer('carbs')->nullable()->after('protein');
            $table->integer('fats')->nullable()->after('carbs');
            $table->timestamp('generated_at')->nullable()->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('meal_plans', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'calories', 'protein', 'carbs', 'fats', 'generated_at']);
        });
    }
};
