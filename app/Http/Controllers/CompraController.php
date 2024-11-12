<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompraController extends Controller
{
    public function iniciarCompra(Request $request)
    {
        $user = $request->user();

        // Crear la compra principal
        $compra = Compra::create([
            'usuario_id' => $user->id,
            'total' => $request->input('total'),
            'fecha_compra' => now(),
        ]);

        // Procesar el carrito y guardar los elementos en la tabla pivote
        $carrito = $request->input('carrito');
        foreach ($carrito as $item) {
            $compra->entradas()->attach($item['id'], ['cantidad' => $item['cantidad']]);
        }

        // Redirige al resumen de compra con el ID de la nueva compra
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
            'saldo' => $user->saldo, // Asegúrate de incluir el saldo
        ] : null,
    ]);
}

}
