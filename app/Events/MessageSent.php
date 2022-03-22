<?php

namespace App\Events;

// use App\Models\User;
// use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * User that sent the message
     *
     * @var UserId
     */
    public $userId;

    /**
     * User Room Id
     *
     * @var RoomId
     */
    public $roomId;

    /**
     * Message details
     *
     * @var Message
     */
    public $message;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($userId, $roomId, $message)
    // public function __construct(User $user, Message $message)
    {
        $this->userId = $userId;
        $this->roomId = $roomId;
        $this->message = $message;
        $this->dontBroadcastToCurrentUser();
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn()
    {
        return [
          // new PrivateChannel("App.User.{$this->userId}"),
          new Channel("App.Models.Room.{$this->roomId}"),
          // new PrivateChannel("App.Models.Room.{$this->roomId}")
        ];
    }
}
