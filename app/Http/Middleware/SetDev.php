<?php

namespace App\Http\Middleware;

use Closure;

class SetDev
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $dev = $request->server('HTTP_DEV') === 'true'? true: false;
        $ipDebug = $request->server('HTTP_IP_DEBUG') === '1'? true: false;

        $true = $dev && config('app.dev'); config([
            'app.env' => $true?'local':'production',
            'app.debug' => $ipDebug,
            // 'sanctumApi' => env('SANCTUM_API')
            'sanctumApi' => $dev?false:env('SANCTUM_API')
        ]); return $next($request);
    }
}
