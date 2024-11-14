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

    ReservaDiscoteca::create([
        'usuario_id' => auth()->id(), // Asumiendo que el usuario está autenticado
        'sala_id' => $id,
        'fecha_reserva' => $validatedData['fecha_reserva'],
        'disponibilidad' => 'reservada',
        'asistentes' => $validatedData['asistentes'],
        'descripcion' => $validatedData['descripcion'],
    ]);

    return response()->json(['message' => 'Reserva creada exitosamente'], 201);
}

    
}
