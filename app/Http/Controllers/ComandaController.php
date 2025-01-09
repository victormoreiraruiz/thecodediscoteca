<?php

namespace App\Http\Controllers;

use App\Models\Comanda;
use Illuminate\Http\Request;

class ComandaController extends Controller
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
    $request->validate([
        'mesa_id' => 'required|exists:mesas,id',
        'evento_id' => 'required|exists:eventos,id',
        'productos' => 'required|array', // Lista de productos
        'productos.*.id' => 'exists:productos,id',
        'productos.*.cantidad' => 'integer|min:1'
    ]);

    $comanda = Comanda::create([
        'user_id' => auth()->id(),
        'mesa_id' => $request->mesa_id,
        'evento_id' => $request->evento_id,
        'estado' => 'pendiente',
    ]);

    foreach ($request->productos as $producto) {
        $comanda->productos()->attach($producto['id'], ['cantidad' => $producto['cantidad']]);
    }

    return response()->json(['message' => 'Comanda creada con productos correctamente', 'comanda' => $comanda]);
}


    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Comanda  $comanda
     * @return \Illuminate\Http\Response
     */
    public function show(Comanda $comanda)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Comanda  $comanda
     * @return \Illuminate\Http\Response
     */
    public function edit(Comanda $comanda)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Comanda  $comanda
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Comanda $comanda)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Comanda  $comanda
     * @return \Illuminate\Http\Response
     */
    public function destroy(Comanda $comanda)
    {
        //
    }
}
