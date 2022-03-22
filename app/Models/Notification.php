<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Fields that are mass assignable
     *
     * @var array
     */
    protected $fillable = [
      'type',
      'notifiable',
      'data',
      'read_at'
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    // protected $appends = ['user'];

    /**
     * A message belong to a user
     */
    // public function getUserAttribute()
    // {
    //   return $this->belongsTo(User::class, 'user_id')->first();
    // }

    /**
     * A message belong to a user
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    // public function user()
    // {
    //     return $this->belongsTo(User::class)->get();
    // }

    /**
     * A message belong to a user
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    // public function chat()
    // {
    //     return $this->belongsTo(Chat::class, 'post_id');
    // }
}
