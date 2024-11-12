<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class CompraController extends Controller
{
    public function iniciarCompra(Request $request)
    {
        $user = $request->user();

        $compra = Compra::create([
            'usuario_id' => $user->id,
            'total' => $request->input('total'),
            'fecha_compra' => now(),
        ]);

        $carrito = $request->input('carrito');
        foreach ($carrito as $item) {
            $compra->entradas()->attach($item['id'], ['cantidad' => $item['cantidad']]);
        }

        return redirect()->route('compra.resumen', ['compraId' => $compra->id]);
    }

    public function resumen(Request $request, $compraId)
    {
        $user = $request->user();

        $compra = Compra::with(['entradas' => function ($query) {
            $query->select('entradas.id', 'entradas.tipo', 'entradas.precio');
        }])->findOrFail($compraId);

        $carrito = $compra->entradas->map(function ($entrada) {
            return [
                'tipo' => $entrada->tipo,
                'precio' => $entrada->precio,
                'cantidad' => $entrada->pivot->cantidad,
            ];
        })->toArray();

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
            ] : null,
        ]);
    }

    public function confirmarCompra(Request $request)
    {
        $user = $request->user();
        $carrito = $request->input('carrito');
        $total = $request->input('total');
        $pagarConSaldo = $request->input('pagarConSaldo');

        // Verificar si el usuario tiene saldo suficiente si elige pagar con saldo
        if ($pagarConSaldo && $user->saldo < $total) {
            return redirect()->back()->withErrors(['saldo' => 'Saldo insuficiente para realizar la compra.']);
        }

        DB::beginTransaction();
        try {
            // Crear la compra en la base de datos
            $compra = Compra::create([
                'usuario_id' => $user->id,
                'total' => $total,
                'fecha_compra' => now(),
            ]);

            // Asociar cada entrada del carrito a la compra
            foreach ($carrito as $item) {
                // Verificar que el id y cantidad estén presentes en cada item
                if (isset($item['id']) && isset($item['cantidad'])) {
                    $compra->entradas()->attach($item['id'], ['cantidad' => $item['cantidad']]);
                }
            }

            // Si el usuario elige pagar con saldo, restarlo del saldo disponible
            if ($pagarConSaldo) {
                $user->saldo -= $total;
                $user->save();
            }

            DB::commit();

            // Redirigir con mensaje de éxito
            return redirect()->route('historial.compras')->with('success', 'Compra realizada con éxito.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Hubo un problema al procesar la compra.']);
        }
    }

}
