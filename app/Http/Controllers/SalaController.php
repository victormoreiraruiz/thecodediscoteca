<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sala;
use App\Models\ReservaDiscoteca;
use App\Models\Evento;
use App\Models\Entrada;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use App\Models\Compra;
use App\Models\Notificacion;


class SalaController extends Controller
{

    public function obtenerFechasOcupadas($id)
    {
        $fechasOcupadas = ReservaDiscoteca::where('sala_id', $id)
            ->where('disponibilidad', 'reservada') // solo fechas reservadas
            ->pluck('fecha_reserva')
            ->map(function ($date) {
                return Carbon::parse($date)->format('Y-m-d'); // convertir a Carbon y formatear
            });

        return response()->json($fechasOcupadas);
    }

    public function crearReserva(Request $request, $id)
{
    $usuario = auth()->user();

    if (!$usuario || !in_array($usuario->rol, ['promotor', 'admin'])) {
        // Redirigir al formulario de conversión con la página anterior como parámetro
        $redirectUrl = url()->previous();
        return response()->json([
            'error' => 'Solo los promotores o administradores pueden realizar reservas.',
            'redirect_to' => route('convertir-promotor') . '?redirect_to=' . urlencode($redirectUrl),
        ], 403);
    }

    // Validar los datos enviados por el usuario
    $validatedData = $request->validate([
        'fecha_reserva' => 'required|date',
        'descripcion' => 'required|string',
        'asistentes' => 'required|integer|min:1',
        'tipo_reserva' => 'required|in:privada,concierto',
        'precio_entrada' => 'nullable|required_if:tipo_reserva,concierto|numeric|min:0',
        'nombre_concierto' => 'nullable|required_if:tipo_reserva,concierto|string',
        'hora_inicio' => 'nullable|required_if:tipo_reserva,concierto|date_format:H:i',
        'hora_fin' => 'nullable|required_if:tipo_reserva,concierto|date_format:H:i',
        'cartel' => 'nullable|required_if:tipo_reserva,concierto|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    // Buscar la sala por su ID
    $sala = Sala::findOrFail($id);

    // Verificar si el usuario tiene saldo suficiente para realizar la reserva
    if ($usuario->saldo < $sala->precio) {
        return response()->json(['error' => 'Saldo insuficiente para realizar la reserva.'], 403);
    }

    // Descontar el precio de la sala del saldo del usuario
    $usuario->saldo -= $sala->precio;
    $usuario->save();

    // Crear la reserva en la base de datos
    $reserva = ReservaDiscoteca::create([
        'usuario_id' => $usuario->id,
        'sala_id' => $id,
        'fecha_reserva' => $validatedData['fecha_reserva'],
        'disponibilidad' => 'reservada',
        'asistentes' => $validatedData['asistentes'],
        'descripcion' => $validatedData['descripcion'],
        'tipo_reserva' => $validatedData['tipo_reserva'],
        'precio_entrada' => $validatedData['tipo_reserva'] === 'concierto' ? $validatedData['precio_entrada'] : null,
    ]);

    // Si la reserva es de tipo "concierto", crea un evento asociado
    if ($validatedData['tipo_reserva'] === 'concierto') {
        $cartelPath = null;

        // Guardar el cartel si se subió
        if ($request->hasFile('cartel')) {
            $cartelPath = $request->file('cartel')->store('imagenes', 'public');
        }

        $evento = \App\Models\Evento::create([
            'nombre_evento' => $validatedData['nombre_concierto'],
            'descripcion' => $validatedData['descripcion'],
            'fecha_evento' => $validatedData['fecha_reserva'],
            'hora_inicio' => $validatedData['hora_inicio'],
            'hora_final' => $validatedData['hora_fin'],
            'cartel' => $cartelPath,
            'sala_id' => $sala->id,
        ]);

        // Crear entradas para el evento
        \App\Models\Entrada::create([
            'evento_id' => $evento->id,
            'tipo' => 'normal',
            'precio' => $validatedData['precio_entrada'],
        ]);
    }

    // Respuesta exitosa
    return response()->json(['message' => 'Reserva creada exitosamente.'], 201);
}


public function cancelarReserva($id)
{
    $reserva = ReservaDiscoteca::findOrFail($id);

    // Verifica si existe el evento asociado a la reserva
    $evento = Evento::where('sala_id', $reserva->sala_id)
        ->where('fecha_evento', $reserva->fecha_reserva)
        ->first();

    if ($reserva->tipo_reserva === 'concierto') {
        if (!$evento) {
            return response()->json(['error' => 'Evento no encontrado.'], 404);
        }

        try {
            // Obtiene todas las compras relacionadas con las entradas del evento
            $compras = Compra::whereHas('entradas', function ($query) use ($evento) {
                $query->where('evento_id', $evento->id);
            })->with('entradas')->get();

            // Procesa el reembolso y envía notificaciones a los compradores
            foreach ($compras as $compra) {
                $totalReembolso = 0;

                foreach ($compra->entradas as $entrada) {
                    if ($entrada->evento_id == $evento->id) {
                        $cantidad = $entrada->pivot->cantidad ?? 0;
                        $totalReembolso += $entrada->precio * $cantidad;
                    }
                }

                if ($totalReembolso > 0) {
                    // Devuelve el dinero al comprador
                    $compra->usuario->saldo += $totalReembolso;
                    $compra->usuario->save();

                    // Crea una notificación para el comprador
                    Notificacion::create([
                        'usuario_id' => $compra->usuario->id,
                        'mensaje' => "El evento '{$evento->nombre_evento}' ha sido cancelado. Se ha reembolsado el importe de tu compra.",
                        'leido' => false,
                    ]);

                    // Elimina las entradas relacionadas con la compra
                    $compra->entradas()->detach();
                }
            }

            // Elimina las compras después de procesar el reembolso
            Compra::whereHas('entradas', function ($query) use ($evento) {
                $query->where('evento_id', $evento->id);
            })->delete();

            // Actualiza los ingresos del creador del evento
            $totalRecibido = $compras->sum(function ($compra) use ($evento) {
                return $compra->entradas->where('evento_id', $evento->id)->sum(function ($entrada) {
                    return $entrada->precio * ($entrada->pivot->cantidad ?? 0);
                });
            });

            $creador = $reserva->usuario; // Usuario que creó la reserva
            $creador->ingresos -= $totalRecibido;
            $creador->save();

            // Elimina el evento
            $evento->delete();
        } catch (\Exception $e) {
            \Log::error('Error al procesar reembolsos para el evento: ' . $e->getMessage());
            return response()->json(['error' => 'Hubo un problema al procesar los reembolsos.'], 500);
        }
    }

    // Verifica si se puede cancelar la reserva (no el mismo día)
    $usuario = $reserva->usuario;
    $sala = $reserva->sala;
    $hoy = now()->startOfDay();
    $fechaReserva = Carbon::parse($reserva->fecha_reserva);

    if ($fechaReserva->isSameDay($hoy)) {
        return response()->json(['error' => 'No se puede cancelar una reserva para el mismo día.'], 403);
    }

    // Devuelve el 30% del precio al saldo del usuario
    $reembolso = $sala->precio * 0.3;
    $usuario->saldo += $reembolso;
    $usuario->save();

    $reserva->delete();

    return response()->json(['message' => 'Reserva cancelada con éxito y reembolsos procesados.']);
}

    
    
public function mostrarSalaCelebraciones()
{
    $user = auth()->user();

    // Verificar si el usuario tiene rol de promotor o admin
    if (!$user || !in_array($user->rol, ['promotor', 'admin'])) {
        return redirect()->route('convertir-promotor')
            ->with('message', 'Debes ser promotor o administrador para acceder a esta sección.');
    }

    // Renderizar la página con los datos necesarios
    return Inertia::render('SalaCelebraciones', [
        'user' => $user, // Pasar datos del usuario si es necesario
    ]);
}


}
