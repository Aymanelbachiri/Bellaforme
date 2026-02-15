<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_settings', function (Blueprint $table) {
            $table->id();
            $table->string('smtp_host');
            $table->integer('smtp_port');
            $table->string('smtp_username')->nullable();
            $table->text('smtp_password')->nullable(); // encrypted via model cast
            $table->string('encryption')->default('tls'); // none, tls, ssl
            $table->string('from_address');
            $table->string('from_name');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_settings');
    }
};
