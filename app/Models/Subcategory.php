<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Subcategory extends Model
{
  use SoftDeletes;

  protected $fillable = [
    'category_id',
    'deleted'
  ];

  /**
   * The accessors to append to the model's array form.
   *
   * @var array
   */
  protected $appends = ['locales', 'posts'];//

  /**
   * Get subcategory's locales
   */
  public function getLocalesAttribute()
  {
      return $this->hasMany('App\Models\Locale', 'subcategory_id')
        ->where('lang', config('app.locale'))
        ->get();
  }

  /**
   * Get subcategory's posts
   */
  // public function posts()
  public function getPostsAttribute()
  {   // return $this->hasMany(Comment::class, 'foreign_key', 'local_key');
    // return $this->hasMany('App\Models\Post', 'subcategory_id');
    return $this->hasMany('App\Models\Post', 'subcategory_id')->get();
  }
}
