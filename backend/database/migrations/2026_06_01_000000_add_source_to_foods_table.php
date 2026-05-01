<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('foods', function (Blueprint $table) {
            $table->string('source', 20)->nullable()->default('seed')->after('fats')
                ->comment('seed = curated local data, api = fetched from OpenFoodFacts');
        });
    }

    public function down(): void
    {
        Schema::table('foods', function (Blueprint $table) {
            $table->dropColumn('source');
        });
    }
};
