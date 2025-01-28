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
use App\Models\Producto;
use App\Models\Categoria;
use App\Models\HistorialIngresos;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;


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
    
    public function actualizarEstadoEvento(Request $request, $id)
    {
        // encuentra el evento por id o muestra error si no
        $evento = Evento::findOrFail($id);

    
        $validated = $request->validate([
            'estado' => 'required|in:pendiente,apto,denegado',
        ]);

        $evento->estado = $validated['estado'];
        $evento->save();

        return response()->json(['message' => 'Estado del evento actualizado correctamente']);
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

    // mira si el usuario tiene eventos futuros
    $tieneEventosFuturos = DB::table('reserva_discotecas')
        ->join('eventos', 'reserva_discotecas.sala_id', '=', 'eventos.sala_id')
        ->where('reserva_discotecas.usuario_id', $id)
        ->where('eventos.fecha_evento', '>=', now())
        ->exists();

    if ($tieneEventosFuturos) {
        return response()->json(['message' => 'El usuario no puede ser eliminado porque tiene eventos futuros.'], 403);
    }

    $usuario->delete();

    return response()->json(['message' => 'Usuario eliminado con éxito.']);
}


public function crearEvento(Request $request)
{

    $request->validate([
        'nombre_evento' => 'required|string',
        'descripcion' => 'nullable|string',
        'fecha_evento' => 'required|date',
        'hora_inicio' => 'required|date_format:H:i',
        'hora_final' => 'required|date_format:H:i',
        'cartel' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'precio_normal' => 'required|numeric|min:0',
        'precio_vip' => 'nullable|numeric|min:0',
        'precio_premium' => 'nullable|numeric|min:0',
    ]);

    // mira si existe un evento para esa fecha
    $eventoExistente = Evento::where('fecha_evento', $request->fecha_evento)->first();

    if ($eventoExistente) {
        return response()->json([
            'message' => 'Ya existe un evento programado para esta fecha. Por favor, elige otro día.',
        ], 422);
    }

    // sala "discoteca"
    $sala = \App\Models\Sala::where('tipo_sala', 'discoteca')->firstOrFail();

    // crear el evento
    $evento = new Evento();
    $evento->nombre_evento = $request->nombre_evento;
    $evento->descripcion = $request->descripcion;
    $evento->fecha_evento = $request->fecha_evento;
    $evento->hora_inicio = $request->hora_inicio;
    $evento->hora_final = $request->hora_final;
    $evento->sala_id = $sala->id;

    // sube el cartel y lo guarda en la carpeta /carteles
    if ($request->hasFile('cartel')) {
        $cartelPath = $request->file('cartel')->store('carteles', 'public');
        $evento->cartel = $cartelPath;
    }

    $evento->save();

    // crear la entrada normal
    $evento->entradas()->create([
        'tipo' => 'normal',
        'precio' => $request->precio_normal,
    ]);

    // crear entradas VIP y Premium si las pongo
    if ($request->filled('precio_vip')) {
        $evento->entradas()->create([
            'tipo' => 'vip',
            'precio' => $request->precio_vip,
        ]);
    }

    if ($request->filled('precio_premium')) {
        $evento->entradas()->create([
            'tipo' => 'premium',
            'precio' => $request->precio_premium,
        ]);
    }

    return response()->json($evento, 201);
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
    $motivoCancelacion = $request->input('motivo_cancelacion'); //  motivo de cancelación de la solicitud

    try {
        // nusca la reserva asociada al evento
        $reserva = ReservaDiscoteca::where('sala_id', $evento->sala_id)
            ->where('fecha_reserva', $evento->fecha_evento)
            ->first();

        if ($reserva) {
            // verifica si es el mismo día y no permite eliminar si es para el mismo dia
            $hoy = now()->startOfDay();
            $fechaReserva = Carbon::parse($reserva->fecha_reserva);

            if ($fechaReserva->isSameDay($hoy)) {
                return response()->json(['error' => 'No se puede eliminar un evento para el mismo día.'], 403);
            }

            // devuelve el 100% del precio al usuario que hizo la reserva
            $usuarioReserva = $reserva->usuario; //busca al usuario que hizo la reserva
            $sala = $reserva->sala;
            $reembolso = $sala->precio; // el reembolso es de lo que vale la sala

            $usuarioReserva->saldo += $reembolso; // se le añade al saldo 
            $usuarioReserva->save();

            //marca en el histotial de admin la devolucion del reembolso
            HistorialIngresos::create([
            'cantidad' => -$reembolso, // Se registra como negativo
            'motivo' => "Reembolso por cancelación del evento '{$evento->nombre_evento}' en la sala '{$sala->nombre}'",
            'created_at' => now(),
            'updated_at' => now(),
        ]);
            // crear una notificación para el usuario de la reserva
            Notificacion::create([
                'usuario_id' => $usuarioReserva->id,
                'mensaje' => "El evento '{$evento->nombre_evento}' ha sido cancelado. Se ha reembolsado el 100% del importe de tu reserva. Motivo de la cancelación: {$motivoCancelacion}",
                'leido' => false,
            ]);

          
            $reserva->delete();
        }

        // hce reembolsos si el evento tiene compras asociadas
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
                // reembokso al usuario
                $compra->usuario->saldo += $totalReembolso;
                $compra->usuario->save();

                // crea notificación para el comprador
                Notificacion::create([
                    'usuario_id' => $compra->usuario->id,
                    'mensaje' => "El evento '{$evento->nombre_evento}' ha sido cancelado. Se ha reembolsado el importe de tu compra. Motivo de la cancelación: {$motivoCancelacion}",
                    'leido' => false,
                ]);
            }

            // elimina la relación con las entradas
            $compra->entradas()->detach();

            // elimina la compra
            $compra->delete();
        }

        // actualizar los ingresos del creador del evento
        $creador = $evento->creador; 
        if ($creador) {
            $totalReembolsado = $compras->sum(function ($compra) {
                return $compra->entradas->sum(function ($entrada) {
                    return $entrada->precio * ($entrada->pivot->cantidad ?? 0);
                });
            });

            $creador->ingresos -= $totalReembolsado;
            $creador->save();

            // crear una notificación para el creador del evento
            Notificacion::create([
                'usuario_id' => $creador->id,
                'mensaje' => "Tu evento '{$evento->nombre_evento}' ha sido cancelado. Motivo de la cancelación: {$motivoCancelacion}",
                'leido' => false,
            ]);
        }

        $evento->delete();

    } catch (\Exception $e) {
        \Log::error('Error al eliminar evento y procesar reembolsos: ' . $e->getMessage());
        return response()->json(['error' => 'Hubo un problema al eliminar el evento y procesar los reembolsos.'], 500);
    }

    return response()->json(['message' => 'Evento, compras y reservas eliminados con éxito, reembolsos procesados.']);
}







public function actualizarSaldo(Request $request)
{
   
    $validated = $request->validate([
        'id' => 'required|exists:users,id', 
        'saldo' => 'required|numeric|min:0', 
        'mensaje' => 'nullable|string', 
    ]);

    try {
       
        $user = User::findOrFail($validated['id']);

     
        $nuevoSaldo = $user->saldo + $validated['saldo'];
        $user->saldo = $nuevoSaldo;
        $user->save();

       
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

public function mostrarIngresos()
{
    $admin = auth()->user();

    if ($admin->rol !== 'admin') {
        return response()->json(['error' => 'Acceso no autorizado.'], 403);
    }

    return response()->json([
        'ingresos' => $admin->ingresos,
    ]);
}

public function crearCategoria(Request $request)
{
    $request->validate([
        'nombre' => 'required|string|max:255|unique:categorias,nombre',
    ]);

    $categoria = Categoria::create(['nombre' => $request->nombre]);

    return response()->json(['message' => 'Categoría creada correctamente', 'categoria' => $categoria], 201);
}

public function listarCategorias()
{
    return response()->json(Categoria::all());
}

public function crearProducto(Request $request)
{
    $request->validate([
        'nombre' => 'required|string|max:255',
        'precio' => 'required|numeric|min:0',
        'descripcion' => 'required|string',
        'stock' => 'required|integer|min:0',
        'categoria_id' => 'nullable|exists:categorias,id',
    ]);

    $producto = Producto::create($request->all());

    return response()->json(['message' => 'Producto creado correctamente', 'producto' => $producto], 201);
}


public function listarProductos()
{
    return response()->json(Producto::with('categoria')->get());
}


public function actualizarProducto(Request $request, $id)
{
    $producto = Producto::findOrFail($id);

    $request->validate([
        'nombre' => 'required|string|max:255',
        'precio' => 'required|numeric|min:0',
        'descripcion' => 'required|string',
        'stock' => 'required|integer|min:0',
        'categoria_id' => 'nullable|exists:categorias,id',
    ]);

    $producto->update($request->all());

    return response()->json(['message' => 'Producto actualizado correctamente', 'producto' => $producto]);
}

public function eliminarProducto($id)
{
    Producto::destroy($id);
    return response()->json(['message' => 'Producto eliminado correctamente']);
}

public function historialIngresos()
{
    $ingresos = DB::table('historial_ingresos')
        ->orderBy('created_at', 'asc')
        ->get();

    return response()->json($ingresos);
}

public function reponerStock(Request $request)
{
    $admin = auth()->user();

    // comprueba qe lo hace un admin
    if (!$admin || $admin->rol !== 'admin') {
        return response()->json(['error' => 'No autorizado'], 403);
    }

    DB::beginTransaction();

    try {
        $totalCosto = 0;

        foreach ($request->compras as $compra) {
            $producto = Producto::findOrFail($compra['id']);
            $costoCompra = $producto->precio * 0.3 * $compra['cantidad']; // el precio de compra será un 30% del precio de venta

            // Verifica si el admin tiene suficiente saldo antes de continuar
            if ($admin->ingresos < $costoCompra) {
                DB::rollBack();
                return response()->json(['error' => 'Fondos insuficientes para la reposición'], 400);
            }

            // Actualizar el stock del producto
            $producto->increment('stock', $compra['cantidad']);

            // Restar el costo de la compra de los ingresos del admin
            $admin->decrement('ingresos', $costoCompra);

            // Registrar en historial de ingresos
            HistorialIngresos::create([
                'cantidad' => -$costoCompra, // Se registra como un gasto
                'motivo' => "Compra de {$compra['cantidad']} unidades de {$producto->nombre}",
                'created_at' => now(),
            ]);

            $totalCosto += $costoCompra;
        }

        DB::commit();

        return response()->json(['message' => 'Stock repuesto con éxito', 'costoTotal' => $totalCosto]);

    } catch (\Exception $e) {
        DB::rollBack();
        \Log::error("Error al reponer stock: " . $e->getMessage());
        return response()->json(['error' => 'Ocurrió un error al procesar la reposición'], 500);
    }
}


}
