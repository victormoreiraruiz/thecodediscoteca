<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sala;
use App\Models\ReservaDiscoteca;
use App\Models\Evento;
use App\Models\Entrada;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SalaController extends Controller
{

    public function obtenerFechasOcupadas($id)
    {
        $fechasOcupadas = ReservaDiscoteca::where('sala_id', $id)
            ->where('disponibilidad', 'reservada') // Solo fechas reservadas
            ->pluck('fecha_reserva')
            ->map(function ($date) {
                return Carbon::parse($date)->format('Y-m-d'); // Convertir a Carbon y formatear
            });

        return response()->json($fechasOcupadas);
    }

    public function crearReserva(Request $request, $id)
    {
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
    
        $usuario = auth()->user(); 
        $sala = Sala::findOrFail($id); 
    
        if ($usuario->saldo < $sala->precio) {
            return response()->json(['error' => 'Saldo insuficiente para realizar la reserva.'], 403);
        }
    
        $usuario->saldo -= $sala->precio;
        $usuario->save();
    
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
    
        if ($validatedData['tipo_reserva'] === 'concierto') {
            $cartelPath = null;
    
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
    
            \App\Models\Entrada::create([
                'evento_id' => $evento->id,
                'tipo' => 'normal',
                'precio' => $validatedData['precio_entrada'],
            ]);
        }
    
        return response()->json(['message' => 'Reserva creada exitosamente.'], 201);
    }
    


    public function cancelarReserva($id)
    {
        $reserva = ReservaDiscoteca::findOrFail($id);
    
        // Verifica si es un concierto y elimina el evento asociado
        if ($reserva->tipo_reserva === 'concierto') {
            $evento = Evento::where('sala_id', $reserva->sala_id)
                ->where('fecha_evento', $reserva->fecha_reserva)
                ->first();
    
            if ($evento) {
                $evento->delete(); // Elimina el evento asociado
            }
        }
    
        $usuario = $reserva->usuario;
        $sala = $reserva->sala;
    
        // Verifica si se puede cancelar (no el mismo día)
        $hoy = now()->startOfDay();
        $fechaReserva = Carbon::parse($reserva->fecha_reserva);
    
        if ($fechaReserva->isSameDay($hoy)) {
            return response()->json(['error' => 'No se puede cancelar una reserva para el mismo día.'], 403);
        }
    
        // Devuelve el 30% del precio al saldo del usuario
        $reembolso = $sala->precio * 0.3;
        $usuario->saldo += $reembolso;
        $usuario->save();
    
        // Elimina la reserva
        $reserva->delete();
    
        return response()->json(['message' => 'Reserva cancelada con éxito.']);
    }
    
}
