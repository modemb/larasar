<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('migrations')
          ->where('migration', '2120_05_10_213215_add_columns_to_table')
          ->delete();
        DB::table('migrations')
          ->where('migration', '2120_05_11_105435_remove_columns_from_migrations')
          ->delete();
    }
};
