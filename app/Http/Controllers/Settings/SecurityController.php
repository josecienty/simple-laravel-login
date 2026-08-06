<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\PasswordUpdateRequest;
use App\Http\Requests\Settings\TwoFactorAuthenticationRequest;
use App\Services\AuditLogger;
use App\Support\UserAgentParser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class SecurityController extends Controller
{
    /**
     * Show the user's security settings page.
     */
    public function edit(TwoFactorAuthenticationRequest $request): Response
    {
        $props = [
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
            'sessions' => $this->activeSessions($request),
        ];

        return Inertia::render('settings/security', $props);
    }

    /**
     * Update the user's password.
     */
    public function update(PasswordUpdateRequest $request): RedirectResponse
    {
        $request->user()->update([
            'password' => $request->password,
        ]);

        AuditLogger::log('password.update', 'Contraseña actualizada', [], $request->user()->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Password updated.')]);

        return back();
    }

    /**
     * Sesiones activas del usuario (la actual primero).
     *
     * @return array<int, array<string, mixed>>
     */
    private function activeSessions(Request $request): array
    {
        $currentId = $request->session()->getId();

        return DB::table('sessions')
            ->where('user_id', $request->user()->id)
            ->get()
            ->map(function ($session) use ($currentId) {
                return [
                    'id' => $session->id,
                    'ip_address' => $session->ip_address,
                    'agent' => UserAgentParser::parse($session->user_agent),
                    'last_active' => Carbon::createFromTimestamp($session->last_activity)->diffForHumans(),
                    'is_current_device' => $session->id === $currentId,
                ];
            })
            ->sortByDesc('is_current_device')
            ->values()
            ->all();
    }
}
