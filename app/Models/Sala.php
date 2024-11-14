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
}
