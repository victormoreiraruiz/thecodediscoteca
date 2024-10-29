<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entrada extends Model
{
    public function compra_entrada()
    {
        return $this->hasMany(CompraEntrada::class);
    }
}
