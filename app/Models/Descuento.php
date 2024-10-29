<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Descuento extends Model
{
    public function descuento_compras()
    {
        return $this->hasMany(Compra::class);
    }
}
