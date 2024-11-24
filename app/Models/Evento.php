<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre_evento',
        'descripcion',
        'fecha_evento',
        'hora_inicio',
        'hora_final',
        'cartel',
        'sala_id',
    ];

    // Relación con la sala
    public function sala()
    {
        return $this->belongsTo(Sala::class, 'sala_id');
    }

    // Relación indirecta con las reservas a través de la sala
    public function reservas()
    {
        return $this->hasManyThrough(ReservaDiscoteca::class, Sala::class, 'id', 'sala_id', 'sala_id', 'id');
    }

    // Relación con entradas
    public function entradas()
    {
        return $this->hasMany(Entrada::class, 'evento_id');
    }
}
