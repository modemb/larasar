<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Locale extends Model
{
  use SoftDeletes;

  protected $fillable = [
    'category_id',
    'subcategory_id',
    'categoryName',
    'subcategoryName',
    'description',
    'lang',
    'deleted'
  ];

  /**
   * The accessors to append to the model's array form.
   *
   * @var array
   */
  // protected $appends = ['locales'];

  /**
   * Get locales owns by category.
   */
  // public function getLocalesAttribute()
  // {
  //     return $this->belongsTo('App\Models\Category')->get();
  // }
}
