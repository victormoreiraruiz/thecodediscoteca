<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sala extends Model
{
    use HasFactory;

    protected $fillable = [
        'tipo_sala',
        'capacidad',
        'descripcion',
        'precio',
    ];

    public function reservas()
    {
        return $this->hasMany(ReservaDiscoteca::class, 'sala_id');
    }

    // Sala.php
public function eventos()
{
    return $this->hasMany(Evento::class, 'sala_id');
}

}
