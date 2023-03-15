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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->boolean('gallery_page')->nullable();
            $table->boolean('worldwide')->nullable();
            $table->boolean('state')->nullable();
            $table->foreignId('user_id')->nullable(); // post owner
            $table->foreignId('category_id')->nullable();
            $table->foreignId('subcategory_id')->nullable();
            $table->bigInteger('rank')->nullable();
            $table->bigInteger('count')->nullable();
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->dateTime('extend_date')->nullable();
            $table->string('post_title')->nullable();
            $table->decimal('price', 8, 2)->nullable();
            $table->char('currency_code', 3)->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('region')->nullable();
            $table->char('postal_code', 20)->nullable();
            $table->string('country')->nullable();
            $table->char('phone')->nullable();
            $table->string('location')->nullable();
            $table->string('place')->nullable();
            $table->decimal('lat', 10, 8)->nullable();// 45.4738
            $table->decimal('lon', 11, 8)->nullable();// -73.5875
            $table->longText('description')->nullable();
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
        Schema::dropIfExists('posts');
    }
};
