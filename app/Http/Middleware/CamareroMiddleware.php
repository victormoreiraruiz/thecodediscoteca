<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CamareroMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        // Permitir acceso si el usuario es camarero o admin
        if ($user && ($user->esCamarero() || $user->esAdmin())) {
            return $next($request);
        }

        return redirect('/')->with('error', 'No tienes acceso a esta página.');
    }
}
