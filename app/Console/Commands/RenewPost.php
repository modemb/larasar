<?php

namespace App\Console\Commands;

// use Carbon\Carbon;
use App\Models\Post;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class RenewPost extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'renew:post';

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
      // ini_set('max_execution_time', 1800);
      $posts = Post::all(); // TagShow: PostModule
      foreach ($posts as $key => $post) { // Show Post
        $current_date = date_create(date('Y-m-d H:i:s'));
        // ----------------- TagIndex: PostPaymentModule ---------------------- \\
        $payment = $post->payments->where('end_date', '>', date('Y-m-d H:i:s'))->where('PayerID', '<>', '')->first();
        $payment_end_date = $payment ? date_create($payment->end_date) : $current_date;
        $payment_expiry = date_diff($current_date, $payment_end_date);
        $payment_expiry = $payment_expiry->format('%a'); // Payment Expiry Date
        // ------------------ PostPaymentModule End ---------------------------- \\
        try { // ------------ TagIndex: PostRankModule --------------------------- \\
          $payment_start_date = date_create($payment->start_date);
          $renew_post=date_diff($payment_start_date, $current_date);
          $renew_post=$renew_post->format('%a');
          // =========================Check Renew Date==================== \\
          if ($payment->amount == 5) $true = $renew_post >= 7 ? 1 : 0;
          if ($payment->amount == 10) $true = $renew_post >= 5 ? 1 : 0;
          if ($payment->amount == 15) $true = $renew_post >= 3 ? 1 : 0;
          // ==========================Check Renew Date End================ \\
          if ($true && $payment_expiry > 0) {
            $post->end_date = date('Y-m-d H:i:s', strtotime('1 month'));
            Payment::where('post_id', $post->id)->update([
                'start_date' => date('Y-m-d H:i:s')
            ]); $post->rank = time(); $post->update();
          } // Bump Up & Extend Post End Date
        } catch (\Throwable $th) {
          //throw $th;
        } // ---------------- PostRankModule End ------------------------------- \\
      } echo 'Cron Job Done';
    }
}
