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
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\HistorialIngresos;
use Illuminate\Support\Facades\DB;


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

    $admin = User::where('rol', 'admin')->first();
    if (!$admin) {
        return response()->json(['error' => 'No se encontró un administrador para recibir el pago.'], 500);
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

    DB::beginTransaction();
    try {
        // Descontar el saldo del usuario
        $usuario->decrement('saldo', $sala->precio);
        
        // Aumentar los ingresos del administrador
        $admin->increment('ingresos', $sala->precio);

        // **Registrar el ingreso en historial_ingresos**
        HistorialIngresos::create([
            'cantidad' => $sala->precio,
            'motivo' => "Reserva de sala: {$sala->nombre}",
        ]);

        // Crear la reserva
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

            $evento = Evento::create([
                'nombre_evento' => $validatedData['nombre_concierto'],
                'descripcion' => $validatedData['descripcion'],
                'fecha_evento' => $validatedData['fecha_reserva'],
                'hora_inicio' => $validatedData['hora_inicio'],
                'hora_final' => $validatedData['hora_fin'],
                'cartel' => $cartelPath,
                'sala_id' => $sala->id,
            ]);

            // Crear entradas para el evento
            Entrada::create([
                'evento_id' => $evento->id,
                'tipo' => 'normal',
                'precio' => $validatedData['precio_entrada'],
            ]);
        }

        // **Generar la factura en PDF**
        try {
            $facturaData = [
                'usuario' => [
                    'nombre' => $usuario->name,
                    'email' => $usuario->email,
                ],
                'reserva' => [
                    'fecha_reserva' => $reserva->fecha_reserva,
                    'tipo_reserva' => $reserva->tipo_reserva,
                    'descripcion' => $reserva->descripcion,
                    'nombre_concierto' => $validatedData['nombre_concierto'] ?? null,
                    'hora_inicio' => $validatedData['hora_inicio'] ?? null,
                    'hora_fin' => $validatedData['hora_fin'] ?? null,
                    'asistentes' => $reserva->asistentes,
                ],
                'sala' => [
                    'nombre' => $sala->nombre,
                    'precio' => $sala->precio,
                ],
                'total' => $sala->precio,
            ];

            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('factura', $facturaData);
            $fileName = "facturas/factura_reserva_{$reserva->id}.pdf";
            \Illuminate\Support\Facades\Storage::disk('public')->put($fileName, $pdf->output());
        } catch (\Exception $e) {
            \Log::error('Error al generar la factura: ' . $e->getMessage());
        }

        DB::commit();

        \Log::info("Usuario autenticado:", ['user' => $usuario->id, 'saldo' => $usuario->saldo]);
\Log::info("Precio de la sala:", ['sala_id' => $sala->id, 'precio' => $sala->precio]);
\Log::info("Usuario Admin:", ['admin_id' => $admin ? $admin->id : 'No encontrado']);


        // Respuesta exitosa
        return response()->json(['message' => 'Reserva creada exitosamente.'], 201);
    } catch (\Exception $e) {
        DB::rollBack();
        \Log::error('Error al crear la reserva: ' . $e->getMessage());
        return response()->json(['error' => 'Error al procesar la reserva'], 500);
    }
}

public function cancelarReserva($id)
{
    DB::beginTransaction();
    try {
        $reserva = ReservaDiscoteca::findOrFail($id);
        $usuario = $reserva->usuario;
        $sala = $reserva->sala;
        $admin = User::where('rol', 'admin')->lockForUpdate()->first(); // Bloqueo de fila para evitar inconsistencia

        if (!$admin) {
            return response()->json(['error' => 'No se encontró un administrador para procesar el reembolso.'], 500);
        }

        $hoy = now()->startOfDay();
        $fechaReserva = Carbon::parse($reserva->fecha_reserva);

        // No permitir cancelación el mismo día de la reserva
        if ($fechaReserva->isSameDay($hoy)) {
            return response()->json(['error' => 'No se puede cancelar una reserva para el mismo día.'], 403);
        }

        // Calcular el reembolso (30% del precio de la sala)
        $reembolso = $sala->precio * 0.3;

        // **Forzar actualización del saldo del administrador antes de restarlo**
        $admin = User::where('rol', 'admin')->firstOrFail();
        $admin->refresh(); // Forzar actualización desde la base de datos

        // Verificar si el administrador tiene suficientes ingresos para cubrir el reembolso
        if ($admin->ingresos < $reembolso) {
            return response()->json(['error' => 'El administrador no tiene fondos suficientes para el reembolso.'], 500);
        }

        // **Caso especial: Si es un concierto, manejar reembolsos a los compradores**
        if ($reserva->tipo_reserva === 'concierto') {
            $evento = Evento::where('sala_id', $reserva->sala_id)
                ->where('fecha_evento', $reserva->fecha_reserva)
                ->first();

            if (!$evento) {
                return response()->json(['error' => 'Evento no encontrado.'], 404);
            }

            // Obtener compras asociadas al evento
            $compras = Compra::whereHas('entradas', function ($query) use ($evento) {
                $query->where('evento_id', $evento->id);
            })->with('entradas')->get();

            foreach ($compras as $compra) {
                $totalReembolso = 0;

                foreach ($compra->entradas as $entrada) {
                    if ($entrada->evento_id == $evento->id) {
                        $cantidad = $entrada->pivot->cantidad ?? 0;
                        $totalReembolso += $entrada->precio * $cantidad;
                    }
                }

                if ($totalReembolso > 0) {
                    // Reembolso a los compradores
                    $compra->usuario->saldo += $totalReembolso;
                    $compra->usuario->save();

                    // Notificación al comprador
                    Notificacion::create([
                        'usuario_id' => $compra->usuario->id,
                        'mensaje' => "El evento '{$evento->nombre_evento}' ha sido cancelado. Se ha reembolsado el importe de tu compra.",
                        'leido' => false,
                    ]);

                    // Eliminar entradas de la compra
                    $compra->entradas()->detach();
                }
            }

            // Eliminar las compras después del reembolso
            Compra::whereHas('entradas', function ($query) use ($evento) {
                $query->where('evento_id', $evento->id);
            })->delete();

            // Actualizar los ingresos del creador del evento
            $totalRecibido = $compras->sum(function ($compra) use ($evento) {
                return $compra->entradas->where('evento_id', $evento->id)->sum(function ($entrada) {
                    return $entrada->precio * ($entrada->pivot->cantidad ?? 0);
                });
            });

            $creador = $reserva->usuario;
            $creador->ingresos -= $totalRecibido;
            $creador->save();

            // Eliminar el evento
            $evento->delete();
        }

        // **1️⃣ Descontar el reembolso de los ingresos del administrador**
        $admin->ingresos -= $reembolso;
        $admin->save();

        // * REGISTRAR EN HISTORIAL DE INGRESOS**
        HistorialIngresos::create([
            'cantidad' => -$reembolso, // Se registra como negativo
            'motivo' => "Reembolso por cancelación de reserva de la sala '{$sala->nombre}'",
            'created_at' => now(),
        ]);

        // **2️⃣ Reembolsar al usuario**
        $usuario->saldo += $reembolso;
        $usuario->save();

        // **3️⃣ Eliminar la reserva**
        $reserva->delete();

        DB::commit();

        return response()->json(['message' => 'Reserva cancelada con éxito y reembolso procesado.']);
    } catch (\Exception $e) {
        DB::rollBack();
        \Log::error('Error al procesar el reembolso de la reserva:', ['error' => $e->getMessage()]);
        return response()->json(['error' => 'Hubo un problema al procesar el reembolso.'], 500);
    }
}

    

public function descargarFactura($id)
{
    $reserva = ReservaDiscoteca::with(['sala', 'usuario'])->findOrFail($id);

    try {
        // Recuperar el evento relacionado manualmente
        $evento = \App\Models\Evento::where('sala_id', $reserva->sala_id)
                                    ->where('fecha_evento', $reserva->fecha_reserva)
                                    ->first();

        // Construir los datos de la factura
        $facturaData = [
            'usuario' => [
                'nombre' => $reserva->usuario->name,
                'email' => $reserva->usuario->email,
                'documento_fiscal' => $reserva->usuario->documento_fiscal,
                'direccion' => $reserva->usuario->direccion,
                'telefono' => $reserva->usuario->telefono,
            ],
            'reserva' => [
                'fecha_reserva' => $reserva->fecha_reserva,
                'tipo_reserva' => $reserva->tipo_reserva,
                'descripcion' => $evento->descripcion ?? 'No especificada',
                'nombre_concierto' => $evento->nombre_evento ?? 'No especificado',
                'hora_inicio' => $evento->hora_inicio ?? 'No especificada',
                'hora_fin' => $evento->hora_final ?? 'No especificada',
            ],
            'sala' => [
                'tipo_sala' => $reserva->sala->tipo_sala,
                'precio' => $reserva->sala->precio,
            ],
        ];

        // Generar el PDF
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('factura', $facturaData);

        // Descargar el PDF
        return $pdf->download("factura_reserva_{$reserva->id}.pdf");
    } catch (\Exception $e) {
        // Registrar el error en los logs y devolver un mensaje de error
        \Log::error('Error al generar la factura: ' . $e->getMessage());
        return response()->json(['error' => 'Error al generar la factura.'], 500);
    }
}




    
public function mostrarSalaCelebraciones()
{
    $user = auth()->user();

    // mira si el usuario tiene rol de promotor o admin
    if (!$user || !in_array($user->rol, ['promotor', 'admin'])) {
        return redirect()->route('convertir-promotor')
            ->with('message', 'Debes ser promotor o administrador para acceder a esta sección.');
    }

 
    return Inertia::render('SalaCelebraciones', [
        'user' => $user, 
    ]);
}


}
