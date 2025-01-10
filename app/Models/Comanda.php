<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comanda extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'evento_id', 'mesa_id', 'estado'];

    public function mesa()
{
    return $this->belongsTo(Mesa::class);
}

public function sala()
{
    return $this->hasOneThrough(Sala::class, Mesa::class);
}

public function evento()
    {
        return $this->belongsTo(Evento::class, 'evento_id');
    }


public function productos()
{
    return $this->belongsToMany(Producto::class, 'comanda_producto')
                ->withPivot('cantidad')
                ->withTimestamps();
}

public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

}
