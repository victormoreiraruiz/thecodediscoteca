<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sala;
use App\Models\ReservaDiscoteca;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SalaController extends Controller
{

// En SalaController.php
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
    ]);

    $usuario = auth()->user(); // Usuario autenticado
    $sala = Sala::findOrFail($id); // Encuentra la sala

    // Verifica si el usuario tiene saldo suficiente
    if ($usuario->saldo < $sala->precio) {
        return response()->json(['error' => 'Saldo insuficiente para realizar la reserva.'], 403);
    }

    // Descuenta el precio de la sala del saldo del usuario
    $usuario->saldo -= $sala->precio;
    $usuario->save();

    // Crea la reserva
    ReservaDiscoteca::create([
        'usuario_id' => $usuario->id,
        'sala_id' => $id,
        'fecha_reserva' => $validatedData['fecha_reserva'],
        'disponibilidad' => 'reservada',
        'asistentes' => $validatedData['asistentes'],
        'descripcion' => $validatedData['descripcion'],
    ]);

    return response()->json(['message' => 'Reserva creada exitosamente.'], 201);
}


public function cancelarReserva($id)
{
    $reserva = ReservaDiscoteca::findOrFail($id);
    $usuario = $reserva->usuario;
    $sala = $reserva->sala;

    // Verifica si se puede cancelar (más de un día en el futuro)
    $hoy = now();
    if ($reserva->fecha_reserva <= $hoy->addDay()->toDateString()) {
        return response()->json(['error' => 'No se puede cancelar una reserva con menos de 1 día de anticipación.'], 403);
    }

    // Devuelve el precio de la sala al saldo del usuario
    $usuario->saldo += $sala->precio;
    $usuario->save();

    // Elimina la reserva
    $reserva->delete();

    return response()->json(['message' => 'Reserva cancelada con éxito.']);
}



}