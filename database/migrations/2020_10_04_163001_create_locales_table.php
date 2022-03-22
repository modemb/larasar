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
        Schema::create('locales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->default(0);
            $table->foreignId('subcategory_id')->default(0);
            $table->string('categoryName')->nullable();
            $table->string('subcategoryName')->nullable();
            $table->string('description')->nullable(); // Category Description
            $table->char('lang', 10)->nullable();
            $table->boolean('deleted')->nullable();
            $table->softDeletes();
            $table->timestamps();
            // $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('locales');
    }
};
