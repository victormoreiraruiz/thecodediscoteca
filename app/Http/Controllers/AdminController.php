<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Sala;
use App\Models\Evento;


class AdminController extends Controller
{
    

    public function index()
{
    $usuarios = User::all();
    $salas = Sala::where('tipo_sala', 'conferencias')->get();  // Solo la sala "discoteca"
    
    return Inertia::render('AdminIndex', [
        'usuarios' => $usuarios,
        'salas' => $salas,  // Pasa las salas al componente
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

public function crearEvento(Request $request)
{
    // Verifica los datos que llegan en la solicitud
    \Log::info('Datos recibidos para crear evento:', $request->all());

    // Validación de los datos
    $request->validate([
        'nombre_evento' => 'required|string',
        'descripcion' => 'nullable|string',
        'fecha_evento' => 'required|date',
        'hora_inicio' => 'required|date_format:H:i',
        'hora_final' => 'required|date_format:H:i',
        'sala_id' => 'required|exists:salas,id',
    ]);

    // Verifica si la validación pasó
    \Log::info('Datos validados correctamente');

    // Lógica para crear el evento
    $evento = new Evento();
    $evento->nombre_evento = $request->nombre_evento;
    $evento->descripcion = $request->descripcion;
    $evento->fecha_evento = $request->fecha_evento;
    $evento->hora_inicio = $request->hora_inicio;
    $evento->hora_final = $request->hora_final;
    $evento->sala_id = $request->sala_id;

    // Manejo del archivo de cartel si existe
    if ($request->hasFile('cartel')) {
        $cartelPath = $request->file('cartel')->store('carteles', 'public');
        $evento->cartel = $cartelPath;
    }

    // Guarda el evento
    $evento->save();

    // Verifica si el evento se guardó correctamente
    \Log::info('Evento guardado con éxito:', $evento->toArray());

    return response()->json(['message' => 'Evento creado exitosamente'], 201);
}

}
