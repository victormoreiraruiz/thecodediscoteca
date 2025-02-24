<?php

use App\Http\Controllers\CompraController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SalaController;
use App\Http\Controllers\EntradaController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\NotificacionController;
use App\Http\Controllers\ComandaController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\CamareroController;
use App\Http\Controllers\MensajeController;
use App\Http\Controllers\MesaController;



use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Http\Middleware\PromotorOAdmin;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\PasswordController;




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
Route::get('/api/eventos/{eventoId}/entradas', [EntradaController::class, 'obtenerEntradasPorConcierto']);
Route::post('/api/conciertos/{eventoId}/comprar-entradas', [CompraController::class, 'comprarEntradasConcierto']);
Route::get('/conciertos/{id}', [EventoController::class, 'mostrarConcierto'])->name('conciertos.mostrar');
Route::get('/conciertos', [EventoController::class, 'listarConciertos'])->name('conciertos.index');
Route::get('/convertir-promotor', [ProfileController::class, 'mostrarFormularioPromotor'])->name('convertir-promotor');
Route::post('/convertir-promotor', [ProfileController::class, 'convertToPromotor'])->name('convertir-promotor.post');

Route::get('/test-qr', function () {
    $path = storage_path('app/public/qrcodes/test_qr.png'); // Ruta donde guardar el QR

    // Crea la carpeta si no existe
    if (!file_exists(dirname($path))) {
        mkdir(dirname($path), 0777, true);
    }

    // Generar el QR y guardarlo como PNG
    QrCode::format('png')->size(300)->generate('Prueba de QR', $path);

    return response()->download($path);
});


Route::get('/mi-cuenta', [ProfileController::class, 'miCuenta'])->name('mi-cuenta');
Route::get('/añadir-saldo', function () {
    return Inertia::render('AñadirSaldo'); // Renderiza el componente AñadirSaldo
})->name('añadir-saldo');

// Ruta POST para procesar el saldo
Route::post('/añadir-saldo', [ProfileController::class, 'añadirSaldo']);




Route::get('/fiesta', function () {return Inertia::render('Fiesta');})->name('fiesta');
Route::get('/galeria', function () {return Inertia::render('Galeria');})->name('galeria');
Route::get('/eventos', function () {return Inertia::render('Eventos');})->name('eventos');

Route::get('/salacelebraciones', function () {return Inertia::render('SalaCelebraciones');})->name('sala-celebraciones');
Route::get('/salaconferencias', function () {return Inertia::render('SalaConferencias');})->name('sala-conferencias');
Route::get('/salaprivada', function () {return Inertia::render('SalaPrivada');})->name('sala-privada');
Route::get('/api/salas/{id}/reservas', [SalaController::class, 'obtenerFechasOcupadas']);
Route::delete('/api/reservas/{id}', [SalaController::class, 'cancelarReserva'])->name('reservas.cancelar');
Route::delete('/eventos/{id}/cancelar', [EventoController::class, 'cancelarEvento'])->middleware('auth');
Route::get('/api/reservas/{id}/factura', [SalaController::class, 'descargarFactura'])->name('reservas.factura');
Route::post('/mensajes', [MensajeController::class, 'store'])->name('mensajes.store');
Route::get('/mensajes', [MensajeController::class, 'index'])->name('mensajes.index');
Route::delete('/mensajes/{id}', [MensajeController::class, 'destroy'])->name('mensajes.destroy');


Route::middleware([])->group(function () {
    Route::post('/api/salas/{id}/reservar', [SalaController::class, 'crearReserva']);
});








Route::post('/guardar-carrito', function (Request $request) {
    session(['carrito' => $request->input('carrito')]); // Guarda el carrito en la sesión
    return response()->json(['message' => 'Carrito guardado en la sesión.']);
});

Route::get('/resumen-compra', [CompraController::class, 'resumen'])->name('compra.resumen');
Route::post('/iniciar-compra', [CompraController::class, 'iniciarCompra'])->name('iniciar.compra');
Route::post('/confirmar-compra', [CompraController::class, 'confirmarCompra'])->name('confirmar.compra');
Route::get('/historial-compras', [ProfileController::class, 'historialDeCompras'])->name('historial.compras')->middleware('auth');
Route::get('/mi-cuenta/compras/{compraId}/descargar-pdf', [CompraController::class, 'descargarQrsPdf'])->name('compras.descargar-pdf');
Route::get('/eventos/{eventoId}/entradas', [EventoController::class, 'obtenerEntradas']);
Route::get('/eventos-proximos', [EventoController::class, 'eventosProximos'])->name('eventos.proximos');
Route::get('/eventos/dias-ocupados', [EventoController::class, 'obtenerDiasOcupados'])->name('eventos.diasOcupados');
Route::get('/eventos/proximos', [EventoController::class, 'eventosProximos'])->name('eventos.proximos');
Route::get('/', [EventoController::class, 'eventosProximos'])->name('index');



Route::get('/index', function () {
    return Inertia::render('Index');
})->name('index');



Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
    Route::post('/admin/cambiar-rol', [AdminController::class, 'cambiarRol'])->name('admin.cambiarRol');
    Route::delete('/admin/eliminar-usuario/{id}', [AdminController::class, 'eliminarUsuario'])->name('admin.eliminarUsuario');
    Route::post('/admin/crear-evento', [AdminController::class, 'crearEvento'])->name('admin.crearEvento');
    Route::get('/admin/eventos/crear', [AdminController::class, 'crearEvento'])->name('admin.eventos.crear');
    Route::post('/admin/eventos', [AdminController::class, 'guardarEvento'])->name('admin.eventos.guardar');
    Route::get('/admin/eventos', [AdminController::class, 'mostrarEventos'])->name('admin.mostrarEventos');
    Route::delete('/admin/eventos/{id}', [AdminController::class, 'eliminarEvento'])->name('admin.eliminarEvento');
    Route::post('/admin/actualizarSaldo', [AdminController::class, 'actualizarSaldo'])->name('admin.actualizarSaldo');
    Route::get('/admin/eventos/{evento}/editar', [EventoController::class, 'show'])->name('admin.evento.show')->middleware('can:admin');
    Route::get('/eventos/{id}', [EventoController::class, 'show'])->name('eventos.show');
    Route::put('/admin/eventos/{id}/actualizar-estado', [AdminController::class, 'actualizarEstadoEvento'])->name('admin.actualizarEstadoEvento');
    Route::get('/admin/ingresos', [AdminController::class, 'mostrarIngresos'])->middleware('auth')->name('admin.ingresos');
    Route::post('/admin/productos', [AdminController::class, 'crearProducto'])->name('admin.crearProducto');
    Route::post('/admin/categorias', [AdminController::class, 'crearCategoria'])->name('admin.crearCategoria');
    Route::get('/admin/categorias', [AdminController::class, 'listarCategorias'])->name('admin.listarCategoria');
    Route::get('/admin/productos', [AdminController::class, 'listarProductos'])->name('admin.listarProducto');
    Route::put('/admin/productos/{id}', [AdminController::class, 'actualizarProducto'])->name('admin.actualizaProducto');
    Route::delete('/admin/productos/{id}', [AdminController::class, 'eliminarProducto'])->name('admin.eliminarProducto');
    Route::get('/admin/historial-ingresos', [AdminController::class, 'historialIngresos'])->name('admin.historial.ingresos');
    Route::post('/admin/reponer-stock', [AdminController::class, 'reponerStock'])->name('admin.reponerStock');
    Route::put('admin/categorias/{id}', [CategoriaController::class, 'update'])->name('admin.categorias.update');
    Route::delete('admin/categorias/{id}', [CategoriaController::class, 'destroy'])->name('admin.categorias.destroy');


});

Route::middleware(['auth', 'camarero'])->group(function () {
    Route::get('/camarero', [CamareroController::class, 'index'])->name('camarero.index');
    Route::put('/comandas/{id}/estado', [ComandaController::class, 'actualizarEstadoComanda']);
    Route::get('/comandas/historial', [ComandaController::class, 'listarComandasEntregadas']);


});

Route::middleware(['auth'])->group(function () {
    Route::get('/notificaciones', [NotificacionController::class, 'index']);
    Route::put('/notificaciones/marcar-todas-leidas', [NotificacionController::class, 'marcarTodasLeidas'])->middleware('auth');
    Route::post('/comandas', [ComandaController::class, 'crearComanda']); // Crear comanda
    Route::get('/comandas/activas', [ComandaController::class, 'listarComandasActivas']); // Ver comandas activas
    Route::put('/comandas/{id}/estado', [ComandaController::class, 'actualizarEstadoComanda']); // Actualizar estado
    Route::delete('/comandas/{id}', [ComandaController::class, 'eliminarComanda']); // Eliminar comanda
    Route::get('/productos', [ProductoController::class, 'listarProductos']);
    Route::get('/categorias', [CategoriaController::class, 'listarCategorias']);
    Route::get('/verificar-rol-usuario', [ProfileController::class, 'verificarRolUsuario'])
    ->name('usuario.verificarRol')
    ->middleware('auth');
    

});


Route::get('/api/usuario_actual', [ProfileController::class, 'UserActual']);



Route::get('/mi-cuenta/ingresos', [ProfileController::class, 'obtenerIngresos'])->name('mi-cuenta.ingresos');
Route::get('/mi-cuenta/eventos/{evento}', [EventoController::class, 'mostrarEvento'])->name('evento.mostrar');
Route::post('/eventos/{id}/editar', [EventoController::class, 'update'])->name('eventos.update');
Route::get('/eventos/{id}/ventas', [EventoController::class, 'obtenerDatosVentas']);
Route::get('eventos/{id}/estadisticas-ventas', [EventoController::class, 'obtenerEstadisticasVentas']);
Route::post('/logout', [ProfileController::class, 'logout'])->name('logout');
Route::get('/mesas', [MesaController::class, 'obtenerMesasPorEvento'])->name('mesas.porEvento');
Route::get('/mi-cuenta/mis-eventos', [ProfileController::class, 'misEventos'])->name('miCuenta.misEventos');




Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::put('/account/change-password', [PasswordController::class, 'update'])->name('password.update');
    Route::get('/mi-cuenta/ingresos', [ProfileController::class, 'obtenerIngresos'])->middleware('auth');

});



require __DIR__.'/auth.php';

