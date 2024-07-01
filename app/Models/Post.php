<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
  use SoftDeletes;

  protected $fillable = [
    'gallery_page',
    'worldwide',
    'state',
    'count',
    'user_id',
    'category_id',
    'subcategory_id',
    'post_title',
    'price',
    'currency_code',
    'address',
    'city',
    'country',
    'phone',
    'postal_code',
    'description',
    'location',
    'place',
    'lat',
    'lon',
    'start_date',
    'end_date',
    'extend_date',
    'rank',
    'deleted'
  ];

  /**
   * The accessors to append to the model's array form.
   *
   * @var array
   */
  protected $appends = ['pics', 'payments', 'reports', 'favorite', 'flag'];

  /**
   * Get Post's Flag
   */
  public function getFlagAttribute()
  { // 'foreign_key', 'local_key'
    return $this->belongsTo(Flag::class, 'id', 'post_id')->first();
  }

  /**
   * Get category's locales
   */
  public function getPicsAttribute()
  {
      return $this->hasMany('App\Models\Pic')->get();
  }

  /**
   * Get Post's join/select Payments
   */
  public function getPaymentsAttribute()
  {
      return $this->hasMany('App\Models\Payment')->get();
  }

  /**
   * Get Post's Payments
   */
  public function payments()
  {
      return $this->hasMany('App\Models\Payment');
  }

  /**
   * Get Post's Reports
   */
  public function getReportsAttribute()
  {
      return $this->hasMany('App\Models\Report')->get();
  }

  /**
   * Get User's Favorite Post
   * Get Post's User Wish
   */
  public function getFavoriteAttribute()
  {
      return $this->hasMany(Favorite::class)
        ->where('user_id', config('auth_id'))
        ->first();
  }

  /**
   * Get Post's User
   */
  // public function getUserAttribute()
  public function user()
  {
    return $this->belongsTo(User::class);
  }

  /**
   * Get Post's Category
   */
  // public function getUserAttribute()
  public function category()
  {
    return $this->belongsTo(Category::class, 'category_id');//, 'user_id'
  }

  /**
   * Get Post's Subcategory
   */
  // public function getUserAttribute()
  public function subcategory()
  {
    return $this->belongsTo(Subcategory::class, 'subcategory_id');//, 'user_id'
  }

  /**
   * Get Post's Location
   */
  public function locationPlace()
  { // 'foreign_key', 'local_key'
    return $this->hasOne(Location::class, 'place', 'place');
  }
}
