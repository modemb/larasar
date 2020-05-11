<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class RemoveColumnsFromMigrations extends Migration
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
    }
}
