<?php

namespace App\Console\Commands;
use App\Permit;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class DailyReminder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscription:closed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically sending reminder every specific days';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * This function handling as it stated, so sending renewal email , based on end_date difference days with today (midnight)
       if its meet 5 , 15 or 30 , it will sent only to them . 
     */
    public function handle()
    {
        $today = Carbon::now()->startOfDay();
        $lastmonth = $today->copy()->addDays(31);
        $permits = Permit::whereNotNull('end_date')->where('end_date','>',$today)->where('end_date','<=',$lastmonth)->whereNotIn('email',['member@ofatv.org','vendor@ofatv.org'])->get();
        $data = [];
        foreach($permits as $permit){
            $end_date = $permit->end_date;
                $diff = $today->diffInDays($end_date);
                if($diff == 15 || $diff == 5 || $diff == 30)
                {
                    if ($permit->email != null &&  $permit->email != "")
                    {
                        $member_id = $permit->member_id;
                        $check = Permit::where('member_id',$member_id)->whereIn('permit_type',['A','AR'])->orderBy('id','desc')->first();
                        if($check->id <> $permit->id){
                            Mail::send('emails.renewal', ['info' => $permit,'diff' => $diff], function ($m) use ($permit) {
                                $m->from(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));
                                $m->to($permit->email, $permit->first_name)->subject('Permit Renewal Reminder from Ontario Federation of All Terrain Vehicle Clubs (OFATV)');
                            });    
                        }
                    }
                }
            
        }
          

    }
}
