<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    use HasFactory;

   

    protected $fillable = [
        'nombre_evento', 
        'descripcion', 
        'fecha_evento', 
        'hora_inicio', 
        'hora_final', 
        'cartel', 
        'sala_id',
    ];

    public function sala()
    {
        return $this->belongsTo(Sala::class, 'sala_id');
    }

    public function reservas()
    {
        return $this->hasManyThrough(ReservaDiscoteca::class, Sala::class, 'id', 'sala_id', 'sala_id', 'id');
    }

   
    public function entradas()
    {
        return $this->hasMany(Entrada::class, 'evento_id');
    }

    public function compras()
{
    return $this->belongsToMany(Compra::class, 'compra_entradas')
                ->withPivot('cantidad')
                ->withTimestamps();
}
public function usuario()
{
    return $this->belongsTo(User::class, 'usuario_id'); // Asegúrate de que 'usuario_id' es la columna correcta
}

}
