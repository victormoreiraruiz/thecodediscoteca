<?php

namespace App\Http\Controllers;

use App\Models\Mesa;
use App\Models\Compra;
use Illuminate\Http\Request;

class ReservaController extends Controller
{
    public function reservarMesa(Request $request)
    {
        $validatedData = $request->validate([
            'mesa_id' => 'required|exists:mesas,id',
            'cantidad' => 'required|integer|min:1',
        ]);
    
        $usuarioId = auth()->id();
    
        if (!$usuarioId) {
            return response()->json(['error' => 'Usuario no autenticado.'], 401);
        }
    
        $mesa = Mesa::findOrFail($validatedData['mesa_id']);
    
        if ($mesa->reservada) {
            return response()->json(['error' => 'Esta mesa ya está reservada.'], 400);
        }
    
        // Crear la compra
        $compra = Compra::create([
            'usuario_id' => $usuarioId,
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
