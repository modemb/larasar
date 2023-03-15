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
        Schema::create('pics', function (Blueprint $table) {
            $table->id();

            // $table->foreignId('user_id')->default(0);
            // $table->foreignId('page_id')->default(0);
            // $table->foreignId('post_id')->default(0);
            // $table->foreignId('subcategory_id')->default(0);
            // $table->foreignId('category_id')->default(0);

            $table->foreignId('user_id')->nullable();
            $table->foreignId('page_id')->nullable();
            $table->foreignId('post_id')->nullable();
            $table->foreignId('subcategory_id')->nullable();
            $table->foreignId('category_id')->nullable();
            $table->string('name')->nullable();
            $table->string('pic')->nullable();
            $table->boolean('deleted')->nullable();
            $table->softDeletes();
            $table->timestamps();

            // $table->foreignId('pic_id')->nullable()->after('category_id');//subcategories
            // $table->foreignId('pic_id')->nullable()->after('id');//pages
            // $table->foreignId('pic_id')->nullable()->after('id');//ads
            // $table->foreignId('pic_id')->nullable()->after('user_id');//posts
            // $table->foreignId('pic_id')->nullable()->after('user_id');//users
            // $table->foreignId('pic_id')->nullable()->after('id');//categories
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pics');
    }
};
