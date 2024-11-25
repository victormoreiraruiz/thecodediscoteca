<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class CompraController extends Controller
{
    // Solo almacena el carrito en la sesión y redirige al resumen
    public function iniciarCompra(Request $request)
    {
        $carrito = $request->input('carrito');
        session(['carrito' => $carrito]); // Almacena el carrito en la sesión

        // Redirige al resumen de compra sin crear una compra en la base de datos
        return redirect()->route('compra.resumen');
    }

    // Muestra la página de resumen de compra
    public function resumen(Request $request)
    {
        $user = $request->user();
    
        $carrito = session('carrito', []); // Obtiene el carrito desde la sesión
        $total = collect($carrito)->reduce(function ($sum, $item) {
            return $sum + ($item['precio'] * $item['cantidad']);
        }, 0);
    
        return Inertia::render('ResumenCompra', [
            'carrito' => $carrito,
            'total' => $total,
            'user' => $user ? [
                'nombre' => $user->name,
                'correo' => $user->email,
                'saldo' => $user->saldo,
                'puntos_totales' => $user->puntos_totales,
            ] : null,
        ]);
    }
    

    public function confirmarCompra(Request $request)
    {
        $user = $request->user();
        $carrito = session('carrito', []); // Usa el carrito de la sesión
        $total = collect($carrito)->reduce(function ($sum, $item) {
            return $sum + ($item['precio'] * $item['cantidad']);
        }, 0);
        $pagarConSaldo = $request->input('pagarConSaldo');
    
        // Registra en el log para diagnosticar posibles problemas
        \Log::info('Confirmando compra para usuario:', ['id' => $user->id, 'total' => $total]);
    
        if ($pagarConSaldo && $user->saldo < $total) {
            return redirect()->back()->withErrors(['saldo' => 'Saldo insuficiente para realizar la compra.']);
        }
    
        DB::beginTransaction();
        try {
            // Crea la compra real solo en este punto
            $compra = Compra::create([
                'usuario_id' => $user->id,
                'total' => $total,
                'fecha_compra' => now(),
            ]);
    
            // Asocia cada entrada del carrito a la compra
            foreach ($carrito as $item) {
                if (isset($item['id']) && isset($item['cantidad'])) {
                    $compra->entradas()->attach($item['id'], ['cantidad' => $item['cantidad']]);
                }
            }
    
            // Si el usuario paga con saldo, resta el saldo
            if ($pagarConSaldo) {
                $user->saldo -= $total;
            }
    
            // Calcula los puntos ganados (10% del total) y los suma al usuario
            $puntosGanados = $total * 0.10; // 10% del total gastado
            $user->puntos_totales += $puntosGanados;
            $user->save();
    
            DB::commit();
    
            // Limpia el carrito de la sesión después de confirmar la compra
            session()->forget('carrito');
    
            return redirect()->route('index')->with('success', 'Compra realizada con éxito. Has ganado ' . $puntosGanados . ' puntos.');
    
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error al confirmar compra:', ['error' => $e->getMessage()]);
            return redirect()->back()->withErrors(['error' => 'Hubo un problema al procesar la compra.']);
        }
    }
    public function comprarEntradasConcierto(Request $request, $eventoId)
{
    $user = $request->user();
    $carrito = $request->input('carrito', []); // Recibe el carrito desde el frontend
    $total = collect($carrito)->reduce(function ($sum, $item) {
        return $sum + ($item['precio'] * $item['cantidad']);
    }, 0);

    DB::beginTransaction();
    try {
        // Crea el registro de la compra
        $compra = Compra::create([
            'usuario_id' => $user->id,
            'total' => $total,
            'fecha_compra' => now(),
        ]);

        // Asocia las entradas compradas a la compra
        foreach ($carrito as $item) {
            $entrada = \App\Models\Entrada::where('evento_id', $eventoId)
                ->where('id', $item['id'])
                ->first();

            if (!$entrada) {
                throw new \Exception("La entrada no es válida para el concierto seleccionado.");
            }

            $compra->entradas()->attach($entrada->id, ['cantidad' => $item['cantidad']]);
        }

        DB::commit();

        return response()->json(['message' => 'Compra de entradas realizada con éxito.', 'compra_id' => $compra->id], 201);
    } catch (\Exception $e) {
        DB::rollBack();
        \Log::error('Error al comprar entradas de concierto:', ['error' => $e->getMessage()]);
        return response()->json(['error' => 'No se pudo completar la compra.'], 500);
    }
}

}
