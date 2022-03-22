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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('post_id')->default(0);
            $table->string('token')->nullable(); // 9P927075LU9488235
            $table->string('PayerID')->nullable(); // UZHCGG3Q6VG5Y

            $table->dateTime('sale_date')->nullable();
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();

            $table->char('plan', 20)->default('Basic');
            $table->char('currency_code', 3)->nullable();
            $table->decimal('amount', 8, 2)->default(0);
            $table->json('links')->nullable();

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
        Schema::dropIfExists('payments');
    }
};
