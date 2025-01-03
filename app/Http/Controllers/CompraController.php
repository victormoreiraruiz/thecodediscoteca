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
    $total = collect($carrito)->reduce(function ($sum, $item) {
        return $sum + ($item['precio'] * $item['cantidad']);
    }, 0);
    $pagarConSaldo = $request->input('pagarConSaldo');

    \Log::info('Confirmando compra para usuario:', ['id' => $user->id, 'total' => $total]);

    if ($pagarConSaldo && $user->saldo < $total) {
        return redirect()->back()->withErrors(['saldo' => 'Saldo insuficiente para realizar la compra.']);
    }

    DB::beginTransaction();
    try {
        $compra = Compra::create([
            'usuario_id' => $user->id,
            'total' => $total,
            'fecha_compra' => now(),
        ]);

        // asocia entradas y genera QRs
        foreach ($carrito as $item) {
            if (isset($item['id']) && isset($item['cantidad'])) {
                $compra->entradas()->attach($item['id'], ['cantidad' => $item['cantidad']]);

                for ($i = 1; $i <= $item['cantidad']; $i++) {
                    $this->generarQr($compra, $item['id'], $i);
                }
            }
        }

        if ($pagarConSaldo) {
            $user->saldo -= $total;
        }

        // incrementar puntos
        $puntosGanados = round($total * 0.10); // redondeo a numero entero pq puse en a base de datos q el numero era integr xd
        $user->puntos_totales += intval($puntosGanados); // aseguramos que sea un entero


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
            // verifica si el usuario tiene saldo suficiente
            if ($user->saldo < $total) {
                return response()->json(['error' => 'Saldo insuficiente para realizar la compra.'], 403);
            }
    
            // crea el registro de la compra
            $compra = Compra::create([
                'usuario_id' => $user->id,
                'total' => $total,
                'fecha_compra' => now(),
            ]);
    
            foreach ($carrito as $item) {
                // procesar solo las entradas de concierto
                if ($item['tipo'] === 'concierto') {
                    $entrada = \App\Models\Entrada::where('evento_id', $eventoId)
                        ->where('id', $item['id'])
                        ->first();
    
                    if (!$entrada) {
                        throw new \Exception("La entrada no es válida para el concierto seleccionado.");
                    }
    
                    // asocia las entradas compradas a la compra
                    $compra->entradas()->attach($entrada->id, ['cantidad' => $item['cantidad']]);
    
                    // generar un QR por cada unidad de la entrada comprada
                    for ($i = 1; $i <= $item['cantidad']; $i++) {
                        $this->generarQr($compra, $entrada->id, $i);
                    }
                }
            }
    
            // resta el saldo del usuario comprador
            $user->saldo -= $total;
            $user->save();
    
            // incrementa los ingresos del usuario creador del evento
            $evento = \App\Models\Evento::find($eventoId);
    
            if ($evento) {
                $creador = $evento->promotor; 
                $ingresoTotal = collect($carrito)->reduce(function ($sum, $item) {
                    return $sum + ($item['precio'] * $item['cantidad']);
                }, 0);
                $creador->ingresos += $ingresoTotal;
                $creador->save();
            }
    
            DB::commit();
    
            return response()->json(['message' => 'Compra realizada con éxito.', 'compra_id' => $compra->id], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error al comprar entradas de concierto:', ['error' => $e->getMessage()]);
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


