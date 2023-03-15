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
        Schema::create('currencies', function (Blueprint $table) {
            $table->id();
            $table->char('from', 3)->nullable();  // XAU - XAG
            $table->char('to', 3)->nullable(); // XOF
            $table->char('from_to', 10)->nullable(); // XAU-XOF
            $table->char('from_name')->nullable(); // Canadian Dollar
            $table->char('to_name')->nullable(); // West African CFA franc
            $table->tinyInteger('decimal_digits')->nullable();//127
            $table->decimal('rate', 15, 2)->default(0);
            $table->decimal('amount', 15, 2)->default(0);
            $table->decimal('result', 15, 2)->default(0);
            $table->boolean('deleted')->nullable();//127
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('currencies');
    }
};
