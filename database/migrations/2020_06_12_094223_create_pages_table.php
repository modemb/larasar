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
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            // $table->foreignId('page_id')->default(0);
            $table->char('locale', 10)->nullable();
            $table->string('icon')->nullable();
            $table->string('page_title')->nullable();
            $table->string('slug')->nullable();
            $table->string('description')->nullable();
            $table->json('pics')->nullable();
            $table->longText('content')->nullable();
            $table->boolean('active')->nullable();
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
        Schema::dropIfExists('pages');
    }
};
