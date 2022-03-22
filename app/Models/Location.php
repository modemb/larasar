<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
      'city',
      'region',
      'country',
      'place',
      'lat',
      'lon',
      'latitude',
      'longitude',
      'utc_offset',
      'deleted'
    ];
}
