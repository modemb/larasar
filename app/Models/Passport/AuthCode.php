<?php

namespace App\Models\Passport;

use Laravel\Passport\AuthCode as BaseAuthCode;

class AuthCode extends BaseAuthCode
{
    /**
     * Determine if the AuthCode should skip the authorization prompt.
     *
     * @return bool
     */
    public function skipsAuthorization()
    {
        return $this->firstParty();
    }
}
