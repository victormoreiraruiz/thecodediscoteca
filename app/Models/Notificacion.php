<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notificacion extends Model
{
    use HasFactory;

    protected $table = 'notificaciones'; 
    protected $fillable = ['usuario_id', 'mensaje', 'leido'];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
