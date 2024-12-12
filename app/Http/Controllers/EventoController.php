<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Entrada;

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
    public function show($id)
{
    $evento = Evento::with('entradas.compras', 'sala')->find($id);

    if (!$evento) {
        return abort(404, 'Evento no encontrado');
    }

    $entradasVendidas = $evento->entradas->reduce(function ($total, $entrada) {
        return $total + $entrada->compras->sum('pivot.cantidad');
    }, 0);

    $aforoTotal = $evento->sala->aforo ?? 0;

    return Inertia::render('Evento', [
        'evento' => $evento,
        'estadisticas' => [
            'entradas_vendidas' => $entradasVendidas,
            'aforo_total' => $aforoTotal,
            'porcentaje_ocupado' => $aforoTotal > 0 ? round(($entradasVendidas / $aforoTotal) * 100, 2) : 0,
        ],
    ]);
}

    
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

    return inertia('Concierto', [
        'concierto' => $concierto,
    ]);
}

public function listarConciertos()
{
    $conciertos = Evento::whereHas('reservas', function ($query) {
        $query->where('tipo_reserva', 'concierto');
    })
    ->with(['sala', 'entradas']) // incluye sala y entradas relacionadas
    ->get();

    return inertia('Conciertos', [
        'conciertos' => $conciertos,
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





}
