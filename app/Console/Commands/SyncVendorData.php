<?php

namespace App\Console\Commands;

use App\Permit;
use App\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SyncVendorData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:vendordata';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically sync permit count every day at 0:30 AM';

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
        $users = User::where('role','Vendor')->get();
        foreach($users as $user){
            $n = DB::table('permits')
                ->where([
                    ['vendor_id', $request->VendorId],
                    ['member_id', 0]
                ])->count();//Vendor Permits Count
            $user->update([
                'permits' =>    '<a  class="nav show" data-toggle="tab" href="#nav-vendor_unsold_permits" onclick="GetVendorPermits(`'.$user->id.'`)">
                '.$n.' Permits</a>',

            ]);
        }

          

    }
}
