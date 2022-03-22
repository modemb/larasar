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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable();
            $table->foreignId('payment_id')->nullable();
            $table->string('token')->nullable(); // 9P927075LU9488235

            $table->dateTime('sale_date')->nullable();
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();

            $table->char('plan', 20)->default('Basic');
            $table->char('currency_code', 3)->nullable();
            $table->decimal('payment', 8, 2)->default(0);
            $table->decimal('amount', 8, 2)->default(0); // Total Payments

            // $table->json('links')->nullable();
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
        Schema::dropIfExists('reports');
    }
};
