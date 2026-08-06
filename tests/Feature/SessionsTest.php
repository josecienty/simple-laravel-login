<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia;

function insertTestSession(string $id, int $userId, ?string $userAgent = null): void
{
    DB::table('sessions')->insert([
        'id' => $id,
        'user_id' => $userId,
        'ip_address' => '127.0.0.1',
        'user_agent' => $userAgent ?? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36',
        'payload' => 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWVRva2VuIjtzOjk6Il9wcmV2aW91cyI7YTowOnt9czo2OiJfZmxhc2giO2E6MDp7fX0=',
        'last_activity' => now()->subMinutes(5)->timestamp,
    ]);
}

test('security page lists the active sessions', function () {
    $user = User::factory()->create();
    $currentId = session()->getId();
    insertTestSession($currentId, $user->id);
    insertTestSession('other-session-1', $user->id);

    $this
        ->withCookie(session()->getName(), $currentId)
        ->withSession(['auth.password_confirmed_at' => now()->timestamp])
        ->actingAs($user)
        ->get('/settings/security')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('settings/security')
            ->has('sessions', 2)
            ->where('sessions.0.is_current_device', true));
});

test('an active session can be revoked', function () {
    $user = User::factory()->create();
    insertTestSession('other-session-1', $user->id);

    $this->actingAs($user)
        ->delete('/settings/sessions/other-session-1')
        ->assertRedirect();

    expect(DB::table('sessions')->where('id', 'other-session-1')->exists())->toBeFalse()
        ->and(DB::table('audit_logs')->where('action', 'session.revoke')->exists())->toBeTrue();
});

test('the current session cannot be revoked', function () {
    $user = User::factory()->create();
    $currentId = session()->getId();
    insertTestSession($currentId, $user->id);

    $this
        ->withCookie(session()->getName(), $currentId)
        ->actingAs($user)
        ->delete('/settings/sessions/'.$currentId)
        ->assertRedirect();

    expect(DB::table('sessions')->where('user_id', $user->id)->count())->toBe(1);
});

test('all other sessions can be closed at once', function () {
    $user = User::factory()->create();
    $currentId = session()->getId();
    insertTestSession($currentId, $user->id);
    insertTestSession('other-session-1', $user->id);
    insertTestSession('other-session-2', $user->id);

    $this
        ->withCookie(session()->getName(), $currentId)
        ->actingAs($user)
        ->delete('/settings/sessions')
        ->assertRedirect();

    expect(DB::table('sessions')->where('user_id', $user->id)->count())->toBe(1)
        ->and(DB::table('sessions')->where('user_id', $user->id)->first()->id)->toBe($currentId)
        ->and(DB::table('audit_logs')->where('action', 'session.revoke_all')->exists())->toBeTrue();
});

test('a session belonging to another user cannot be revoked', function () {
    $owner = User::factory()->create();
    $attacker = User::factory()->create();
    insertTestSession('other-session-1', $owner->id);

    $this->actingAs($attacker)
        ->delete('/settings/sessions/other-session-1')
        ->assertRedirect();

    expect(DB::table('sessions')->where('id', 'other-session-1')->exists())->toBeTrue();
});
