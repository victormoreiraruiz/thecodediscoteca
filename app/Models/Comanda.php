<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comanda extends Model
{
    use HasFactory;

    public function mesa()
{
    return $this->belongsTo(Mesa::class);
}

public function sala()
{
    return $this->hasOneThrough(Sala::class, Mesa::class);
}

public function productos()
{
    return $this->belongsToMany(Producto::class, 'comanda_producto')
                ->withPivot('cantidad')
                ->withTimestamps();
}

}
