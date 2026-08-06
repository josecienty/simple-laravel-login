<?php

use App\Models\Profile;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('profiles live inside the users module', function () {
    expect(route('profiles.index', absolute: false))->toBe('/usuarios/perfiles');
});

test('an authenticated user can create a user with a profile', function () {
    $admin = User::factory()->create();
    $profile = Profile::factory()->create();

    $response = $this
        ->actingAs($admin)
        ->post(route('users.store'), [
            'name' => 'Juan Pérez',
            'username' => 'juanperez',
            'email' => 'juan@example.com',
            'password' => 'secret-password',
            'profile_id' => $profile->id,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('users.index'));

    $user = User::where('username', 'juanperez')->first();

    expect($user)->not->toBeNull()
        ->and($user->profile_id)->toBe($profile->id)
        ->and($user->email)->toBe('juan@example.com');
});

test('a user can be created without an email', function () {
    $admin = User::factory()->create();
    $profile = Profile::factory()->create();

    $response = $this
        ->actingAs($admin)
        ->post(route('users.store'), [
            'name' => 'Sin Correo',
            'username' => 'sincorreo',
            'email' => '',
            'password' => 'secret-password',
            'profile_id' => $profile->id,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('users.index'));

    expect(User::where('username', 'sincorreo')->first()->email)->toBeNull();
});

test('profile is required when creating a user', function () {
    $admin = User::factory()->create();

    $response = $this
        ->actingAs($admin)
        ->post(route('users.store'), [
            'name' => 'Juan Pérez',
            'username' => 'juanperez',
            'email' => 'juan@example.com',
            'password' => 'secret-password',
        ]);

    $response->assertSessionHasErrors('profile_id');
});

test('a user profile assignment can be updated', function () {
    $admin = User::factory()->create();
    $user = User::factory()->create();
    $profile = Profile::factory()->create();

    $response = $this
        ->actingAs($admin)
        ->put(route('users.update', $user), [
            'name' => $user->name,
            'username' => $user->username,
            'email' => $user->email,
            'profile_id' => $profile->id,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('users.index'));

    expect($user->refresh()->profile_id)->toBe($profile->id);
});

test('users index shows the assigned profile', function () {
    $admin = User::factory()->create();
    $profile = Profile::factory()->create(['name' => 'Cajero']);
    $user = User::factory()->create([
        'name' => 'Juan Pérez',
        'profile_id' => $profile->id,
    ]);

    $response = $this
        ->actingAs($admin)
        ->get(route('users.index', ['search' => 'Juan']));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/listado')
            ->has('users.data', 1)
            ->where('users.data.0.profile.name', 'Cajero'));

    expect($user->refresh()->profile->name)->toBe('Cajero');
});

test('a profile with assigned users cannot be deleted', function () {
    $admin = User::factory()->create();
    $profile = Profile::factory()->create();
    User::factory()->create(['profile_id' => $profile->id]);

    $response = $this
        ->actingAs($admin)
        ->from(route('profiles.index'))
        ->delete(route('profiles.destroy', $profile));

    $response
        ->assertSessionHas('error')
        ->assertRedirect(route('profiles.index'));

    expect(Profile::find($profile->id))->not->toBeNull();
});

test('a profile without users can be deleted', function () {
    $admin = User::factory()->create();
    $profile = Profile::factory()->create();

    $response = $this
        ->actingAs($admin)
        ->delete(route('profiles.destroy', $profile));

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profiles.index'));

    expect(Profile::find($profile->id))->toBeNull();
});
