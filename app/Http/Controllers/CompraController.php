<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use SimpleSoftwareIO\QrCode\Facades\QrCode; 
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use Illuminate\Support\Facades\Cookie;
use mPDF;


class CompraController extends Controller
{

    public function iniciarCompra(Request $request)
    {
        $carrito = $request->input('carrito');
        session(['carrito' => $carrito]); // almacena el carrito en la sesión

        // redirige al resumen de compra sin crear una compra en la base de datos
        return redirect()->route('compra.resumen');
    }

  
  public function resumen(Request $request)
{
    $user = $request->user();

    \Log::info('Datos del usuario:', [
        'nombre' => $user->name ?? null,
        'correo' => $user->email ?? null,
        'saldo' => $user->saldo ?? null,
    ]);

    $carrito = session('carrito', []); // obtiene el carrito desde la sesión
        
    // calcula el total sumando precio por cantidad de cada producto
    $total = collect($carrito)->reduce(function ($sum, $item) {
        return $sum + ($item['precio'] * $item['cantidad']);
    }, 0);


    return Inertia::render('ResumenCompra', [
        'carrito' => $carrito,
        'total' => $total,
        'user' => $user ? [
            'nombre' => $user->name,
            'correo' => $user->email,
            'saldo' => $user->saldo,
        ] : null,
    ]);
}

    
public function confirmarCompra(Request $request)
{

    if (!$request->user()) {
        return redirect()->route('login')->with('error', 'Debes iniciar sesión para confirmar tu compra.');
    }


    $user = $request->user();
    $carrito = session('carrito', []); //obtiene el carrito de la sesion o lo crea
    $total = collect($carrito)->reduce(fn($sum, $item) => $sum + ($item['precio'] * $item['cantidad']), 0);
    $pagarConSaldo = $request->input('pagarConSaldo'); // obtiene el pagar con saldo si ha sido marcado

    \Log::info('Confirmando compra para usuario:', ['id' => $user->id, 'total' => $total]);

    if ($pagarConSaldo && $user->saldo < $total) {
        return redirect()->back()->withErrors(['saldo' => 'Saldo insuficiente para realizar la compra.']);
    }

    DB::beginTransaction();
    try {
        // Crear la compra
        $compra = Compra::create([
            'usuario_id' => $user->id,
            'total' => $total,
            'fecha_compra' => now(),
        ]);

        foreach ($carrito as $item) {
            // Verificar que cantidad y precio existan y sean válidos
            if (!isset($item['cantidad']) || !isset($item['precio']) || $item['cantidad'] <= 0 || $item['precio'] <= 0) {
                throw new \Exception("Cantidad o precio inválido para la entrada ID: " . ($item['id'] ?? 'Desconocido'));
            }

            // Obtener la entrada y el evento asociado
            $entrada = \App\Models\Entrada::find($item['id']);
            if (!$entrada) {
                throw new \Exception("No se encontró la entrada con ID: " . $item['id']);
            }

            $evento = \App\Models\Evento::find($entrada->evento_id);
            if (!$evento) {
                throw new \Exception("No se encontró el evento asociado a la entrada.");
            }

            $sala = \App\Models\Sala::find($evento->sala_id);
            if (!$sala) {
                throw new \Exception("No se encontró la sala asociada al evento.");
            }

            // Identificar al creador del evento mediante ReservaDiscoteca
            $reserva = \App\Models\ReservaDiscoteca::where('sala_id', $entrada->evento->sala_id)
                ->where('fecha_reserva', $entrada->evento->fecha_evento)
                ->first();

            if ($reserva) {
                $creador = $reserva->usuario;

                if (!$creador) {
                    throw new \Exception("No se encontró el usuario creador de la reserva.");
                }

                // Calcular el ingreso total basado en la reserva
                $ingresoTotal = (int) collect($carrito)->reduce(function ($sum, $item) use ($reserva) {
                    return $sum + ($item['cantidad'] * $reserva->precio_entrada);
                }, 0);

                // Asignar el dinero al creador
                $creador->ingresos += $ingresoTotal;
                $creador->save();
            }

            $entradasVendidas = \DB::table('compra_entradas')
                ->join('entradas', 'compra_entradas.entrada_id', '=', 'entradas.id')
                ->join('eventos', 'entradas.evento_id', '=', 'eventos.id')
                ->where('eventos.id', $evento->id)
                ->sum('compra_entradas.cantidad');

            $capacidadRestante = $sala->capacidad - $entradasVendidas;

        // Validar si la cantidad que se intenta comprar supera la capacidad restante
        if ($item['cantidad'] > $capacidadRestante) {
            throw new \Exception("No hay suficientes entradas disponibles para el evento: " . $evento->nombre_evento);
        }

            // Registrar la compra de entradas
            $compra->entradas()->attach($entrada->id, ['cantidad' => $item['cantidad']]);

            // Generar QR por cada entrada comprada
            for ($i = 1; $i <= $item['cantidad']; $i++) {
                $this->generarQr($compra, $entrada->id, $i);
            }

            // **Registrar ingresos en historial si la sala es "discoteca"**
            if ($sala->tipo_sala === 'discoteca') {
                $admin = \App\Models\User::where('rol', 'admin')->first();

                if ($admin) {
                    // Calcular el ingreso total
                    $ingresoAdmin = (float) ($item['precio'] * $item['cantidad']);

                    // Validar que el ingreso sea mayor a 0
                    if ($ingresoAdmin > 0) {
                        // Registrar en historial de ingresos
                        \App\Models\HistorialIngresos::create([
                            'cantidad' => $ingresoAdmin,
                            'motivo' => "Venta de entradas en Discoteca - Evento ID: {$evento->id}",
                        ]);

                        // Sumar el ingreso al saldo del admin
                        $admin->ingresos += $ingresoAdmin;
                        $admin->save();
                    } else {
                        \Log::warning("Intento de registrar ingreso inválido.", [
                            'cantidad' => $ingresoAdmin,
                        ]);
                    }
                }
            }
        }

        // Restar saldo del comprador si paga con saldo
        if ($pagarConSaldo) {
            $user->saldo -= $total;
        }

        // Otorgar puntos al usuario por la compra
        $puntosGanados = round($total * 0.10);
        $user->puntos_totales += intval($puntosGanados); // esto es pq puse que los puntos sea integer y tiene q redondear
        $user->actualizarMembresia();
        $user->save();

        DB::commit();
        session()->forget('carrito');
        Cookie::queue(Cookie::forget('carrito'));

        return redirect()->route('index')->with('success', 'Compra realizada con éxito. Has ganado ' . $puntosGanados . ' puntos.');
    } catch (\Exception $e) {
        DB::rollBack();
        \Log::error('Error al confirmar compra:', ['error' => $e->getMessage()]);
        return redirect()->back()->withErrors(['error' => 'Hubo un problema al procesar la compra.']);
    }
}



    
    private function generarQr($compra, $entradaId, $indice)
    {
        try {
             // Prepara los datos que se incluirán en el QR
            $qrData = "Compra ID: {$compra->id}\nEntrada ID: {$entradaId}\nNúmero: {$indice}\nUsuario ID: {$compra->usuario_id}\nTotal Compra: {$compra->total}";
             // Define la ruta donde se guardará el archivo del QR
            $qrPath = "qrcodes/compra_{$compra->id}_entrada_{$entradaId}_n{$indice}.png";
    
           // Verifica si el directorio 'public/qrcodes' existe; si no, lo crea
            if (!Storage::exists('public/qrcodes')) {
                Storage::makeDirectory('public/qrcodes');
            }
    
            // genera y guarda el QR
            QrCode::format('png')->size(300)->generate($qrData, storage_path("app/public/{$qrPath}"));
    
            \Log::info("QR generado y guardado en: {$qrPath}");
        } catch (\Exception $e) {
            \Log::error('Error al generar el QR:', ['error' => $e->getMessage()]);
        }
    }
    
    public function comprarEntradasConcierto(Request $request, $eventoId)
{
    $user = $request->user();
    $carrito = $request->input('carrito', []);
    $total = collect($carrito)->reduce(function ($sum, $item) {
        return $sum + ($item['precio'] * $item['cantidad']);
    }, 0);

    DB::beginTransaction();
    try {
        // Verifica si el usuario tiene saldo suficiente
        if ($user->saldo < $total) {
            return response()->json(['error' => 'Saldo insuficiente para realizar la compra.'], 403);
        }

        // Crea el registro de la compra
        $compra = Compra::create([
            'usuario_id' => $user->id,
            'total' => $total,
            'fecha_compra' => now(),
        ]);

        foreach ($carrito as $item) {
            // Obtener la entrada y el evento asociado
            $entrada = \App\Models\Entrada::where('evento_id', $eventoId)
                ->where('id', $item['id'])
                ->first();

            if (!$entrada) {
                throw new \Exception("La entrada no es válida para el evento seleccionado.");
            }

            // Asocia las entradas compradas a la compra
            $compra->entradas()->attach($entrada->id, ['cantidad' => $item['cantidad']]);

            // Generar un QR por cada unidad de la entrada comprada
            for ($i = 1; $i <= $item['cantidad']; $i++) {
                $this->generarQr($compra, $entrada->id, $i);
            }
        }

        // Resta el saldo del usuario comprador
        $user->saldo -= $total;
        $user->save();

        // Obtener el evento y la sala asociada
        $evento = \App\Models\Evento::find($eventoId);

        if ($evento) {
            $sala = \App\Models\Sala::find($evento->sala_id);
            $creador = $evento->promotor; // Usuario que creó el evento
            $admin = \App\Models\User::where('rol', 'admin')->first(); // Usuario administrador

            // Calcular el total ingresado por la compra de entradas
            $ingresoTotal = collect($carrito)->reduce(function ($sum, $item) {
                return $sum + ($item['precio'] * $item['cantidad']);
            }, 0);

            // Si la sala es de tipo "discoteca", el dinero va al admin
            if ($sala && $sala->tipo_sala === 'discoteca') {
                if ($admin) {
                    $admin->ingresos += $ingresoTotal;
                    $admin->save();
                }
            } else {
                // Si el evento no es en "discoteca", el dinero va al creador del evento
                $creador->ingresos += $ingresoTotal;
                $creador->save();
            }
        }

        DB::commit();

        return response()->json(['message' => 'Compra realizada con éxito.', 'compra_id' => $compra->id], 201);
    } catch (\Exception $e) {
        DB::rollBack();
        \Log::error('Error al comprar entradas:', ['error' => $e->getMessage()]);
        return response()->json(['error' => 'No se pudo completar la compra.'], 500);
    }
}

    
    
    public function descargarQrsPdf($compraId)
{
    // Obtiene la compra con sus entradas y eventos relacionados, o lanza un error si no se encuentra
    $compra = Compra::with(['entradas.evento'])->findOrFail($compraId);
    $qrPaths = []; // Inicializa un array vacío para almacenar las rutas de los códigos QR generados


    foreach ($compra->entradas as $entrada)  { // Recorre todas las entradas de la compra
        for ($i = 1; $i <= $entrada->pivot->cantidad; $i++) {  // Genera un QR por cada cantidad de entrada comprada
            $qrPath = storage_path("app/public/qrcodes/compra_{$compra->id}_entrada_{$entrada->id}_n{$i}.png");

            try { // Genera el QR y lo guarda en la ruta especificada
                \QrCode::format('png')->size(150)->generate("compra_{$compra->id}_entrada_{$entrada->id}_n{$i}", $qrPath);

                if (is_file($qrPath)) {
                    $qrPaths[] = $qrPath;
                } else {
                    \Log::warning("Archivo no válido: {$qrPath}");
                }
            } catch (\Exception $e) {
                \Log::error("Error al generar QR: {$e->getMessage()}");
            }
        }
    }

    // filtrar rutas inválidas
    $qrPaths = array_filter($qrPaths, fn($path) => is_file($path));
    $qrPaths = array_unique($qrPaths);

    \Log::info("Rutas finales de QR:", $qrPaths);

    // general el odf
    $pdf = new \Mpdf\Mpdf();
    // Genera el contenido HTML a partir de una vista (qrs.blade.php) con las rutas de los QRs
    $html = view('qrs', compact('compra', 'qrPaths'))->render(); 
    $pdf->WriteHTML($html);

    return $pdf->Output("Compra_{$compra->id}_QRs.pdf", 'D');// devuelve el pdf para descargar con el nombre del id de compra
}

}

