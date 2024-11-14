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
        'inicio_reserva',
        'final_reserva',
        'disponibilidad',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function sala()
    {
        return $this->belongsTo(Sala::class, 'sala_id');
    }
}
