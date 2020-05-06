<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
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
            $table->bigInteger('user_id')->default(0);
            $table->string('role')->default('Buyer');
            $table->string('status')->default('Active');
            $table->string('name');
            $table->string('phone')->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('avatar')->nullable();//->default('images/profile/default.jpg');
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->char('region_code', 2)->nullable();
            $table->char('country_code', 2)->nullable();
            $table->string('ip')->nullable();
            //====================ip=====================\\
            $table->string('continent_code')->nullable();
            $table->string('country')->nullable();
            $table->string('country_area')->nullable();
            $table->string('country_calling_code')->nullable();
            $table->string('country_capital')->nullable();
            $table->string('country_code_iso3')->nullable();
            $table->string('country_name')->nullable();
            $table->string('country_population')->nullable();
            $table->string('country_tld')->nullable();
            $table->string('currency')->nullable();
            $table->string('currency_name')->nullable();
            $table->string('in_eu')->nullable();
            $table->string('languages')->nullable();
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();
            $table->string('org')->nullable();
            $table->string('postal')->nullable();
            $table->string('region')->nullable();
            $table->string('timezone')->nullable();
            $table->string('utc_offset')->nullable();
            //====================ip end==================\\
            $table->rememberToken();
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
}
