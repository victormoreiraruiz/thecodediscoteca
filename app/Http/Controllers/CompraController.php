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
    $user = $request->user();
    $carrito = session('carrito', []);
    $total = collect($carrito)->reduce(fn($sum, $item) => $sum + ($item['precio'] * $item['cantidad']), 0);
    $pagarConSaldo = $request->input('pagarConSaldo');

    \Log::info('Confirmando compra para usuario:', ['id' => $user->id, 'total' => $total]);

    if ($pagarConSaldo && $user->saldo < $total) {
        return redirect()->back()->withErrors(['saldo' => 'Saldo insuficiente para realizar la compra.']);
    }

    DB::beginTransaction();
    try {
        foreach ($carrito as $item) {
            $evento = \App\Models\Evento::find($item['evento_id']);
            $sala = \App\Models\Sala::find($evento->sala_id);
            
            if (!$sala) {
                throw new \Exception("No se encontró la sala asociada al evento.");
            }

            // Obtener el total de entradas vendidas
            $entradasVendidas = DB::table('compra_entradas')
                ->whereIn('entrada_id', function ($query) use ($evento) {
                    $query->select('id')->from('entradas')->where('evento_id', $evento->id);
                })
                ->sum('cantidad');

            // Validar si hay espacio suficiente
            if ($entradasVendidas + $item['cantidad'] > $sala->capacidad) {
                return redirect()->back()->withErrors(['error' => 'No quedan suficientes entradas disponibles para este evento.']);
            }
        }

        // Crear la compra
        $compra = Compra::create([
            'usuario_id' => $user->id,
            'total' => $total,
            'fecha_compra' => now(),
        ]);

        foreach ($carrito as $item) {
            $compra->entradas()->attach($item['id'], ['cantidad' => $item['cantidad']]);
            for ($i = 1; $i <= $item['cantidad']; $i++) {
                $this->generarQr($compra, $item['id'], $i);
            }
        }

        if ($pagarConSaldo) {
            $user->saldo -= $total;
        }

        $puntosGanados = round($total * 0.10);
        $user->puntos_totales += intval($puntosGanados);
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
            $qrData = "Compra ID: {$compra->id}\nEntrada ID: {$entradaId}\nNúmero: {$indice}\nUsuario ID: {$compra->usuario_id}\nTotal Compra: {$compra->total}";
            $qrPath = "qrcodes/compra_{$compra->id}_entrada_{$entradaId}_n{$indice}.png";
    
          
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
    $compra = Compra::with(['entradas.evento'])->findOrFail($compraId);
    $qrPaths = [];

    foreach ($compra->entradas as $entrada) {
        for ($i = 1; $i <= $entrada->pivot->cantidad; $i++) {
            $qrPath = storage_path("app/public/qrcodes/compra_{$compra->id}_entrada_{$entrada->id}_n{$i}.png");

            try {
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

    $pdf = new \Mpdf\Mpdf();
    $html = view('qrs', compact('compra', 'qrPaths'))->render();
    $pdf->WriteHTML($html);

    return $pdf->Output("Compra_{$compra->id}_QRs.pdf", 'D');
}

}

