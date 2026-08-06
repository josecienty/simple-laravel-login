<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SessionController extends Controller
{
    /**
     * Cierra una sesión específica del usuario (que no sea la actual).
     */
    public function destroy(Request $request, string $session): RedirectResponse
    {
        if ($session === $request->session()->getId()) {
            return redirect()->back()->with('error', 'No puedes cerrar tu sesión actual desde esta página.');
        }

        $deleted = DB::table('sessions')
            ->where('id', $session)
            ->where('user_id', $request->user()->id)
            ->delete();

        if (! $deleted) {
            return redirect()->back()->with('error', 'La sesión no existe o ya fue cerrada.');
        }

        AuditLogger::log('session.revoke', 'Sesión revocada', ['session' => $session], $request->user()->id);

        return redirect()->back()->with('success', 'Sesión cerrada correctamente.');
    }

    /**
     * Cierra todas las sesiones del usuario excepto la actual.
     */
    public function destroyOthers(Request $request): RedirectResponse
    {
        $deleted = DB::table('sessions')
            ->where('user_id', $request->user()->id)
            ->where('id', '!=', $request->session()->getId())
            ->delete();

        AuditLogger::log(
            'session.revoke_all',
            'Sesiones de otros dispositivos cerradas',
            ['count' => $deleted],
            $request->user()->id,
        );

        return redirect()->back()->with('success', "Se cerraron {$deleted} sesiones de otros dispositivos.");
    }
}
