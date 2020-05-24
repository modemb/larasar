<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToTable extends Migration
{
    /**
     * Create Update Columns.
     * https://laravel.com/docs/7.x/migrations#columns
     * @return void
     */
    public function __construct()
    {
        $this->table = 'users'; // Table
    }

    /**
     * Run the migrations.
     * php artisan migrate:rollback --step=5 -- migrate
     * @return void
     */
    public function up()
    {
        Schema::table($this->table, function (Blueprint $table) {
            // $table->string('phone')->nullable()->after('name');
            // $table->bigInteger('analytic_id')->default(0)->after('id');
            // $table->bigInteger('user_id')->default(0)->after('id');
            $table->dropColumn([
              // 'phone',
              // 'user_id',
              // 'analytic_id'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table($this->table, function (Blueprint $table) {
            $table->dropColumn([
              // 'profile',
              // 'bio'
              // 'analytic_id',
              // 'user_id'
            ]);
        });
    }
}
