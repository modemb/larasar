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
        Schema::create('pics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->default(0);
            $table->foreignId('page_id')->default(0);
            $table->foreignId('post_id')->default(0);
            $table->foreignId('subcategory_id')->default(0);
            $table->foreignId('category_id')->default(0);
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
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pics');
    }
};
