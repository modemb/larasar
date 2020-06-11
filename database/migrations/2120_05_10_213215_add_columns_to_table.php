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
        $this->table = 'categories'; // Table
    }

    /**
     * Run the migrations.
     * php artisan migrate:rollback --step=5 -- migrate
     * @return void
     */
    public function up()
    {
        Schema::table($this->table, function (Blueprint $table) {
            // $table->bigInteger('user_id')->default(0)->after('id'); // Example
            $table->dropColumn([
            // 'user_id', // Example
            ]);
        });
    }
}
