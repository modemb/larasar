<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add table and columns accordingly
     * Run the migrations: php artisan migrate
     * @return void
     */
    public function up()
    {
      Schema::table('posts', function (Blueprint $table) {
          $table->dropColumn([ // 'user_id', // Example
              // 'post_title',
              // 'phone',
              // 'address',
              // 'postal_code',
              // 'description'
          ]); // $table->bigInteger('user_id')->default(0)->after('id'); // Example
          // $table->decimal('amount', 8, 2)->default(0)->after('payment');
          // $table->dateTime('sale_date')->nullable()->after('pics');
          // $table->foreignId('message_id')->nullable()->after('user_id');
          // $table->string('link')->nullable()->after('name');
          // $table->string('name')->nullable()->after('id');
      });
    }
};
