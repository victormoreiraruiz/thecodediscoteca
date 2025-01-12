<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Entradas de Compra</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

        body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
            color: #333;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
        }
        .summary {
            background-color: #870000;
            color: #fff;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 20px;
            font-size: 18px;
            font-weight: bold;
        }
        .summary p {
            margin: 5px 0;
        }
        .entrada {
            margin: 20px auto;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 450px;
            background-color: #fff;
            padding-bottom: 20px;
        }
        .header {
            background-color: #870000;
            color: #fff;
            padding: 15px;
            text-align: center;
            font-weight: bold;
            font-size: 14px;
        }
        .event-name {
            background-color: #e5cc70;
            text-align: center;
            padding: 20px;
            font-size: 20px;
            font-weight: bold;
            color: #000;
        }
        .qr-block {
            background-color: #fff;
            padding: 20px;
            text-align: center;
            position: relative;
            border-bottom: 2px solid #870000;
        }
        .qr-block img {
            max-width: 160px;
            height: auto;
            padding: 10px;
            background: #fff;
            border: 3px solid #870000;
            border-radius: 10px;
        }
        .qr-code-label {
            font-size: 14px;
            margin-top: 10px;
            color: #444;
            font-weight: bold;
        }
        .conditions {
            margin-top: 30px;
            padding: 20px;
            background-color: #f9f9f9;
            border-top: 3px solid #870000;
            font-size: 14px;
            line-height: 1.6;
        }
        .conditions h2 {
            color: #870000;
            text-align: center;
            margin-bottom: 15px;
        }
        .conditions p, .conditions ul {
            margin: 5px 0;
        }
        .conditions ul {
            padding-left: 20px;
        }
        .conditions ul li {
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="summary">
        <p><strong>Usuario:</strong> {{ $compra->usuario->name }}</p>
        <p><strong>Total de la Compra:</strong> {{ number_format($compra->total, 2) }} €</p>
    </div>

    @php
        $qrIndex = 0;
    @endphp

    @foreach ($compra->entradas as $entrada)
        @for ($i = 0; $i < $entrada->pivot->cantidad; $i++)
        <div class="entrada">
            <div class="header">
                Entrada {{ $entrada->tipo }} {{ $i + 1 }} |
                {{ \Carbon\Carbon::parse($entrada->evento->fecha_evento)->format('d M. Y') }} |
                {{ \Carbon\Carbon::parse($entrada->evento->hora_inicio)->format('H:i A') }} - 
                {{ \Carbon\Carbon::parse($entrada->evento->hora_final)->format('H:i A') }}
            </div>
            <div class="event-name">
                {{ strtoupper($entrada->evento->nombre_evento) }}
            </div>
            <div class="qr-block">
                @if (isset($qrPaths[$qrIndex]) && is_file($qrPaths[$qrIndex]))
                    <img src="data:image/png;base64,{{ base64_encode(file_get_contents($qrPaths[$qrIndex])) }}" alt="QR Code">
                    <p class="qr-code-label">Escanea para validar tu entrada</p>
                    @php $qrIndex++; @endphp
                @else
                    <p>Error: QR no disponible</p>
                @endif
            </div>
        </div>
        @endfor
    @endforeach

    <div class="conditions">
        <h2>CONDICIONES GENERALES</h2>
        <p>1. Queda terminantemente prohibido introducir alcohol, sustancias ilegales, armas u objetos peligrosos al evento.</p>
        <p>2. Derecho de admisión en virtud de lo dispuesto en la Ley de Espectáculos Públicos vigente.</p>
        <p>3. Queda prohibida la entrada a menores de 18 años. Será imprescindible mostrar el DNI u otro documento identificativo válido original. NO se admiten fotocopias, ya que la organización del evento no se hace responsable de entradas robadas/falsificadas.</p>
        <p>4. Queda limitada la entrada y/o permanencia en el evento a toda persona que:</p>
        <ul>
            <li>Se encuentre en estado de embriaguez o consuma cualquier tipo de estupefacientes o sustancia ilegal.</li>
            <li>Provoque o incite cualquier desorden o acto de violencia dentro del evento.</li>
            <li>No cumpla con la normativa de vestimenta establecida por el establecimiento.</li>
            <li>No cumpla con las medidas higiénico sanitarias del establecimiento.</li>
        </ul>
        <p>5. Todo asistente podrá ser sometido a un registro por el equipo de seguridad en el acceso al evento, siguiendo las directrices de la Ley de Espectáculos Públicos y Seguridad Privada. En caso de negación, quedará prohibida la entrada al evento.</p>
        <p>6. El público asistente podrá aparecer en imágenes tomadas por diferentes medios. La organización podrá grabar, retransmitir y filmar a los asistentes.</p>
        <br>
        <p>Si quieres conocer la política de privacidad, accede a este enlace: <a href="http://127.0.0.1:8000/politica-privacidad">Política de Privacidad</a></p>
        <br>
        <p><strong>ORGANIZADOR DEL EVENTO</strong></p>
        <p>THE CODE NIGHTCLUB</p>
    </div>
</body>
</html>
