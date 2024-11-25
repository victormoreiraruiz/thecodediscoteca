<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }


    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current-password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }


    public function historialDeCompras(Request $request)
    {
        $user = $request->user();

        // Recupera las compras del usuario con los detalles de las entradas
        $compras = $user->compras()->with('entradas')->get() ?? collect([]);

        // Recupera las reservas del usuario con la información de la sala
        $reservas = $user->reservas()->with('sala')->get() ?? collect([]);

        return Inertia::render('MiCuentaInfo', [
            'compras' => $compras,
            'reservas' => $reservas,
        ]);
    }

    public function miCuenta(Request $request)
{
    $user = $request->user();

    return Inertia::render('MiCuenta', [
        'user' => $user,
        'compras' => $user->compras()->with('entradas')->get(),
        'reservas' => $user->reservas()->with('sala')->get(),
    ]);
}

public function añadirSaldo(Request $request): RedirectResponse
{
    $request->validate([
        'saldo' => 'required|numeric|min:0.01', // Aceptar valores decimales y validar el mínimo
    ]);

    $user = $request->user();

    // Aumentar el saldo
    $user->saldo = round($user->saldo + $request->input('saldo'), 2);
    $user->save();

    return Redirect::route('mi-cuenta')->with('success', 'Saldo añadido correctamente.');
}

public function obtenerIngresos(Request $request)
{
    $user = $request->user();

    // Asegúrate de cargar todas las relaciones necesarias
    $reservas = \App\Models\ReservaDiscoteca::with('evento.entradas.compras')
        ->where('usuario_id', $user->id)
        ->where('tipo_reserva', 'concierto')
        ->get();

    $ingresos = $reservas->map(function ($reserva) {
        $evento = $reserva->evento;

        if (!$evento) {
            return null; // Ignorar reservas sin evento asociado
        }

        $totalIngresos = $evento->entradas->reduce(function ($carry, $entrada) {
            return $carry + $entrada->compras->sum(function ($compra) use ($entrada) {
                return $compra->pivot->cantidad * $entrada->precio;
            });
        }, 0);

        return [
            'id' => $evento->id,
            'nombre_evento' => $evento->nombre_evento,
            'fecha_evento' => $evento->fecha_evento,
            'total_ingresos' => $totalIngresos,
        ];
    })->filter();

    // Retornar una respuesta JSON limpia
    return response()->json($ingresos->values());
}



}