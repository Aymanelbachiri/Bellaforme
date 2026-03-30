<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('solutions_settings', function (Blueprint $table) {
            $table->id();
            $table->string('hero_title')->default('');
            $table->text('hero_subtitle')->default('');
            $table->string('hero_image')->default('');
            $table->json('sections')->default('[]');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('solutions_settings');
    }
};
