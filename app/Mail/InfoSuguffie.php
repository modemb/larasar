<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Content;

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
        ->markdown('emails.info')->with('content', $this->content);
        //return $this->markdown('emails.info');
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME')),
            subject: __($this->content['subject']),
        );
        // return new Envelope(
        //     from: new Address(env('MAIL_FROM_ADDRESS'), 'Jeffrey Way'),
        //     replyTo: [
        //         new Address('taylor@example.com', 'Taylor Otwell'),
        //     ],
        //     subject: 'Order Shipped',
        // );
    }

    /**
     * Get the message content definition.
     */
    // public function content(): Content
    // {
    //     return new Content(
    //         view: 'emails.info',
    //         with: [
    //           'content' => $this->content
    //             // 'orderName' => $this->order->name,
    //             // 'orderPrice' => $this->order->price,
    //         ],
    //     );
    // }
}
