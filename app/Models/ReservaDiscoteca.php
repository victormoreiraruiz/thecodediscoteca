<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReservaDiscoteca extends Model
{
    public function reserva()
    {
        return $this->belongsTo(User::class);
    }
}
