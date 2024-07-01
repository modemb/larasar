<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * AddColumnsToTable: Add table and columns accordingly
     * Run the migrations: php artisan migrate
     */
    public function up(): void
    {
      Schema::table('users', function (Blueprint $table) {
          $table->dropColumn([ // 'user_id', // Example
              // 'post_title',
              // 'phone',
              // 'address',
              // 'postal_code',
              // 'description'
          ]); // $table->bigInteger('user_id')->default(0)->after('id'); // Example
          // $table->decimal('amount', 8, 2)->default(0)->after('payment');
          // $table->dateTime('sale_date')->nullable()->after('pics');
          // $table->decimal('gain', 8, 2)->default(0)->after('user_id');
          // $table->char('currency')->nullable()->after('place');//"CAD"
          // $table->string('code')->after('password');
      });
    }
};
