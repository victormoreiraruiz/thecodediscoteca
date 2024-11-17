<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Mesa;


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

    public function confirmarCompra(Request $request)
    {
        $user = $request->user();
        $carrito = session('carrito', []); // Usa el carrito de la sesión
        $total = collect($carrito)->reduce(function ($sum, $item) {
            return $sum + ($item['precio'] * $item['cantidad']);
        }, 0);
        $pagarConSaldo = $request->input('pagarConSaldo');
    
        \Log::info('Confirmando compra para usuario:', ['id' => $user->id, 'total' => $total]);
    
        if ($pagarConSaldo && $user->saldo < $total) {
            return redirect()->back()->withErrors(['saldo' => 'Saldo insuficiente para realizar la compra.']);
        }
    
        DB::beginTransaction();
        try {
            $compra = Compra::create([
                'usuario_id' => $user->id,
                'total' => $total,
                'fecha_compra' => now(),
            ]);
    
            foreach ($carrito as $item) {
                if ($item['tipo'] === 'entrada' && isset($item['id']) && isset($item['cantidad'])) {
                    $compra->entradas()->attach($item['id'], ['cantidad' => $item['cantidad']]);
                } elseif ($item['tipo'] === 'mesa' && isset($item['id'])) {
                    $compra->mesas()->attach($item['id'], ['cantidad' => 1]); // Usualmente una mesa por reserva
                    Mesa::where('id', $item['id'])->update(['reservada' => true]); // Marca la mesa como reservada
                }
            }
    
            if ($pagarConSaldo) {
                $user->saldo -= $total;
            }
    
            $puntosGanados = $total * 0.10;
            $user->puntos_totales += $puntosGanados;
            $user->save();
    
            DB::commit();
    
            session()->forget('carrito');
    
            return redirect()->route('index')->with('success', 'Compra realizada con éxito. Has ganado ' . $puntosGanados . ' puntos.');
    
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error al confirmar compra:', ['error' => $e->getMessage()]);
            return redirect()->back()->withErrors(['error' => 'Hubo un problema al procesar la compra.']);
        }
    }

    public function reservarMesa(Request $request)
{
    $validatedData = $request->validate([
        'mesa_id' => 'required|exists:mesas,id',
        'cantidad' => 'required|integer|min:1',
    ]);

    $mesa = Mesa::findOrFail($validatedData['mesa_id']);

    if ($mesa->reservada) {
        return response()->json(['error' => 'Esta mesa ya está reservada.'], 400);
    }

    // Crear la compra
    $compra = Compra::create([
        'usuario_id' => auth()->id(),
        'total' => $mesa->precio * $validatedData['cantidad'],
        'fecha_compra' => now(),
    ]);

    // Asociar la mesa con la compra
    $compra->mesas()->attach($mesa->id, ['cantidad' => $validatedData['cantidad']]);

    // Marcar la mesa como reservada
    $mesa->update(['reservada' => true]);

    return response()->json(['message' => 'Mesa reservada exitosamente.']);
}
    
}
