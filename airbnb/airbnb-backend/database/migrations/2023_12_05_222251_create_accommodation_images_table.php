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
        Schema::create('accommodation_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("accommodation_id");
            $table->string("url", 100);
            $table->string("extension", 10);
            $table->foreign("accommodation_id")->references("id")->on("accommodations");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accommodation_images');
    }
};
