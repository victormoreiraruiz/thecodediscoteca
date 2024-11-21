<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mesa extends Model
{
    use HasFactory;

    protected $fillable = [
        'evento_id',
        'nombre',
        'precio',
        'reservada',
    ];

    public function evento()
    {
        return $this->belongsTo(Evento::class);
    }

    public function compras()
    {
        return $this->belongsToMany(Compra::class, 'compra_mesas')->withPivot('cantidad');
    }
}
