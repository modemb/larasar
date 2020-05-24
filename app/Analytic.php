<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Analytic extends Model
{
    protected $fillable = [
      'user_id',
      //=============IPAPI============\\
      'asn',
      //---------------city----------------\\
      'city',
      'continent_code',
      //---------------country----------------\\
      // 'country' // "CA"
      'country',// "Canada"
      'country_area',
      'country_calling_code',//"+1"
      'country_capital',
      'country_code',
      'country_code_iso3',//: "CAN"
      'country_name',
      'country_population',
      'country_tld', //".ca"
      'currency',//"CAD"
      'currency_name',
      'in_eu',
      'ip',
      'languages',
      'latitude',
      'longitude',
      //---------------org----------------\\
      'org',//"Virgin Home Quebec"
      'postal',
      //----------------region---------------\\
      'region',//Quebec
      'region_code',
      //----------------timezone---------------\\
      'timezone',//"America/Toronto"
      'utc_offset', //"-0400"
      //=========IPAPI End==========\\
      //=========IP-API==============\\
      'as',
      'countryCode', //"CA"
      'isp', // "Bell Canada"
      'lat',// 45.4738
      'lon',// -73.5875
      'query',// "142.118.246.20"
      // 'region',// "QC"
      'regionName',// "Quebec"
      // 'status',// "success"
      'zip',// "H4C"
    ];

    /**
     * Get analytic's users
     */
    public function analytics()
    {
        return $this->hasMany('App\User');
    }
}
