<?php

namespace App\Http\Controllers;

use App\Models\Notificacion;
use Illuminate\Http\Request;

class NotificacionController extends Controller
{
    // Obtener todas las notificaciones del usuario autenticado
    public function index()
{
    \Log::info('Usuario autenticado: ' . auth()->id());
    
    $notificaciones = Notificacion::where('usuario_id', auth()->id())
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json($notificaciones);
}

    

public function marcarTodasLeidas()
{
    Notificacion::where('usuario_id', auth()->id())->update(['leido' => true]);

    return response()->json(['message' => 'Todas las notificaciones han sido marcadas como leídas.']);
}


    // Crear una nueva notificación
    public function crearNotificacion(Request $request)
    {
        $request->validate([
            'usuario_id' => 'nullable|exists:usuarios,id', // Asegurarse de que 'usuarios' es la tabla correcta
            'mensaje' => 'required|string',
        ]);

        $notificacion = Notificacion::create($request->all());

        return response()->json($notificacion, 201);
    }

    // Obtener todas las notificaciones de un usuario autenticado
    public function obtenerNotificaciones(Request $request)
    {
        $usuario = auth()->user(); // Usuario autenticado

        // Usar la relación 'notificaciones' configurada en el modelo Usuario
        $notificaciones = $usuario->notificaciones()->orderBy('created_at', 'desc')->get();

        return response()->json($notificaciones);
    }
}
