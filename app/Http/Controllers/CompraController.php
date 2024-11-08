<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompraController extends Controller
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
     * @param  \App\Models\Compra  $compra
     * @return \Illuminate\Http\Response
     */
    public function show(Compra $compra)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Compra  $compra
     * @return \Illuminate\Http\Response
     */
    public function edit(Compra $compra)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Compra  $compra
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Compra $compra)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Compra  $compra
     * @return \Illuminate\Http\Response
     */
    public function destroy(Compra $compra)
    {
        //
    }

    public function resumen(Request $request)
    {
        $user = $request->user();
        $carrito = $request->input('carrito', []); // Recibir carrito desde el frontend

        // Asegúrate de que cada elemento del carrito tiene los índices necesarios
        $carrito = collect($carrito)->map(function ($item) {
            return [
                'nombre' => $item['nombre'] ?? 'Producto sin nombre',
                'precio' => $item['precio'] ?? 0,
                'cantidad' => $item['cantidad'] ?? 1,
            ];
        })->toArray();

        // Calcular el total del carrito
        $total = collect($carrito)->reduce(function ($sum, $item) {
            return $sum + ($item['precio'] * $item['cantidad']);
        }, 0);

        return Inertia::render('ResumenCompra', [
            'carrito' => $carrito,
            'total' => $total,
            'user' => $user ? ['nombre' => $user->name, 'correo' => $user->email] : null,
        ]);
    }
}
