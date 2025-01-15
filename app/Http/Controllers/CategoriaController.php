<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class CategoriaController extends Controller
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
     * @param  \App\Models\Categoria  $categoria
     * @return \Illuminate\Http\Response
     */
    public function show(Categoria $categoria)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Categoria  $categoria
     * @return \Illuminate\Http\Response
     */
    public function edit(Categoria $categoria)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Categoria  $categoria
     * @return \Illuminate\Http\Response
     */


    public function listarCategorias()
    {
        return response()->json(Categoria::all());
    }

    public function update(Request $request, $id)
    {
        // Validar que el nombre no esté vacío
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255|unique:categorias,nombre,' . $id,
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'El nombre de la categoría es obligatorio y único.'], 422);
        }

        // Buscar categoría
        $categoria = Categoria::find($id);
        if (!$categoria) {
            return response()->json(['error' => 'Categoría no encontrada.'], 404);
        }

        // Actualizar el nombre
        $categoria->nombre = $request->nombre;
        $categoria->save();

        return response()->json(['message' => 'Categoría actualizada con éxito.']);
    }

    public function destroy($id)
{
    $categoria = Categoria::find($id);

    if (!$categoria) {
        return response()->json(['error' => 'Categoría no encontrada.'], 404);
    }

    // Verificar si la categoría tiene productos asociados
    if ($categoria->productos()->count() > 0) {
        return response()->json([
            'error' => 'No se puede eliminar la categoría porque tiene productos asociados.'
        ], 400);
    }

    // Eliminar la categoría
    $categoria->delete();

    return response()->json(['message' => 'Categoría eliminada con éxito.']);
}
}
