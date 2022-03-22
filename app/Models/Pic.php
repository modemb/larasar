<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Pic extends Model
{
  use SoftDeletes;
  protected $fillable = [
    'user_id',
    'page_id',
    'post_id',
    'category_id',
    'subcategory_id',
    'name',
    'pic',
    'deleted'
  ];

  /**
   * The accessors to append to the model's array form.
   *
   * @var array
   */
  // protected $appends = ['post', 'category'];//, 'pages', 'users'

  /**
   * Get Posts's Pic
   */
  // public function getCategoryAttribute()
  // {
  //   return $this->belongsTo(Category::class, 'id')->first();
  // }

  /**
   * Get Posts's Pic
   */
  // public function getPostAttribute()
  // {
  //   // return$post = $this->belongsTo(Post::class, 'id')->first();
  //   // $pics = $post->pics;collect($pics)->forget('post');  $post;
  //   // return $this->$this->hasMany(Post::class, 'post_id')->first();
  // }

  /**
   * Get Pages' Pic
   */
  // public function getPagesAttribute()
  // {
  //   return $this->belongsTo(Page::class, 'page_id')->first();
  // }

  /**
   * Get Users's Pic
   */
  // public function getUsersAttribute()
  // {
  //   return $this->belongsTo(User::class, 'user_id')->first();
  // }
}
