<?php

namespace App\Http\Controllers;

use App\Models\Comanda;
use App\Models\Producto;
use App\Models\Evento;
use App\Models\Mesa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;  
class ComandaController extends Controller
{
    /**
     * Constructor para asegurar que los usuarios estén autenticados
     */
    public function __construct()
    {
        $this->middleware('auth'); 
    }

    /**
     * Crear una nueva comanda.
     */
    public function crearComanda(Request $request)
    {
        \Log::info('Usuario autenticado:', ['user' => auth()->user()]);

        // 🔹 Asegurar que el usuario está autenticado
        if (!Auth::check()) {
            return response()->json(['error' => 'Usuario no autenticado'], 403);
        }

        $usuario = Auth::user();

        // 🔹 Validar los datos de la comanda
        $request->validate([
            'evento_id' => 'required|exists:eventos,id',
            'mesa_id' => 'required|exists:mesas,id',
            'productos' => 'required|array',
            'productos.*.id' => 'required|exists:productos,id',
            'productos.*.cantidad' => 'required|integer|min:1',
        ]);

        $evento = Evento::findOrFail($request->evento_id);
        $hora_actual = Carbon::now();
$hora_inicio = Carbon::parse($evento->hora_inicio);
$hora_fin = Carbon::parse($evento->hora_fin);

\Log::info("Hora actual: {$hora_actual}");
\Log::info("Hora inicio: {$hora_inicio}");
\Log::info("Hora final: {$hora_fin}");

if (!$hora_actual->between($hora_inicio, $hora_fin)) {
    return response()->json(['error' => 'El evento no está activo en este momento'], 403);
}

        $total = 0;
        foreach ($request->productos as $producto) {
            $item = Producto::findOrFail($producto['id']);
            $total += $item->precio * $producto['cantidad'];
        }

        // 🔹 Verificar si el usuario tiene saldo suficiente
        if ($usuario->saldo < $total) {
            return response()->json(['error' => 'Saldo insuficiente para realizar el pedido'], 403);
        }

        DB::beginTransaction();

        try {
            // 🔹 Restar saldo al usuario
            $usuario->decrement('saldo', $total);

            // 🔹 Crear la comanda
            $comanda = Comanda::create([
                'user_id' => $usuario->id,
                'evento_id' => $request->evento_id,
                'mesa_id' => $request->mesa_id,
                'estado' => 'pendiente',
            ]);

            // 🔹 Agregar productos a la comanda
            foreach ($request->productos as $producto) {
                $comanda->productos()->attach($producto['id'], ['cantidad' => $producto['cantidad']]);
            }

            DB::commit();

            return response()->json(['message' => 'Comanda creada con éxito', 'comanda' => $comanda], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error al crear la comanda:', ['error' => $e->getMessage()]);

            return response()->json(['error' => 'Ocurrió un error al procesar la comanda'], 500);
        }
    }

    /**
     * Obtener todas las comandas activas (pendientes o en preparación).
     */
    public function listarComandasActivas()
    {
        $comandas = Comanda::whereIn('estado', ['pendiente', 'preparando'])
            ->with(['mesa', 'usuario', 'productos'])
            ->get();

        return response()->json($comandas);
    }

    /**
     * Actualizar el estado de una comanda.
     */
    public function actualizarEstadoComanda(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|in:pendiente,preparando,entregado',
        ]);

        $comanda = Comanda::findOrFail($id);
        $comanda->update(['estado' => $request->estado]);

        return response()->json(['message' => 'Estado actualizado correctamente', 'comanda' => $comanda]);
    }

    /**
     * Eliminar una comanda.
     */
    public function eliminarComanda($id)
    {
        Comanda::destroy($id);
        return response()->json(['message' => 'Comanda eliminada correctamente']);
    }
}
