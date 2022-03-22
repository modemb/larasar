<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class NotificationReadAll implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    /**
     * @var int
     */
    public $userId;

    /**
     * Create a new event instance.
     *
     * @param  int $userId
     * @return void
     */
    public function __construct($userId)
    {
        $this->userId = $userId;

        $this->dontBroadcastToCurrentUser();
    }

    /**
     * Get the channels the event should be broadcast on.
     *
     * @return array
     */
    public function broadcastOn()
    {
      return [
        new Channel("App.User.{$this->userId}"),
        // new PrivateChannel("App.User.{$this->userId}")
      ];
    }
}
