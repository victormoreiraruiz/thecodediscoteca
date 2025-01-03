<?php

namespace App\Http\Controllers;

use App\Models\Notificacion;
use Illuminate\Http\Request;

class NotificacionController extends Controller
{
    
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


 
    public function crearNotificacion(Request $request)
    {
        $request->validate([
            'usuario_id' => 'nullable|exists:usuarios,id', 
            'mensaje' => 'required|string',
        ]);

        $notificacion = Notificacion::create($request->all());

        return response()->json($notificacion, 201);
    }

  
    public function obtenerNotificaciones(Request $request)
    {
        $usuario = auth()->user(); 

       
        $notificaciones = $usuario->notificaciones()->orderBy('created_at', 'desc')->get();

        return response()->json($notificaciones);
    }
}
