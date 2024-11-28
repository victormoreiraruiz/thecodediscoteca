<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use SimpleSoftwareIO\QrCode\Facades\QrCode; // Importar librería para QR
use Illuminate\Support\Facades\Storage;


class CompraController extends Controller
{
    // Solo almacena el carrito en la sesión y redirige al resumen
    public function iniciarCompra(Request $request)
    {
        $carrito = $request->input('carrito');
        session(['carrito' => $carrito]); // Almacena el carrito en la sesión

        // Redirige al resumen de compra sin crear una compra en la base de datos
        return redirect()->route('compra.resumen');
    }

    // Muestra la página de resumen de compra
    public function resumen(Request $request)
    {
        $user = $request->user();
    
        $carrito = session('carrito', []); // Obtiene el carrito desde la sesión
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
                'puntos_totales' => $user->puntos_totales,
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
            // Crea la compra real solo en este punto
            $compra = Compra::create([
                'usuario_id' => $user->id,
                'total' => $total,
                'fecha_compra' => now(),
            ]);
    
            // Generar un QR por cada entrada comprada
            foreach ($carrito as $item) {
                if (isset($item['id']) && isset($item['cantidad'])) {
                    // Asocia la entrada a la compra
                    $compra->entradas()->attach($item['id'], ['cantidad' => $item['cantidad']]);
    
                    // Generar un QR por cada unidad de la entrada comprada
                    for ($i = 1; $i <= $item['cantidad']; $i++) {
                        $this->generarQr($compra, $item['id'], $i);
                    }
                }
            }
    
            if ($pagarConSaldo) {
                $user->saldo -= $total;
            }
    
            $puntosGanados = $total * 0.10; // 10% del total gastado
            $user->puntos_totales += $puntosGanados;
            $user->save();
    
            DB::commit();
    
            session()->forget('carrito');
    
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
    
            // Asegúrate de que la carpeta de destino exista
            if (!Storage::exists('public/qrcodes')) {
                Storage::makeDirectory('public/qrcodes');
            }
    
            // Genera y guarda el QR
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
    
            // Asocia las entradas compradas a la compra y genera los QR
            foreach ($carrito as $item) {
                $entrada = \App\Models\Entrada::where('evento_id', $eventoId)
                    ->where('id', $item['id'])
                    ->first();
    
                if (!$entrada) {
                    throw new \Exception("La entrada no es válida para el concierto seleccionado.");
                }
    
                $compra->entradas()->attach($entrada->id, ['cantidad' => $item['cantidad']]);
    
                // Generar un QR por cada unidad de la entrada comprada
                for ($i = 1; $i <= $item['cantidad']; $i++) {
                    $this->generarQr($compra, $entrada->id, $i);
                }
            }
    
            // Resta el saldo del usuario comprador
            $user->saldo -= $total;
            $user->save();
    
            // Incrementa los ingresos del usuario creador de la reserva
            $reserva = \App\Models\ReservaDiscoteca::where('sala_id', $entrada->evento->sala_id)
                ->where('fecha_reserva', $entrada->evento->fecha_evento)
                ->first();
    
            if ($reserva) {
                $creador = $reserva->usuario; // Usuario que creó la reserva
                $ingresoTotal = collect($carrito)->reduce(function ($sum, $item) use ($reserva) {
                    return $sum + ($item['cantidad'] * $reserva->precio_entrada);
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
    // Recupera la compra junto con las entradas asociadas
    $compra = Compra::with('entradas')->findOrFail($compraId);

    // Array para guardar las rutas de los QR generados
    $qrPaths = [];

    // Generar QR por cada entrada de la compra
    foreach ($compra->entradas as $entrada) {
        $qrPath = storage_path("app/public/qrcodes/compra_{$compra->id}_entrada_{$entrada->id}.png");
        if (file_exists($qrPath)) {
            $qrPaths[] = $qrPath;
        }
    }

    // Crear la instancia de mPDF
    $mpdf = new \Mpdf\Mpdf();

    // Cargar la vista del PDF
    $html = view('qrs', compact('compra', 'qrPaths'))->render();

    // Escribir el HTML en el PDF
    $mpdf->WriteHTML($html);

    // Descargar el PDF
    return $mpdf->Output("Compra_{$compra->id}_QRs.pdf", 'D');
}
    

    
}