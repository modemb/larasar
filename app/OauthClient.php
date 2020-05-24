<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Analytic extends Model
{
    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['new'];

    /**
     * Get the profile photo URL attribute.
     *
     * @return string
     */
    public function getNewAttribute()
    {
        return [
          'avatar' => 'https://www.gravatar.com/avatar/'.md5(strtolower($this->email)).'.jpg?s=200&d=mm'
        ];
    }
}
