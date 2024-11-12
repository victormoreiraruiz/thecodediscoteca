<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Evento;

class EntradasTableSeeder extends Seeder
{
    public function run()
    {
        $eventoId = Evento::where('nombre_evento', 'Fiesta de Año Nuevo')->first()->id;

        DB::table('entradas')->insert([
            ['tipo' => 'normal', 'precio' => 10, 'evento_id' => $eventoId],
            ['tipo' => 'vip', 'precio' => 30, 'evento_id' => $eventoId],
            ['tipo' => 'premium', 'precio' => 50, 'evento_id' => $eventoId],
        ]);
    }
}
