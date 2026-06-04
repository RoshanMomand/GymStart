<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('exercises', function (Blueprint $table) {
            $table->string('difficulty')->nullable()->index()->after('target');
            $table->string('category')->nullable()->after('difficulty');
            $table->text('description')->nullable()->after('category');
            $table->json('secondary_muscles')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('exercises', function (Blueprint $table) {
            $table->dropColumn(['difficulty', 'category', 'description', 'secondary_muscles']);
        });
    }
};
