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

        $carrito = session('carrito', []); // Obtiene el carrito de la sesión
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
                'puntos_totales' => $user->puntos_totales, // Cambiado de "puntos" a "puntos_totales"
            ] : null,
        ]);
    }

    // Crea la compra en la base de datos al confirmar y asigna puntos
    public function confirmarCompra(Request $request)
    {
        $user = $request->user();
        $carrito = session('carrito', []); // Usa el carrito de la sesión
        $total = collect($carrito)->reduce(function ($sum, $item) {
            return $sum + ($item['precio'] * $item['cantidad']);
        }, 0);
        $pagarConSaldo = $request->input('pagarConSaldo');

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
            $user->puntos_totales += $puntosGanados; // Cambiado de "puntos" a "puntos_totales"
            $user->save();

            DB::commit();

            // Limpia el carrito de la sesión después de confirmar la compra
            session()->forget('carrito');

            return redirect()->route('index')->with('success', 'Compra realizada con éxito. Has ganado ' . $puntosGanados . ' puntos.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Hubo un problema al procesar la compra.']);
        }
    }
}
