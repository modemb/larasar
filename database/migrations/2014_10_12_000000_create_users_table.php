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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable();
            $table->decimal('gain', 12, 2)->default(0);
            $table->decimal('rate', 15, 2)->default(0);
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
            $table->text('profile_photo_path', 2048)->nullable();
            // =====================Inertia End====================== \\
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('region')->nullable();
            $table->char('postal_code', 20)->nullable();
            $table->char('currency_code', 3)->nullable();
            $table->char('country_code', 2)->nullable();
            $table->string('country')->nullable();
            $table->char('locale', 6)->nullable();
            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
};
