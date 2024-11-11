<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventosTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('eventos')->insert([
            [
                'nombre_evento' => 'Fiesta de Año Nuevo',
                'descripcion' => 'Celebración de fin de año',
                'fecha_evento' => '2024-12-31',
                'hora_inicio' => '20:00:00',
                'hora_final' => '02:00:00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Agrega otros eventos si es necesario
        ]);
    }
}
