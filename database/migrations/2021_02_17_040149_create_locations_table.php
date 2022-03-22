<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('city')->nullable();
            $table->string('region')->nullable();
            $table->string('country')->nullable();
            $table->string('place')->nullable();
            $table->decimal('latitude', 10, 8)->nullable(); // 45.4738
            $table->decimal('longitude', 11, 8)->nullable(); // -73.5875
            $table->smallInteger('lat')->nullable(); // 45
            $table->smallInteger('lon')->nullable();// -73
            $table->smallInteger('utc_offset')->nullable(); //"-0400"
            $table->boolean('deleted')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('locations');
    }
};
