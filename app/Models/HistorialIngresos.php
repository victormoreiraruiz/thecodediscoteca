<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistorialIngresos extends Model
{
    use HasFactory;

    protected $table = 'historial_ingresos'; 

    protected $fillable = [
        'cantidad',
        'motivo',
    ];
}
