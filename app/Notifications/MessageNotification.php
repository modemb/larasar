<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class MessageNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database', 'broadcast', WebPushChannel::class];
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        // $chat = array_key_last($notifiable->messages);
        // $chat = end($notifiable->messages)[0];
        // $i = $auth->messages->count();
        // $chat = $auth->messages[$i-1]
        $auth = auth()->user();
        $chat = $auth->messages->last(); return [
          // 'title' => $chat,
          'avatar' => $auth->avatar??$auth->new['avatar'], //'Hello from Laravel!',
          'title' => $auth->name, //'Hello from Laravel!',
          'body' => $chat->message,//'Thank you for using our application.',
          'action_url' => '/chat/'.$chat->room_id, //'/profile',
          'created' => Carbon::now()->toIso8601String(),
        ];// Send Notification To Room Users
    }

    /**
     * Get the web push representation of the notification.
     *
     * @param  mixed  $notifiable
     * @param  mixed  $notification
     * @return \Illuminate\Notifications\Messages\DatabaseMessage
     */
    public function toWebPush($notifiable, $notification)
    {
        return (new WebPushMessage)
            ->title('Hello from Laravel!')
            ->icon('/notification-icon.png')
            ->body('Thank you for using our application.')
            ->action('View app', 'view_app')
            ->data(['id' => $notification->id]);
    }
}
