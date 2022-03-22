<?php

namespace App\Console\Commands;

use App\Permit;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SyncData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically sync permit count every day at 5 AM';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }


    public function handle()
    {
        ini_set('max_execution_time', 1800);
        $users = User::where('role','Member')->get();

        foreach($users as $user){
            $current = DB::table('permits')
                ->where('member_id', $user->id)
                ->where('expiry', '>=', 0)
                ->count();
            $exp = DB::table('permits')
                ->where('member_id', $user->id)
                ->where('expiry', '<', 0)
                ->count();
            $user->update([
                'current_permits' =>    '<a  class="nav show" data-toggle="tab" href="#nav-member_current_permits" onclick="GetMemberPermits(`'.$user->id.'`)">
                '.$current.' Current Permits
                </a>',
                'expired_permits' =>    '<a  class="nav show" data-toggle="tab" href="#nav-member_expired_permits" onclick="GetMemberExpiredPermits(`'.$user->id.'`)">
                '.$exp.' Expired Permits
                </a>']);
        }



    }
}
