<?php

use App\Models\Profile;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('dashboard shows users and profiles stats', function () {
    $admin = User::factory()->create();
    $profile = Profile::factory()->create(['name' => 'Cajero']);
    User::factory()->create([
        'name' => 'Juan Pérez',
        'profile_id' => $profile->id,
    ]);

    $response = $this
        ->actingAs($admin)
        ->get(route('dashboard'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('stats.total_users', 2)
            ->where('stats.total_profiles', 1)
            ->where('stats.active_profiles', 1)
            ->has('users_per_profile', 1)
            ->where('users_per_profile.0.name', 'Cajero')
            ->has('recent_users', 2)
            ->has('registrations', 30)
            ->where('registrations.29.total', 2));
});
