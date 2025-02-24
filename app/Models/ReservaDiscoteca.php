<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReservaDiscoteca extends Model
{
    use HasFactory;

    protected $fillable = [
        'usuario_id',
        'sala_id', 
        'fecha_reserva',
        'disponibilidad',
        'asistentes',
        'descripcion',
        'tipo_reserva',
        'precio_entrada'

    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function sala()
    {
        return $this->belongsTo(Sala::class, 'sala_id');
    }

    public function evento()
    {
        return $this->hasOne(\App\Models\Evento::class, 'sala_id', 'sala_id')
                    ->where('fecha_evento', $this->fecha_reserva); // Compara el valor de la reserva con la fecha del evento
    }
    
}
