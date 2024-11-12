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

        // Crear la compra con un total temporal, antes de confirmar la compra
        $compra = Compra::create([
            'usuario_id' => $user->id,
            'total' => 0, // Total temporal que se actualizará más adelante
            'fecha_compra' => now(),
        ]);

        // Almacenar el carrito en la sesión
        $carrito = $request->input('carrito');
        session(['carrito' => $carrito]);

        // Redirige al resumen de compra con el ID de la nueva compra
        return redirect()->route('compra.resumen', ['compraId' => $compra->id]);
    }



    public function resumen(Request $request, $compraId)
{
    $user = $request->user();

    $compra = Compra::with(['entradas' => function ($query) {
        $query->select('entradas.id', 'entradas.tipo', 'entradas.precio');
    }])->findOrFail($compraId);

    $carrito = session('carrito', []); // Obtener el carrito de la sesión

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
        'compraId' => $compra->id, // Enviar compraId a la vista
    ]);
}




public function confirmarCompra(Request $request)
{
    $user = $request->user();
    $compraId = $request->input('compraId');
    $carrito = $request->input('carrito');
    $total = $request->input('total');
    $pagarConSaldo = $request->input('pagarConSaldo');

    if ($pagarConSaldo && $user->saldo < $total) {
        return redirect()->back()->withErrors(['saldo' => 'Saldo insuficiente para realizar la compra.']);
    }

    DB::beginTransaction();
    try {
        $compra = Compra::findOrFail($compraId);
        $compra->update(['total' => $total]); // Actualiza el total con el valor real

        foreach ($carrito as $item) {
            if (isset($item['id']) && isset($item['cantidad'])) {
                $compra->entradas()->attach($item['id'], ['cantidad' => $item['cantidad']]);
            }
        }

        if ($pagarConSaldo) {
            $user->saldo -= $total;
            $user->save();
        }

        DB::commit();

        return redirect()->route('index')->with('success', 'Compra realizada con éxito.');

    } catch (\Exception $e) {
        DB::rollBack();
        return redirect()->back()->withErrors(['error' => 'Hubo un problema al procesar la compra.']);
    }
}


}
