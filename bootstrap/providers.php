<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\FortifyServiceProvider::class,
    App\Providers\JetstreamServiceProvider::class,

    App\Providers\BroadcastServiceProvider::class,
    // App\Providers\AuthServiceProvider::class,
    // App\Providers\EventServiceProvider::class,
    // App\Providers\RouteServiceProvider::class,

    /*
     * Package Service Providers...
     */
    NotificationChannels\WebPush\WebPushServiceProvider::class,
    // Intervention\Image\ImageServiceProvider::class,

];
