<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
  use SoftDeletes;

  protected $fillable = [
    'post_id',
    'token',
    'PayerID',
    'sale_date',
    'start_date',
    'end_date',
    'plan',
    'amount',
    'currency_code',
    'links',
    'deleted'
  ];

  /**
   * Get Payment's reports
   */
  public function reports()
  {
    return $this->hasMany(Report::class, 'token', 'token');
    // return $this->hasMany('App\Models\Report');
  }
}
