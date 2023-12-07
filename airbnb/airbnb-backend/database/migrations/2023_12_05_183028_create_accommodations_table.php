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
        Schema::create('accommodations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('location_id');
            $table->string('name', 100);
            $table->string('address', 100);
            $table->enum('type', ['casa', 'apartamento', 'hotel']);
            $table->string('description');
            $table->integer('rooms');
            $table->integer('beds');
            $table->integer('bathrooms');
            $table->integer('capacity');
            $table->boolean('wifi');
            $table->decimal('night_price', 6, 2);
            $table->decimal('cleaning_fee', 6, 2);
            $table->date('start_date');
            $table->date('end_date');
            $table->string('lat');
            $table->string('lng');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('location_id')->references('id')->on('locations');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accommodations');
    }
};
