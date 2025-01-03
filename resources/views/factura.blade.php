<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factura</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: #fff;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .header h1 {
            color: #007bff;
            font-size: 1.8em;
            margin: 0;
        }
        .header img {
            max-height: 50px;
        }
        .details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .details div {
            width: 48%;
        }
        .details p {
            margin: 5px 0;
            font-size: 0.9em;
        }
        .details p strong {
            font-weight: bold;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .table th, .table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        .table th {
            background-color: #007bff;
            color: #fff;
            font-size: 0.9em;
        }
        .totals {
            text-align: right;
            margin-top: 20px;
        }
        .totals p {
            font-size: 1em;
            margin: 5px 0;
        }
        .totals p strong {
            font-weight: bold;
            font-size: 1.1em;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.8em;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Factura</h1>
            <img src="logo.png" alt="Logo">
        </div>

        <!-- Details -->
        <div class="details">
    <div>
        <p><strong>Comprador:</strong> {{ $usuario['nombre'] }}</p>
        <p><strong>Documento Fiscal:</strong> {{ $usuario['documento_fiscal'] }}</p>
        <p><strong>Dirección:</strong> {{ $usuario['direccion'] }}</p>
        <p><strong>Teléfono:</strong> {{ $usuario['telefono'] }}</p>
        <p><strong>Email:</strong> {{ $usuario['email'] }}</p>
    </div>
</div>

@if($reserva['tipo_reserva'] === 'concierto')
<div class="evento-details">
    <h2>Detalles del Evento</h2>
    <p><strong>Nombre del Evento:</strong> {{ $reserva['nombre_concierto'] }}</p>
    <p><strong>Descripción:</strong> {{ $reserva['descripcion'] }}</p>
    <p><strong>Fecha:</strong> {{ $reserva['fecha_reserva'] }}</p>
    <p><strong>Hora de Inicio:</strong> {{ $reserva['hora_inicio'] }}</p>
    <p><strong>Hora de Fin:</strong> {{ $reserva['hora_fin'] }}</p>
</div>
@endif


        <!-- Table -->
        <table class="table">
            <thead>
                <tr>
                    <th>Descripción</th>
                    <th>Unidades</th>
                    <th>Precio Unitario</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Sala: {{ $sala['tipo_sala'] }}</td>
                    <td>1</td>
                    <td>€{{ number_format($sala['precio'], 2) }}</td>
                    <td>€{{ number_format($sala['precio'], 2) }}</td>
                </tr>
                @if($reserva['tipo_reserva'] === 'concierto')
                @endif
            </tbody>
        </table>

        <!-- Footer -->
        <div class="footer">
            <p>Gracias por confiar en The Code.</p>
            <p>&copy; {{ date('Y') }} The Code Nightclub. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
