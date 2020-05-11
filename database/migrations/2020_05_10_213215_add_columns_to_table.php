<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

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
     * php artisan migrate:rollback -- migrate
     * php artisan migrate && php artisan migrate
     * @return void
     */
    public function up()
    {
        $t = DB::table('migrations')
          ->where('migration', '2020_05_11_105435_remove_columns_from_migrations')
          ->delete();

        if($t) Schema::table($this->table, function (Blueprint $table) {
            // $table->string('profile')->nullable()->after('user_id');
            // $table->string('bio')->nullable()->after('user_id');
            // $table->bigInteger('analytic_id')->default(0)->after('id');
            $table->dropColumn([
                // 'user_id'
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
            // $table->foreignId('user_id');
            $table->dropColumn(
              [
                // 'profile',
                // 'bio'
                // 'analytic_id',
                // 'user_id'
              ]);
        });
    }
}
