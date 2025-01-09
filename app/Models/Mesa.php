<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mesa extends Model
{
    use HasFactory;

    protected $fillable = ['sala_id', 'numero'];

    public function sala()
{
    return $this->belongsTo(Sala::class);
}

}
