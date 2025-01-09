<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $fillable = [
        'nombre',
        'precio',
        'descripcion',
        'stock',
        'categoria_id',
    ];
    
    public function compraProducto()
    {
        return $this->hasMany(compraProducto::class);
    }

    public function comandas()
{
    return $this->belongsToMany(Comanda::class, 'comanda_producto')
                ->withPivot('cantidad')
                ->withTimestamps();
}

public function categoria()
{
    return $this->belongsTo(Categoria::class);
}

}
