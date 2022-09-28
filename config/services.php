<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],
    'passport' => [
      'login_endpoint' => $app->runningInConsole() ? config('app.url') : url('/').'/oauth/token',
      'client_id' => env('PASSPORT_GRANT_CLIENT_ID'),
      'client_secret' => env('PASSPORT_GRANT_CLIENT_SECRET'),
    ],
    'github' => [
      'client_id' => env('GITHUB_CLIENT_ID'),
      'client_secret' => env('GITHUB_CLIENT_SECRET'),
    ],
    'facebook' => [
      'client_id' => env('FACEBOOK_CLIENT_ID'),
      'client_secret' => env('FACEBOOK_CLIENT_SECRET'),
      // 'redirect' => env('API_URL').'/api/login/facebook/callback'
    ],
    'google' => [
      'client_id' => env('GOOGLE_CLIENT_ID'),
      'client_secret' => env('GOOGLE_CLIENT_SECRET'),
      // 'redirect' => env('API_URL').'/api/login/google/callback'
    ],
    'twitter' => [
      'client_id' => env('TWITTER_CLIENT_ID'),
      'client_secret' => env('TWITTER_CLIENT_SECRET'),
      // 'redirect' => env('API_URL').'/api/login/twitter/callback'
    ],
    'twilio' => [
      'token'  => env('TWILIO_TOKEN'),
      'id'     => env('TWILIO_ID'),
      'number' => env('TWILIO_NUMBER'),
    ],
    'bitgo' => [
      'env'   => env('BITGO_ENV', 'test'),
      'token' => env('BITGO_TOKEN'),
      'host'  => env('BITGO_HOST'),
      'port'  => env('BITGO_PORT'),
    ],
    // 'stripe' => [
    //   'model' => App\Models\User::class,
    //   'key' => env('STRIPE_KEY'),
    //   'secret' => env('STRIPE_SECRET'),
    //   // ----------------------------------------
    //   // 'key' => env('STRIPE_TEST_KEY'),
    //   // 'secret' => env('STRIPE_TEST_SECRET'),
    //   // ----------------------------------------
    //   // 'test_key' => env('STRIPE_TEST_KEY'),
    //   // 'test_secret' => env('STRIPE_TEST_SECRET'),
    //   // 'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    // ],
    'paypal' => [
        'clientId' => env('PAYPAL_ID'),
        'clientSecret' => env('PAYPAL_SECRET'),
        'AccessToken' => env('PAYPAL_ACCESS'),
        'WebhookId' => env('WEBHOOK_ID'),
        // ----------------------------------------- \\
        'clientSandboxId' => env('PAYPAL_SANDBOX_ID'),
        'clientSandboxSecret' => env('PAYPAL_SANDBOX_SECRET'),
        'AccessSandboxToken' => env('PAYPAL_SANDBOX_ACCESS'),
        'WebhookSandboxId' => env('WEBHOOK_SANDBOX_ID')
        // 'ApiContext' => env('PAYPAL_ID'),
        // 'OAuthTokenCredential' => env('PAYPAL_SECRET'),
        //'redirect' => $app->runningInConsole() ? config('app.url') : url('/') . '/auth/google/callback',
    ],
];
