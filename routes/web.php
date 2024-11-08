<?php

use App\Http\Controllers\CompraController;
use App\Http\Controllers\ProfileController;
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

Route::get('/mi-cuenta', [ProfileController::class, 'miCuenta'])->name('mi-cuenta');

Route::get('/fiesta', function () {
    return Inertia::render('Fiesta');
})->name('fiesta');

Route::get('/resumen-compra', [CompraController::class, 'resumen'])->name('compra.resumen');

Route::get('/index', function () {
    return Inertia::render('Index');
})->name('index');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::put('/account/change-password', [PasswordController::class, 'update'])->name('password.update');

});

require __DIR__.'/auth.php';
