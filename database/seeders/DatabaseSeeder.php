<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Perfiles por defecto de la plataforma.
     *
     * @var array<int, array<string, mixed>>
     */
    private array $defaultProfiles = [
        ['name' => 'Super Administrador', 'order' => 1],
        ['name' => 'Administrador', 'order' => 2],
        ['name' => 'Cajero', 'order' => 3],
    ];

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        foreach ($this->defaultProfiles as $profile) {
            Profile::firstOrCreate(
                ['name' => $profile['name']],
                [
                    'slug' => Str::slug($profile['name']),
                    'order' => $profile['order'],
                    'status' => true,
                ]
            );
        }

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
