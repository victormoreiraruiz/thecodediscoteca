<!DOCTYPE html>
<html>
<head>
    <title>Tus Entradas</title>
</head>
<body>
    <h1>¡Gracias por tu compra!</h1>
    <p>Compra ID: {{ $compra->id }}</p>
    <p>Total: €{{ number_format($compra->total, 2) }}</p>
    <p>Hemos adjuntado tus códigos QR a este correo. Puedes usarlos para acceder al evento.</p>
    <p>¡Que disfrutes del evento!</p>
</body>
</html>
