<?php

use App\Models\AuditLog;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Support\Facades\Config;
use Inertia\Testing\AssertableInertia;

test('successful login is recorded in the audit log', function () {
    $user = User::factory()->create();
    AuditLog::query()->delete();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $log = AuditLog::query()->where('action', 'login.success')->first();

    expect($log)->not->toBeNull()
        ->and($log->user_id)->toBe($user->id);
});

test('failed login is recorded in the audit log', function () {
    $user = User::factory()->create();
    AuditLog::query()->delete();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $log = AuditLog::query()->where('action', 'login.failed')->first();

    expect($log)->not->toBeNull()
        ->and($log->details['email'])->toBe($user->email);
});

test('page visits are recorded for guests and authenticated users', function () {
    AuditLog::query()->delete();

    $this->get('/login');

    $guestVisit = AuditLog::query()
        ->where('action', 'visit')
        ->whereNull('user_id')
        ->first();

    expect($guestVisit)->not->toBeNull()
        ->and($guestVisit->description)->toBe('Visita a login')
        ->and($guestVisit->details['url'])->toContain('/login');

    $user = User::factory()->create();
    $this->actingAs($user)->get('/dashboard');

    $userVisit = AuditLog::query()
        ->where('action', 'visit')
        ->where('user_id', $user->id)
        ->first();

    expect($userVisit)->not->toBeNull();
});

test('creating a user through the CRUD is recorded', function () {
    $admin = User::factory()->create();
    $profile = Profile::factory()->create();
    AuditLog::query()->delete();

    $this->actingAs($admin)->post('/usuarios', [
        'name' => 'Nuevo Usuario',
        'email' => 'nuevo@example.com',
        'password' => 'password',
        'profile_id' => $profile->id,
    ]);

    $log = AuditLog::query()->where('action', 'user.store')->first();

    expect($log)->not->toBeNull()
        ->and($log->description)->toBe('Usuario creado')
        ->and($log->details['name'])->toBe('Nuevo Usuario');
});

test('visits can be disabled with the log_visits switch', function () {
    Config::set('audit.log_visits', false);

    AuditLog::query()->delete();

    $this->get('/login');

    expect(AuditLog::query()->where('action', 'visit')->count())->toBe(0);
});

test('audit log can be filtered by date range', function () {
    $user = User::factory()->create();
    AuditLog::factory()->create([
        'action' => 'user.store',
        'created_at' => now()->subDays(10),
    ]);
    AuditLog::factory()->create([
        'action' => 'user.update',
        'created_at' => now(),
    ]);

    $this
        ->withSession(['auth.password_confirmed_at' => now()->timestamp])
        ->actingAs($user)
        ->get('/settings/audit?from='.now()->toDateString().'&to='.now()->toDateString())
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->has('logs.data', 1)
            ->where('logs.data.0.action', 'user.update')
            ->where('filters.from', now()->toDateString())
            ->where('filters.to', now()->toDateString()));
});

test('audit logging can be disabled with the config switch', function () {
    Config::set('audit.enabled', false);

    $user = User::factory()->create();
    AuditLog::query()->delete();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    expect(AuditLog::count())->toBe(0);
});
