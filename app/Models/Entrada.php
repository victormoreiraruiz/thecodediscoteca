<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entrada extends Model


{
    protected $fillable = ['evento_id', 'tipo', 'precio'];
    public function evento()
{
    return $this->belongsTo(Evento::class);
}

public function compras()
{
    return $this->belongsToMany(Compra::class, 'compra_entradas')
                ->withPivot('cantidad')
                ->withTimestamps();
}
}
