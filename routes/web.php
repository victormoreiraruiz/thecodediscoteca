<?php

use App\Http\Controllers\CompraController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SalaController;
use App\Http\Controllers\MesaController;
use App\Http\Controllers\ReservaController;
use App\Models\User;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PasswordController;


Route::get('/', function () {
    return Inertia::render('Index'); // Welcome.jsx debe estar en resources/js/Pages/
});

Route::get('/home', function () {
    return Inertia::render('Home'); // 'Home' es el nombre del componente React
})->name('home');

Route::get('/politica-privacidad', function () {
    return Inertia::render('PoliticaPrivacidad');
})->name('politica.privacidad');

Route::get('/politica-cookies', function () {
    return Inertia::render('PoliticaCookies');
})->name('politica.cookies');

Route::get('/politica-devoluciones', function () {
    return Inertia::render('PoliticaDevoluciones');
})->name('politica.devoluciones');

Route::get('/nosotros', function () {
    return Inertia::render('Nosotros');
})->name('nosotros');

Route::get('/contacto', function () {
    return Inertia::render('Contacto');
})->name('contacto');

Route::get('/eventos/{eventoId}/entradas', [EventoController::class, 'showEntradas'])->name('eventos.entradas');


Route::get('/mi-cuenta', [ProfileController::class, 'miCuenta'])->name('mi-cuenta');

Route::get('/fiesta', function () {return Inertia::render('Fiesta');})->name('fiesta');
Route::get('/galeria', function () {return Inertia::render('Galeria');})->name('galeria');
Route::get('/eventos', function () {return Inertia::render('Eventos');})->name('eventos');

Route::get('/salacelebraciones', function () {return Inertia::render('SalaCelebraciones');})->name('sala-celebraciones');
Route::get('/salaconferencias', function () {return Inertia::render('SalaConferencias');})->name('sala-conferencias');
Route::get('/salaprivada', function () {return Inertia::render('SalaPrivada');})->name('sala-privada');
Route::get('/api/salas/{id}/reservas', [SalaController::class, 'obtenerFechasOcupadas']);
Route::post('/api/salas/{id}/reservar', [SalaController::class, 'crearReserva']);
Route::delete('/api/reservas/{id}', [SalaController::class, 'cancelarReserva']);



Route::get('/api/mesas', [MesaController::class, 'index']);







Route::get('/resumen-compra', [CompraController::class, 'resumen'])->name('compra.resumen');
Route::post('/iniciar-compra', [CompraController::class, 'iniciarCompra'])->name('iniciar.compra');
Route::post('/confirmar-compra', [CompraController::class, 'confirmarCompra'])->name('confirmar.compra');
Route::get('/historial-compras', [ProfileController::class, 'historialDeCompras'])->name('historial.compras')->middleware('auth');

Route::get('/index', function () {
    return Inertia::render('Index');
})->name('index');

Route::get('/confirmar-email/{token}', function ($token) {
    $user = User::where('confirmation_token', $token)->first();

    if (!$user) {
        return redirect('/')->with('error', 'Token de confirmación inválido.');
    }

    $user->confirmation_token = null;
    $user->email_verified_at = now();
    $user->save();

    return redirect('/login')->with('success', 'Correo confirmado. Ahora puedes iniciar sesión.');
})->name('confirmar.email');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::put('/account/change-password', [PasswordController::class, 'update'])->name('password.update');
    Route::post('/reservar-mesa', [ReservaController::class, 'reservarMesa']);

});

require __DIR__.'/auth.php';

