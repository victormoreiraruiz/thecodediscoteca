<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cookie;
use App\Models\Evento;

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

    public function UserActual(Request $request) {
        return response()->json(['id' => auth()->user()->id]);
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

        // recupera las compras del usuario con los detalles de las entradas
        $compras = $user->compras()->with('entradas')->get() ?? collect([]);

        // recupera las reservas del usuario con la información de la sala
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
            'eventos' => Evento::whereHas('sala.reservas', function ($query) use ($user) {
                $query->where('usuario_id', $user->id);
            })->with('sala.reservas')->get()->map(function ($evento) {
                $reserva = $evento->sala->reservas->firstWhere('fecha_reserva', $evento->fecha_evento);
                return array_merge($evento->toArray(), ['reserva_id' => $reserva->id ?? null]);
            }),
        ]);
    }
    
    

public function añadirSaldo(Request $request): RedirectResponse
{
    $request->validate([
        'saldo' => 'required|numeric|min:0.01', 
    ]);

    $user = $request->user();

    // aumentar el saldo
    $user->saldo = round($user->saldo + $request->input('saldo'), 2);
    $user->save();

    return Redirect::route('mi-cuenta')->with('success', 'Saldo añadido correctamente.');
}


public function obtenerIngresos(Request $request)
{
    
    $user = auth()->user();

    // obtener las reservas de discotecas del usuario
    $reservas = \App\Models\ReservaDiscoteca::where('usuario_id', $user->id)
        ->where('tipo_reserva', 'concierto') // solo  conciertos
        ->get();

    $ingresos = [];

    // recorrer las reservas y obtener los ingresos de los eventos
    foreach ($reservas as $reserva) {
        // obtener el evento asociado a la reserva (a través de la sala)
        $evento = $reserva->sala->eventos()->where('fecha_evento', $reserva->fecha_reserva)->first();

        if ($evento) {
            // obtener los ingresos de la compra de entradas para ese evento
            $ventas = $evento->entradas()->with('compras')->get(); 

            $detalleIngresos = [];
            $totalIngresos = 0;

            foreach ($ventas as $entrada) {
                foreach ($entrada->compras as $compra) {
                    $detalleIngresos[] = [
                        'entrada' => $entrada->tipo,
                        'cantidad' => $compra->pivot->cantidad,
                        'total' => $compra->pivot->cantidad * $entrada->precio,
                        // asegurara de que la fecha de compra sea valida
                        'fecha_compra' => Carbon::parse($compra->fecha_compra)->toIso8601String(), 
                    ];

                   
                    $totalIngresos += $compra->pivot->cantidad * $entrada->precio;
                }
            }

            // agregar los ingresos del evento
            $ingresos[] = [
                'nombre_evento' => $evento->nombre_evento,
                'fecha_evento' => Carbon::parse($evento->fecha_evento)->toIso8601String(),
                'total_ingresos' => $totalIngresos,
                'detalle_ingresos' => $detalleIngresos,
            ];
        }
    }

   // devuelve lls ingresos
    return response()->json($ingresos);
}

public function convertToPromotor(Request $request)
{
    // Validar los datos del formulario
    $validatedData = $request->validate([
        'nombre_completo' => 'required|string|max:255',
        'documento_fiscal' => 'required|string|max:255',
        'direccion' => 'required|string|max:255',
        'telefono' => 'required|string|regex:/^\d{9}$/', // Validación para un número de 9 dígitos
        'informacion_bancaria' => 'nullable|string|max:255',
    ]);

    try {
        $user = Auth::user();

        // Actualizar los datos del usuario
        $user->update([
            'documento_fiscal' => $validatedData['documento_fiscal'],
            'direccion' => $validatedData['direccion'],
            'telefono' => $validatedData['telefono'],
            'informacion_bancaria' => $validatedData['informacion_bancaria'] ?? null,
            'rol' => 'promotor', // Cambiar el rol del usuario
        ]);

        // Actualizar el nombre completo, si es necesario
        $user->name = $validatedData['nombre_completo'];
        $user->save();

        // Refrescar la información del usuario autenticado
        Auth::user()->refresh();

        // Obtener la URL de redirección (por defecto a la lista de eventos)
        $redirectUrl = $request->query('redirect_to', session('url.intended', route('eventos')));

        Log::info('Usuario convertido en promotor:', [
            'user_id' => $user->id,
            'redirect_url' => $redirectUrl,
        ]);

        return redirect($redirectUrl)->with('message', '¡Ahora eres promotor!');
    } catch (\Exception $e) {
        // Manejo de errores y registro del problema
        Log::error('Error al convertir al usuario en promotor:', [
            'error' => $e->getMessage(),
        ]);

        return back()->withErrors('Hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.');
    }
}








public function mostrarFormularioPromotor()
{
    return Inertia::render('FormularioPromotor', [
        'user' => Auth::user(),
    ]);
}



public function logout(Request $request)
{
    Auth::logout();

    Cookie::queue(Cookie::forget('carrito')->withPath('/'));
    Cookie::queue(Cookie::forget('formularioReserva')->withPath('/'));

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    dd(Cookie::getQueuedCookies()); // Inspecciona las cookies en la cola
}



public function login(Request $request)
{
    $credentials = $request->only('email', 'password');

    if (Auth::attempt($credentials)) {
        $request->session()->regenerate();
        return redirect()->intended(); // Redirige a la URL almacenada o a un fallback
    }

    return back()->withErrors([
        'email' => 'Credenciales inválidas.',
    ]);
}

public function verificarRolUsuario()
{
    $usuario = auth()->user();

    if (!$usuario) {
        return response()->json(['error' => 'Usuario no autenticado'], 401);
    }

    return response()->json([
        'rol' => $usuario->rol,
        'message' => 'Rol del usuario obtenido correctamente',
    ]);
}


}