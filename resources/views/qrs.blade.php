<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QRs de la Compra</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            margin: 20px;
        }
        h1 {
            text-align: center;
            margin-bottom: 20px;
        }
        .compra-details {
            margin-bottom: 30px;
        }
        .qr-item {
            margin-bottom: 15px;
        }
        .qr-item img {
            width: 150px;
            height: 150px;
            margin-right: 20px;
        }
        .qr-item .details {
            display: inline-block;
            vertical-align: top;
            line-height: 1.5;
        }
        .qr-item .details p {
            margin: 0;
        }
    </style>
</head>
<body>
    <h1>Detalles de la Compra y Códigos QR</h1>

    <div class="compra-details">
        <p><strong>Total de la Compra:</strong> ${{ number_format($compra->total, 2) }}</p>
        <p><strong>Usuario:</strong> {{ $compra->usuario->name }}</p>
    </div>

    @php
        // Variable para llevar el control de los QR generados
        $qrIndex = 0;
    @endphp

    @foreach ($compra->entradas as $entrada)
        <div class="qr-item">
            <div class="details">
                <p><strong>Tipo de Entrada:</strong> {{ $entrada->tipo }}</p>
                <p><strong>Cantidad:</strong> {{ $entrada->pivot->cantidad }}</p>
                <p><strong>Precio por Entrada:</strong> ${{ number_format($entrada->precio, 2) }}</p>
                <p><strong>Precio Total:</strong> ${{ number_format($entrada->precio * $entrada->pivot->cantidad, 2) }}</p>

                @if ($entrada->evento)
                    <p><strong>Evento:</strong> {{ $entrada->evento->nombre_evento }}</p>
                    <p><strong>Fecha:</strong> {{ \Carbon\Carbon::parse($entrada->evento->fecha_evento)->format('d/m/Y') }}</p>
                    <p><strong>Hora de Inicio:</strong> {{ \Carbon\Carbon::parse($entrada->evento->hora_inicio)->format('H:i') }}</p>
                    <p><strong>Hora de Fin:</strong> {{ \Carbon\Carbon::parse($entrada->evento->hora_final)->format('H:i') }}</p>
                @endif
            </div>

            @for ($i = 0; $i < $entrada->pivot->cantidad; $i++)
                <div class="qr-item">
                    @if (isset($qrPaths[$qrIndex]) && is_file($qrPaths[$qrIndex]))
                        <img src="data:image/png;base64,{{ base64_encode(file_get_contents($qrPaths[$qrIndex])) }}" alt="QR Code">
                        <div class="details">
                            <p><strong>Número de Entrada:</strong> {{ $i + 1 }}</p>
                        </div>
                        @php $qrIndex++; @endphp
                    @else
                        <p>Error: No se puede cargar el QR para la entrada {{ $entrada->id }} número {{ $i + 1 }}</p>
                    @endif
                </div>
            @endfor
        </div>
    @endforeach
</body>
</html>
