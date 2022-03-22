<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
          // $table->increments('id');
            $table->id();
            $table->foreignId('room_id')->nullable();
            $table->bigInteger('user_id')->unsigned(); // Get User Data For the Message
            // $table->bigInteger('post_id')->unsigned();
            $table->text('message')->nullable();
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
        Schema::dropIfExists('messages');
    }
};
