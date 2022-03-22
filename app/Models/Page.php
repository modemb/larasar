<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
  use SoftDeletes;

  protected $fillable = [
    // 'page_id',
    'locale',
    'icon',
    'page_title',
    'slug',
    'description',
    'content',
    'pics',
    'deleted'
  ];
}
