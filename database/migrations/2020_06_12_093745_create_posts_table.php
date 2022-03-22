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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->boolean('gallery_page')->default(0);
            $table->boolean('worldwide')->default(0);
            $table->foreignId('user_id')->default(0); // post owner
            $table->foreignId('category_id')->default(0);
            $table->foreignId('subcategory_id')->default(0);
            $table->bigInteger('rank')->default(0);
            $table->bigInteger('count')->default(0);
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->dateTime('extend_date')->nullable();
            $table->string('post_title')->nullable();
            $table->decimal('price', 8, 2)->default(0);
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->char('phone')->nullable();
            $table->string('location')->nullable();
            $table->string('place')->nullable();
            // $table->smallInteger('lat')->nullable(); // 45
            // $table->smallInteger('lon')->nullable();// -73
            $table->char('postal_code', 20)->nullable();
            $table->longText('description')->nullable();
            $table->json('flags')->nullable();
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
        Schema::dropIfExists('posts');
    }
};
