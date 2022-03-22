<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class InfoSuguffie extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($content)
    {
        $this->content = $content;
    }   // https://laravel.com/docs/8.x/mail#generating-mailables

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from(env('MAIL_FROM_ADDRESS'))
        // ->markdown('emails.renewal')->with('content',$this->content)
        // ->markdown('emails.info')->with('content',$this->content)
        ->markdown('emails.payment')->with('content',$this->content)
        ;

        //return $this->markdown('emails.info');
    }
}
