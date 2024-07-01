<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
  use SoftDeletes;

  protected $fillable = [
    'user_id',
    'post_id',
    // 'payment_id',
    'token',
    'sale_date',
    'start_date',
    'end_date',
    'product',
    'plan',
    'payment',
    'amount',  // Total Payments
    'paymentAmount',
    'total', // Exchanged Total Payments
    'currency_code',
    // 'links',
    'deleted'
  ];

  /**
   * The accessors to append to the model's array form.
   *
   * @var array
   */
  protected $appends = ['user'];

  /**
   * Get Report's User
   */
  public function getUserAttribute()
  // public function user()
  {
    return $this->belongsTo(User::class, 'user_id')->first();
  }
}
