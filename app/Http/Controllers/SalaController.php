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
    
}
