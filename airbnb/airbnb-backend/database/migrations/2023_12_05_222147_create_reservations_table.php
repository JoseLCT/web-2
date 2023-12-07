<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("owner_id");
            $table->unsignedBigInteger("guest_id");
            $table->unsignedBigInteger("accommodation_id");
            $table->date("start_date");
            $table->date("end_date");
            $table->string("card_name", 100);
            $table->string("card_number", 16);
            $table->string("card_expiration", 7);
            $table->string("card_cvv", 3);
            $table->boolean("cancelled")->default(false);
            $table->foreign("owner_id")->references("id")->on("users");
            $table->foreign("guest_id")->references("id")->on("users");
            $table->foreign("accommodation_id")->references("id")->on("accommodations");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
