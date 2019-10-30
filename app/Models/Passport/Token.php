<?php

namespace App\Models\Passport;

use Laravel\Passport\Token as BaseToken;

class Token extends BaseToken
{
    /**
     * Determine if the Token should skip the authorization prompt.
     *
     * @return bool
     */
    public function skipsAuthorization()
    {
        return $this->firstParty();
    }
}
