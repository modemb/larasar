<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class View extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
      'ip',
      'user_id',
      'post_id',
      'slug',
      'deleted',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['post', 'user', 'analytics'];

    /**
     * Get subcategory's posts
     */
    public function getAnalyticsAttribute()
    {   // return $this->hasMany(Comment::class, 'foreign_key', 'local_key');
        return $this->hasMany('App\Models\Analytic', 'ip', 'ip')->first();
    }

    /**
     * Get View's Post
     */
    public function getPostAttribute()
    { // return $this->belongsTo(User::class, 'foreign_key', 'owner_key');
      return $this->belongsTo(Post::class, 'post_id')->first();
    }

    /**
     * Get View's User
     */
    public function getUserAttribute()
    {
      return $this->belongsTo(User::class, 'user_id')
        // ->unsearchable()
        // ->remove('views')
        // ->first();
        ->first(['first_name', 'last_name', 'email']);
      // $user = $this->belongsTo(User::class, 'user_id')->first();
      // return $views = collect($user)->forget('views');
      // return $views;
      // return $views->all();
    }
}
