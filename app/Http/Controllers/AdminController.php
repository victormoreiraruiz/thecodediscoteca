<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Sala;
use App\Models\Evento;
use App\Models\Notificacion;
use App\Models\Compra;
use App\Models\ReservaDiscoteca;
use Carbon\Carbon;


class AdminController extends Controller
{
    
    public function index()
    {
        $usuarios = User::all();
        $salas = Sala::all();
        $eventos = Evento::with('sala')->get();
        
        return Inertia::render('AdminIndex', [
            'usuarios' => $usuarios,
            'salas' => $salas,
            'eventos' => $eventos,
        ]);
    }
    
    


    
    public function cambiarRol(Request $request)
{
    $user = User::findOrFail($request->id);
    $user->rol = $request->rol;
    $user->save();

    return response()->json(['message' => 'Rol actualizado correctamente.']);
}

public function eliminarUsuario($id)
{
    $usuario = User::findOrFail($id);
    
    $usuario->delete();

    return response()->json(['message' => 'Usuario eliminado con éxito.']);
}

public function crearEvento(Request $request)
{
    // Verifica los datos que llegan en la solicitud
    \Log::info('Datos recibidos para crear evento:', $request->all());

    // Validación de los datos
    $request->validate([
        'nombre_evento' => 'required|string',
        'descripcion' => 'nullable|string',
        'fecha_evento' => 'required|date',
        'hora_inicio' => 'required|date_format:H:i',
        'hora_final' => 'required|date_format:H:i',
        'sala_id' => 'required|exists:salas,id',
    ]);

    // Verifica si la validación pasó
    \Log::info('Datos validados correctamente');

    // Lógica para crear el evento
    $evento = new Evento();
    $evento->nombre_evento = $request->nombre_evento;
    $evento->descripcion = $request->descripcion;
    $evento->fecha_evento = $request->fecha_evento;
    $evento->hora_inicio = $request->hora_inicio;
    $evento->hora_final = $request->hora_final;
    $evento->sala_id = $request->sala_id;


    if ($request->hasFile('cartel')) {
        $cartelPath = $request->file('cartel')->store('carteles', 'public');
        $evento->cartel = $cartelPath;
    }


    $evento->save();

    // verifica si el evento se guardó correctamente
    \Log::info('Evento guardado con éxito:', $evento->toArray());

    return response()->json(['message' => 'Evento creado exitosamente'], 201);
}


public function mostrarEventos()
{
    // recuperar todos los eventos con la relación al creador y la sala
    $eventos = Evento::with(['creador', 'sala'])->get();

    return inertia('Admin/Eventos', [
        'eventos' => $eventos,
    ]);
}

public function eliminarEvento(Request $request, $id)
{
    $evento = Evento::findOrFail($id);
    $motivoCancelacion = $request->input('motivo_cancelacion'); // Obtener el motivo de cancelación de la solicitud

    try {
        // Buscar la reserva asociada al evento
        $reserva = ReservaDiscoteca::where('sala_id', $evento->sala_id)
            ->where('fecha_reserva', $evento->fecha_evento)
            ->first();

        if ($reserva) {
            // Verifica si es el mismo día y no permite eliminar si aplica
            $hoy = now()->startOfDay();
            $fechaReserva = Carbon::parse($reserva->fecha_reserva);

            if ($fechaReserva->isSameDay($hoy)) {
                return response()->json(['error' => 'No se puede eliminar un evento para el mismo día.'], 403);
            }

            // Devolver el 30% del precio al usuario que hizo la reserva
            $usuarioReserva = $reserva->usuario;
            $sala = $reserva->sala;
            $reembolso = $sala->precio * 0.3;

            $usuarioReserva->saldo += $reembolso;
            $usuarioReserva->save();

            // Crear una notificación para el usuario de la reserva
            Notificacion::create([
                'usuario_id' => $usuarioReserva->id,
                'mensaje' => "El evento '{$evento->nombre_evento}' ha sido cancelado. Se ha reembolsado el 30% del importe de tu reserva. Motivo de la cancelación: {$motivoCancelacion}",
                'leido' => false,
            ]);

            // Eliminar la reserva
            $reserva->delete();
        }

        // Procesar reembolsos si el evento tiene compras asociadas
        $compras = Compra::whereHas('entradas', function ($query) use ($evento) {
            $query->where('evento_id', $evento->id);
        })->with('entradas')->get();

        foreach ($compras as $compra) {
            $totalReembolso = 0;

            foreach ($compra->entradas as $entrada) {
                if ($entrada->evento_id == $evento->id) {
                    // Accede a la cantidad de la tabla pivote
                    $cantidad = $entrada->pivot->cantidad ?? 0;
                    $totalReembolso += $entrada->precio * $cantidad;
                }
            }

            if ($totalReembolso > 0) {
                // Reembolsar al usuario
                $compra->usuario->saldo += $totalReembolso;
                $compra->usuario->save();

                // Crear notificación para el comprador
                Notificacion::create([
                    'usuario_id' => $compra->usuario->id,
                    'mensaje' => "El evento '{$evento->nombre_evento}' ha sido cancelado. Se ha reembolsado el importe de tu compra. Motivo de la cancelación: {$motivoCancelacion}",
                    'leido' => false,
                ]);
            }

            // Eliminar la relación con las entradas
            $compra->entradas()->detach();

            // Eliminar la compra
            $compra->delete();
        }

        // Actualizar los ingresos del creador del evento
        $creador = $evento->creador; // Accedemos al creador a través del evento
        if ($creador) {
            $totalReembolsado = $compras->sum(function ($compra) {
                return $compra->entradas->sum(function ($entrada) {
                    return $entrada->precio * ($entrada->pivot->cantidad ?? 0);
                });
            });

            $creador->ingresos -= $totalReembolsado;
            $creador->save();

            // Crear una notificación para el creador del evento
            Notificacion::create([
                'usuario_id' => $creador->id,
                'mensaje' => "Tu evento '{$evento->nombre_evento}' ha sido cancelado. Motivo de la cancelación: {$motivoCancelacion}",
                'leido' => false,
            ]);
        }

        // Eliminar el evento
        $evento->delete();

    } catch (\Exception $e) {
        \Log::error('Error al eliminar evento y procesar reembolsos: ' . $e->getMessage());
        return response()->json(['error' => 'Hubo un problema al eliminar el evento y procesar los reembolsos.'], 500);
    }

    return response()->json(['message' => 'Evento, compras y reservas eliminados con éxito, reembolsos procesados.']);
}







public function actualizarSaldo(Request $request)
{
    // Validar los datos de entrada
    $validated = $request->validate([
        'id' => 'required|exists:users,id', // El ID debe existir en la tabla de usuarios
        'saldo' => 'required|numeric|min:0', // El saldo debe ser un número mayor o igual a 0
        'mensaje' => 'nullable|string', // Mensaje opcional
    ]);

    try {
        // Buscar el usuario
        $user = User::findOrFail($validated['id']);

        // Incrementar el saldo
        $nuevoSaldo = $user->saldo + $validated['saldo'];
        $user->saldo = $nuevoSaldo;
        $user->save();

        // Crear la notificación
        Notificacion::create([
            'usuario_id' => $user->id,
            'mensaje' => $validated['mensaje'] ?? 'Tu saldo ha sido actualizado.',
            'leido' => false,
        ]);

        return response()->json([
            'message' => 'Saldo actualizado correctamente y notificación enviada.',
            'nuevoSaldo' => $nuevoSaldo,
        ], 200);
    } catch (\Exception $e) {
        \Log::error('Error al actualizar el saldo:', ['error' => $e->getMessage()]);
        return response()->json(['message' => 'Error interno del servidor.'], 500);
    }
}




}
