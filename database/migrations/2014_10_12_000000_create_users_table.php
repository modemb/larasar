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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            // $table->bigIncrements('id');
            $table->foreignId('user_id')->default(0);
            $table->decimal('gain', 8, 2)->default(0);
            $table->string('role', 20)->default('User');
            $table->string('status', 20)->nullable();
            $table->string('name')->unique()->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->char('phone')->nullable();
            $table->string('password');
            $table->string('avatar')->nullable();
            // ====================Inertia========================= \\
            $table->foreignId('current_team_id')->nullable();
            $table->text('profile_photo_path')->nullable();
            // =====================Inertia End====================== \\
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->char('postal_code', 20)->nullable();
            $table->char('region_code', 2)->nullable();
            $table->char('country_code', 2)->nullable();
            $table->json('position')->nullable();
            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
};
