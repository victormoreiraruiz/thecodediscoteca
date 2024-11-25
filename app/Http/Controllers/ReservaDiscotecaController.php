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
        'precio_entrada',
    ];

    /**
     * Relación con el modelo Usuario (quién creó la reserva).
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    /**
     * Relación con el modelo Sala.
     */
    public function sala()
    {
        return $this->belongsTo(Sala::class, 'sala_id');
    }

    /**
     * Relación con el modelo Evento, si la reserva está asociada a un concierto.
     */
    public function evento()
    {
        return $this->hasOne(Evento::class, 'sala_id', 'sala_id')
                    ->whereColumn('fecha_evento', 'fecha_reserva');
    }

    /**
     * Comprueba si la reserva es de tipo concierto.
     */
    public function esConcierto()
    {
        return $this->tipo_reserva === 'concierto';
    }
}
