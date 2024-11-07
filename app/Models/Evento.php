<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    use HasFactory;

    protected $fillable = ['nombre_evento', 'descripcion', 'fecha_evento', 'hora_inicio','hora_final', 'cartel'];

    public function entradas()
{
    return $this->hasMany(Entrada::class);
}

}
