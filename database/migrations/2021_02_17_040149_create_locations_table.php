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
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('city')->nullable();
            $table->string('region')->nullable();
            $table->string('country')->nullable();
            $table->string('place')->nullable();
            $table->char('currency', 3)->nullable();//"CAD"
            $table->string('currency_name')->nullable();
            $table->decimal('latitude', 10, 8)->nullable(); // 45.4738
            $table->decimal('longitude', 11, 8)->nullable(); // -73.5875
            $table->smallInteger('utc_offset')->nullable(); //"-0400"
            $table->boolean('deleted')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
