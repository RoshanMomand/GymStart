<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('user_profiles', function (Blueprint $table) {
            $table->json('dietary_preferences')->nullable()
                ->comment('Dietary style preferences: vegetarian, vegan, keto, etc.')
                ->after('food_dislikes');
            $table->json('allergies')->nullable()
                ->comment('Food allergies: gluten-free, nut-free, dairy-free, etc.')
                ->after('dietary_preferences');
        });
    }

    public function down(): void
    {
        Schema::table('user_profiles', function (Blueprint $table) {
            $table->dropColumn(['dietary_preferences', 'allergies']);
        });
    }
};
