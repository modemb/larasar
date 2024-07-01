<?php

namespace App\Http\Middleware;

use Closure;

class SetMode
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
        $user_agent = $request->server('HTTP_USER_AGENT');
        $dev = $request->server('HTTP_DEV') === 'true'? true: false;
        $ipDebug = $request->server('HTTP_IP_DEBUG') === '1'? true: false;

        $app = preg_match('~\b(modembAndroid|modembIos)\b~i',$user_agent);

        $bool = $dev && config('app.dev'); config([
            'app.env' => $bool?'local':'production',
            'app.debug' => $ipDebug,
            'mode' => $app?'capacitor':'pwa',
            'sanctumApi' => env('SANCTUM_API')
            // 'sanctumApi' => $dev?false:env('SANCTUM_API')
        ]); return $next($request);
    }
}
