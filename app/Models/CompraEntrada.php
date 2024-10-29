<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompraEntrada extends Model
{
    public function compra()
    {
        return $this->belongsTo(Compra::class);
    }

    public function entrada()
    {
        return $this->belongsTo(Entrada::class);
    }
}
