<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
      'room_id',
      'user_id',
      'post_id'
    ];

    /**
     * Chat Room
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function room()
    {
      return $this->belongsTo(Room::class);//, 'room_id', 'id'
      // return $this->hasMany(Room::class, 'room_id', 'id');
    }

    /**
     * Chat Room
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function post()
    {
      return $this->belongsTo(Post::class);
    }

    /**
     * Get Chat Rom's Users
     */
    // public function users()
    // { // 'foreign_key', 'local_key'
    //   return $this->hasMany(User::class, 'user_id', 'room_id')->get();
    // }

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    // protected $appends = ['messages'];


    /**
     * Room messages
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    // public function getMessagesAttribute()//messages()
    // {
    //   return $this->hasMany(Message::class, 'user_id')->get();
    // }
}
