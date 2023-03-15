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
        Schema::create('flags', function (Blueprint $table) {
            $table->id();
            $table->boolean('state')->nullable();
            $table->foreignId('user_id')->nullable();
            $table->foreignId('post_id')->nullable();
            $table->foreignId('subcategory_id')->nullable();
            $table->foreignId('category_id')->nullable();
            $table->string('ip', 45)->nullable();
            $table->longText('description')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flags');
    }
};
