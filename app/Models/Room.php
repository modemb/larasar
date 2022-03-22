<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Fields that are mass assignable
     *
     * @var array
     */
    protected $fillable = [
      'name',
      'link'
      // 'message_id',
      // 'user_id'
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['messages'];

    /**
     * A room belong to a user
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function getMessagesAttribute()
    {
      return $this->hasMany(Message::class)->get();
    }

    /**
     * A room belong to a user
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    // public function user()
    // {
    //     return $this->belongsTo(User::class);
    // }
}
