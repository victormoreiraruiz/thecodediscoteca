<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Compra extends Model
{
    use HasFactory;

    protected $fillable = [
        'usuario_id', 
        'total',
        'descuento_aplicado_id',
        'puntos_aplicados',
        'fecha_compra'
    ];

    
    protected $dates = ['fecha_compra'];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function descuento()
    {
        return $this->belongsTo(Descuento::class);
    }

    public function compra_producto()
    {
        return $this->hasMany(CompraProducto::class);
    }

    public function entradas()
    {
        return $this->belongsToMany(Entrada::class, 'compra_entradas')
                    ->withPivot('cantidad')
                    ->withTimestamps();
    }
}
