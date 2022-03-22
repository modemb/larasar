<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Flag extends Model
{
  use SoftDeletes;

  protected $fillable = [
    'state',
    'user_id',
    'post_id',
    'category_id',
    'subcategory_id',
    'description'
  ];
}
