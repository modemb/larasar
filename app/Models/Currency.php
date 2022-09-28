<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
      'from',  // XAU - XAG
      'to', // XOF
      'from_to', // XAU-XOF
      'from_name', // Canadian Dollar
      'to_name', // West African CFA franc
      'rate',
      'amount',
      'result',
      'deleted'
    ];
}
