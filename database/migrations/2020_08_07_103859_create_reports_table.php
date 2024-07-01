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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable();
            $table->foreignId('post_id')->nullable();
            // $table->foreignId('payment_id')->nullable();
            $table->string('token')->nullable(); // 9P927075LU9488235

            $table->dateTime('sale_date')->nullable();
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();

            $table->string('product')->nullable();
            $table->char('plan', 20)->nullable();
            $table->decimal('payment', 10, 2)->default(0);
            $table->decimal('amount', 12, 2)->default(0); // Total Payments
            $table->decimal('paymentAmount', 12, 2)->default(0); // Total Payments
            $table->decimal('total', 12, 2)->default(0); // Exchanged Total Payments
            $table->char('currency_code', 3)->nullable();

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
        Schema::dropIfExists('reports');
    }
};
