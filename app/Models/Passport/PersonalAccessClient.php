<?php

namespace App\Models\Passport;

use Laravel\Passport\PersonalAccessClient as BasePersonalAccessClient;

class PersonalAccessClient extends BasePersonalAccessClient
{
    /**
     * Determine if the PersonalAccessClient should skip the authorization prompt.
     *
     * @return bool
     */
    public function skipsAuthorization()
    {
        return $this->firstParty();
    }
}
