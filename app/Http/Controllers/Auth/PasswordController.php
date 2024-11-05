<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Auth;

class PasswordController extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'current_password' => ['required'],
            'password' => ['required', 'confirmed', 'min:8'], // Asegura que la nueva contraseña tenga confirmación
        ]);

        $user = Auth::user();

        // Verifica que la contraseña actual sea correcta
        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'La contraseña actual no es correcta.']);
        }

        // Cambia la contraseña y la guarda en la base de datos
        $user->password = Hash::make($request->password);
        $user->save(); // Asegura que la contraseña se guarde

        return back()->with('success', 'Contraseña actualizada correctamente.');
    }
}