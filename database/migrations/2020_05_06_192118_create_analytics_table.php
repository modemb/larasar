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
        Schema::create('analytics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->default(0);
            $table->foreignId('host_id')->default(0);
            $table->string('session', 20)->nullable();
            //=============IPAPI============\\
            $table->string('asn')->nullable();
            //---------------city----------------\\
            $table->string('city')->nullable();
            $table->char('continent_code', 2)->nullable();
            //---------------country----------------\\
            // $table->char('country', 2)->nullable();
            $table->string('country')->nullable(); // "CA"
            $table->bigInteger('country_area')->nullable();
            $table->mediumInteger('country_calling_code')->nullable();//"+1"
            $table->string('country_capital')->nullable();
            $table->char('country_code', 2)->nullable();
            $table->char('country_code_iso3')->nullable();//: "CAN"
            $table->string('country_name')->nullable();// "Canada"
            $table->bigInteger('country_population')->nullable();
            $table->char('country_tld')->nullable(); //".ca"
            $table->char('currency')->nullable();//"CAD"
            $table->string('currency_name')->nullable();
            $table->boolean('in_eu')->nullable();
            $table->string('ip', 45)->nullable();
            $table->string('languages')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            //---------------org----------------\\
            $table->string('org')->nullable();//"Virgin Home Quebec"
            $table->string('postal')->nullable();
            //----------------region---------------\\
            $table->string('region')->nullable();//Quebec
            $table->char('region_code', 2)->nullable();//QC
            //----------------timezone---------------\\
            $table->string('timezone')->nullable();//"America/Toronto"
            $table->smallInteger('utc_offset')->nullable(); //"-0400"
            //=========IPAPI End==========\\
            //=========IP-API==============\\
            $table->string('as')->nullable();
            $table->char('countryCode')->nullable(); //"CA"
            $table->string('isp')->nullable(); // "Bell Canada"
            $table->decimal('lat', 10, 8)->nullable();// 45.4738
            $table->decimal('lon', 11, 8)->nullable();// -73.5875
            $table->string('query')->nullable();// "142.118.246.20"
            // $table->string('region');// "QC"
            $table->string('regionName')->nullable();// "Quebec"
            // $table->string('status')->nullable();// "success"
            $table->string('zip')->nullable();// "H4C"
            //=========IP-API End=============\\
            $table->boolean('app')->nullable();
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
        Schema::dropIfExists('analytics');
    }
};
