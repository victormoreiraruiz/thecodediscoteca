<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('Welcome'); // Welcome.jsx debe estar en resources/js/Pages/
});

Route::get('/home', function () {
    return Inertia::render('Home'); // 'Home' es el nombre del componente React
})->name('home');

Route::get('/politica-privacidad', function () {
    return Inertia::render('PoliticaPrivacidad');
})->name('politica.privacidad');



Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
