<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Entrada;
use App\Models\Compra;
use App\Models\ReservaDiscoteca;
use App\Models\Notificacion;
use App\Models\HistorialIngresos;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

class EventoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Evento  $evento
     * @return \Illuminate\Http\Response
     */

    
    
    

    
    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Evento  $evento
     * @return \Illuminate\Http\Response
     */
    public function edit(Evento $evento)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Evento  $evento
     * @return \Illuminate\Http\Response
     */


    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Evento  $evento
     * @return \Illuminate\Http\Response
     */
    public function destroy(Evento $evento)
    {
        //
    }

    public function showEntradas($eventoId)
    {
       
        $evento = Evento::findOrFail($eventoId);

        // obtiene las entradas asociadas al evento
        $entradas = Entrada::where('evento_id', $eventoId)->get(['tipo', 'precio']);

      
        return Inertia::render('FiestaEntradas', [
            'evento' => $evento,
            'entradas' => $entradas
        ]);
    }

    public function obtenerEntradas($eventoId)
{
    $entradas = \App\Models\Entrada::where('evento_id', $eventoId)
        ->with('evento') // Incluye la relación con el evento
        ->get();

    return response()->json($entradas);
}


 
public function mostrarConcierto($id)
{
    $concierto = Evento::with(['sala', 'entradas'])->findOrFail($id);

    return Inertia::render('Concierto', [
        'concierto' => $concierto,
    ]);
}

public function listarConciertos()
{
    $conciertos = Evento::whereHas('reservas', function ($query) {
        $query->where('tipo_reserva', 'concierto');
    })
    ->where('fecha_evento', '>=', now()) // Filtrar eventos futuros o actuales
    ->with(['sala', 'entradas']) // Incluye sala y entradas relacionadas
    ->get();

    return Inertia::render('Conciertos', [
        'conciertos' => $conciertos,
    ]);
}


public function show($id)
{
    // Buscar evento con sus relaciones
    $evento = Evento::with('entradas.compras', 'sala')->find($id);

    if (!$evento) {
        return abort(404, 'Evento no encontrado');
    }

    // Verificar si el usuario tiene permiso para ver este evento
    if (auth()->user()->cannot('view', $evento)) {
        return redirect()->route('admin.eventos.index')->with('error', 'No tienes permiso para ver este evento.');
    }

    $entradasVendidas = $evento->entradas->sum(function ($entrada) {
        return $entrada->compras->sum(function ($compra) {
            return $compra->pivot->cantidad;
        });
    });

    // obtener la capacidad total desde la sala asociada
    $capacidadTotal = $evento->sala->capacidad ?? 0;

    // calcular el porcentaje 
    $porcentajeOcupado = $capacidadTotal > 0 ? round(($entradasVendidas / $capacidadTotal) * 100, 2) : 0;

    return Inertia::render('Evento', [
        'evento' => $evento,
        'estadisticas' => [
            'entradas_vendidas' => $entradasVendidas,
           'aforo_total' => $capacidadTotal,
            'porcentaje_ocupado' => $porcentajeOcupado,
        ],
    ]);
}


public function mostrarEvento($id)
{
    $evento = Evento::with(['entradas.compras', 'sala'])->findOrFail($id);

    // obtener la suma de las entradas vendidas
    $entradasVendidas = $evento->entradas->sum(function ($entrada) {
        return $entrada->compras->sum(function ($compra) {
            return $compra->pivot->cantidad;
        });
    });

    // obtener la capacidad total desde la sala asociada
    $capacidadTotal = $evento->sala->capacidad ?? 0;

    // calcular el porcentaje 
    $porcentajeOcupado = $capacidadTotal > 0 ? round(($entradasVendidas / $capacidadTotal) * 100, 2) : 0;

    return Inertia::render('Evento', [
        'evento' => $evento,
        'estadisticas' => [
            'entradas_vendidas' => $entradasVendidas,
            'aforo_total' => $capacidadTotal,
            'porcentaje_ocupado' => $porcentajeOcupado,
        ],
    ]);
}




public function update(Request $request, $id)
{
    $evento = Evento::findOrFail($id);

    $request->validate([
        'nombre_evento' => 'required|string|max:255',
        'descripcion' => 'required|string',
        'cartel' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    $evento->nombre_evento = $request->input('nombre_evento');
    $evento->descripcion = $request->input('descripcion');

    if ($request->hasFile('cartel')) {
        $path = $request->file('cartel')->store('carteles', 'public');
        $evento->cartel = $path;
    }

    $evento->save();

    return redirect()->back()->with('success', 'Evento actualizado correctamente.');
}


public function obtenerEstadisticasVentas($id)
{
    $evento = Evento::with(['entradas.compras'])->findOrFail($id);

   
    if ($evento->entradas->isEmpty()) {
        return response()->json([], 200);
    }

    
    $ventasPorDia = $evento->entradas->flatMap(function ($entrada) {
        return $entrada->compras->map(function ($compra) use ($entrada) {
            return [
                'fecha' => $compra->fecha_compra->toDateString(),
                'ingreso' => $compra->pivot->cantidad * $entrada->precio,
                'cantidad' => $compra->pivot->cantidad,
            ];
        });
    });

    // agrupar por fecha
    $estadisticas = $ventasPorDia
        ->groupBy('fecha')
        ->map(function ($compras, $fecha) {
            return [
                'fecha' => $fecha,
                'total_ingresos' => $compras->sum('ingreso'),
                'total_ventas' => $compras->sum('cantidad'),
            ];
        })
        ->sortBy('fecha') // asegurarse de que los datos estén ordenados cronológicamente
        ->values();

    // calcular los ingresos acumulados
    $ingresosAcumulados = 0;
    $estadisticasConAcumulados = $estadisticas->map(function ($dia) use (&$ingresosAcumulados) {
        $ingresosAcumulados += $dia['total_ingresos'];
        return array_merge($dia, ['ingresos_acumulados' => $ingresosAcumulados]);
    });

    return response()->json($estadisticasConAcumulados);
}


public function obtenerEventosUsuario(Request $request)
{
    $user = $request->user();

    // obtiene los  eventos asociados a las reservas del usuario
    $eventos = Evento::whereHas('sala.reservas', function ($query) use ($user) {
        $query->where('usuario_id', $user->id);
    })->get();

    return response()->json($eventos);
}

public function eventosProximos(): Response
{
    $eventos = Evento::where('estado', 'apto')
        ->where('fecha_evento', '>=', now()) // Solo eventos futuros o actuales
        ->orderBy('fecha_evento', 'asc')
        ->take(10) // Opcional: limitar a 10 eventos
        ->get();

    return Inertia::render('Index', [
        'eventos' => $eventos
    ]);
}
public function obtenerDiasOcupados()
{
    $diasOcupados = Evento::pluck('fecha_evento')->toArray(); 
    return response()->json($diasOcupados);
}

public function misEventos(Request $request)
{
    $user = $request->user();

    $eventos = Evento::whereHas('sala.reservas', function ($query) use ($user) {
            // Filtrar reservas que pertenecen al usuario actual
            $query->where('usuario_id', $user->id);
        })
        ->whereHas('sala.reservas', function ($query) {
            // Verificar que la fecha de la reserva coincida con la fecha del evento
            $query->whereColumn('fecha_reserva', 'eventos.fecha_evento');
        })
        ->with(['sala.reservas' => function ($query) use ($user) {
            $query->where('usuario_id', $user->id);
        }])
        ->get()
        ->map(function ($evento) {
            // Agregar reserva_id al array del evento
            $reserva = $evento->sala->reservas->firstWhere('fecha_reserva', $evento->fecha_evento);
            return array_merge($evento->toArray(), ['reserva_id' => $reserva->id ?? null]);
        });

    return Inertia::render('MiCuentaEventos', [
        'eventos' => $eventos,
    ]);
}


public function cancelarEvento($id)
{
    DB::beginTransaction();
    try {
        $evento = Evento::findOrFail($id);
        $admin = User::where('rol', 'admin')->firstOrFail();
        $admin->refresh();

        // Obtener la reserva asociada al evento
        $reserva = ReservaDiscoteca::where('sala_id', $evento->sala_id)
            ->where('fecha_reserva', $evento->fecha_evento)
            ->first();

        if (!$reserva) {
            return response()->json(['error' => 'No se encontró la reserva asociada a este evento.'], 404);
        }

        // Obtener todas las compras relacionadas con este evento
        $compras = Compra::whereHas('entradas', function ($query) use ($evento) {
            $query->where('evento_id', $evento->id);
        })->with('entradas')->get();

        // Procesar reembolsos para los compradores de entradas
        foreach ($compras as $compra) {
            $totalReembolso = 0;

            foreach ($compra->entradas as $entrada) {
                if ($entrada->evento_id == $evento->id) {
                    $cantidad = $entrada->pivot->cantidad ?? 0;
                    $totalReembolso += $entrada->precio * $cantidad;
                }
            }

            if ($totalReembolso > 0) {
                // Realizar reembolso al usuario
                $compra->usuario->increment('saldo', $totalReembolso);

                // Notificar al comprador
                Notificacion::create([
                    'usuario_id' => $compra->usuario->id,
                    'mensaje' => "El evento '{$evento->nombre_evento}' ha sido cancelado. Se ha reembolsado el importe de tu compra.",
                    'leido' => false,
                ]);

                // Desvincular las entradas de la compra
                $compra->entradas()->detach();
            }
        }

        // Eliminar las compras después de procesar los reembolsos
        Compra::whereHas('entradas', function ($query) use ($evento) {
            $query->where('evento_id', $evento->id);
        })->delete();

        // Reembolsar el 30% del costo de la reserva al creador del evento
        $usuario = $reserva->usuario;
        $sala = $reserva->sala;
        $hoy = now()->startOfDay();
        $fechaReserva = Carbon::parse($reserva->fecha_reserva);

        if ($fechaReserva->isSameDay($hoy)) {
            return response()->json(['error' => 'No se puede cancelar un evento el mismo día.'], 403);
        }

        $reembolso = $sala->precio * 0.3;
        $usuario->increment('saldo', $reembolso);
        $admin->decrement('ingresos', $reembolso);

        // **REGISTRAR EN HISTORIAL DE INGRESOS**
        HistorialIngresos::create([
            'cantidad' => -$reembolso, // Se registra como negativo
            'motivo' => "Reembolso por cancelación del evento '{$evento->nombre_evento}' en la sala '{$sala->nombre}'",
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Notificar al creador del evento sobre la cancelación y el reembolso
        Notificacion::create([
            'usuario_id' => $usuario->id,
            'mensaje' => "Has cancelado el evento '{$evento->nombre_evento}'. Se ha reembolsado el 30% del precio de la reserva.",
            'leido' => false,
        ]);

        // Eliminar el evento y la reserva asociada
        $evento->delete();
        $reserva->delete();

        DB::commit();

        return response()->json(['message' => 'Evento cancelado con éxito y reembolsos procesados.']);
    } catch (\Exception $e) {
        DB::rollBack();
        \Log::error('Error al cancelar el evento: ' . $e->getMessage());
        return response()->json(['error' => 'Hubo un problema al cancelar el evento.'], 500);
    }
}

}
