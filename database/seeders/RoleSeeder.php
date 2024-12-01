<?php

namespace Database\Seeders;
use App\Models\Rol;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Rol::create(['name' => 'admin']);
	Rol::create(['name' => 'cliente']);
	Rol::create(['name' => 'inventario']);	
    }
}
