<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class PromotorOAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // Verificar si el usuario no tiene el rol adecuado
        if (!$user || !in_array($user->rol, ['promotor', 'admin'])) {
            return redirect()->route('convertir-promotor')
                ->with('message', 'Debes ser promotor o administrador para realizar reservas.');
        }

        return $next($request);
    }
}
