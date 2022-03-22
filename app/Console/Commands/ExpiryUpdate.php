<?php

namespace App\Console\Commands;

use App\Permit;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class ExpiryUpdate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'expiry:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically updating expiry date every day at 4 AM';

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

        $current_date = date_create(date("m/d/Y"));//$date1=date_create('2019-10-15');
        $permits = Permit::all();
        foreach ($permits as $key => $permit) {
            if(!is_null($permit->end_date)){   
                $end_date = date_create($permit->end_date);
                $expiry=date_diff($current_date, $end_date);
                $expiry= $expiry->format("%R%a");
                if($expiry < 0){
                    $permit->expiry = 0;
                }
                else{   
                    $permit->expiry = $expiry ;
                }
                $permit->save();    
            }


        }

          

    }
}
