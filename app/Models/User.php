<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'saldo',
        'puntos_totales',
        'rol',  // Agrega el campo rol aquí
    ];
    

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function compras()
    {
        return $this->hasMany(Compra::class, 'usuario_id');
    }


    public function reservasDiscoteca()
{
    return $this->hasMany(ReservaDiscoteca::class);
}
    public function reservas()
{
    return $this->hasMany(ReservaDiscoteca::class, 'usuario_id');
}

public function eventos()
{
    return $this->hasMany(Evento::class);
}

    public function sube_foto()
    {
        return $this->hasMany(Foto::class);
    }

    public function esAdmin()
{
    return $this->rol === 'admin';
}

public function noEsAdmin()
{
    return $this->rol !== 'admin';
}

public function notificaciones()
{
    return $this->hasMany(Notificacion::class, 'usuario_id');
}
}
