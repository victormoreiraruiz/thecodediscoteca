<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\User;

class AdminController extends Controller
{
    

    public function index()
    {
        $usuarios = User::all(); // Obtiene todos los usuarios
        return Inertia::render('AdminIndex', [
            'usuarios' => $usuarios
        ]);
    }
    
    public function cambiarRol(Request $request)
{
    $user = User::findOrFail($request->id);
    $user->rol = $request->rol;
    $user->save();

    return response()->json(['message' => 'Rol actualizado correctamente.']);
}

public function eliminarUsuario($id)
{
    $usuario = User::findOrFail($id);
    
    $usuario->delete();

    return response()->json(['message' => 'Usuario eliminado con éxito.']);
}

}
