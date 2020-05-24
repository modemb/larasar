<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class DeleteColumnsFromMigrations extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('migrations')
          ->where('migration', '2020_05_10_213215_add_columns_to_table')
          ->delete();
        DB::table('migrations')
          ->where('migration', '2020_05_11_105435_remove_columns_from_migrations')
          ->delete();
    }
}
