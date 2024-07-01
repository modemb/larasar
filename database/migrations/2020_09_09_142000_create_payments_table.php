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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('post_id')->nullable();
            $table->string('token')->nullable(); // 9P927075LU9488235
            $table->string('PayerID')->nullable(); // UZHCGG3Q6VG5Y

            $table->dateTime('sale_date')->nullable();
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();

            $table->char('plan', 20)->nullable();
            $table->decimal('amount', 12, 2)->default(0);
            $table->char('currency_code', 3)->nullable();
            $table->json('links')->nullable();

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
        Schema::dropIfExists('payments');
    }
};
