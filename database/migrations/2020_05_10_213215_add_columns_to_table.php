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
        $this->table = 'users';
    }

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table($this->table, function (Blueprint $table) {
            // $table->string('profile')->nullable()->after('user_id');
            // $table->string('bio')->nullable()->after('user_id');
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
            $table->dropColumn(
              [
                'profile',
                'bio'
              ]);
        });
    }
}
