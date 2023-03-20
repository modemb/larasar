<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;


// use Illuminate\Bus\Queueable;
// use Illuminate\Queue\SerializesModels;
// use Illuminate\Contracts\Queue\ShouldQueue;

class Category extends Model
{
  // use Queueable, SerializesModels;
  use SoftDeletes;

  protected $fillable = [
    'icon',
    'deleted'
  ];

  // protected $locale;
  public $locale;

  /**
   * Create a new locale instance.
   *
   * @return void
   */
  // public function __construct($locale)
  // {
  //     $this->locale = $locale;
  // }

  /**
   * The accessors to append to the model's array form.
   *
   * @var array
   */
  protected $appends = ['subcategories', 'locales'];

  /**
   * Get category's subcategories
   */
  public function getSubcategoriesAttribute()
  {
    return $this->hasMany('App\Models\Subcategory')->get();

    // return $this->hasMany('App\Models\Subcategory')->with(['locales' => function ($query) {
    //     $query->orderBy('subcategoryName', 'desc');
    // }])->get();

    // return App\Models\Subcategory::with(['locales' => function ($query) {
    //   $query->orderBy('subcategoryName', 'desc');
    // }])->get();

    // return $this->hasMany('App\Models\Subcategory')->load(['locales' => function ($query) {
    //     $query->orderBy('subcategoryName', 'desc');
    // }]);
  }

  /**
   * Get category's locales
   */
  public function getLocalesAttribute()
  {
      return $this->hasMany('App\Models\Locale')
        ->where('lang', config('app.locale', 'en'))
        ->first();
  }
}
