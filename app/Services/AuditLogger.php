<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Log;

class AuditLogger
{
    /**
     * Registra un evento de auditoría si está habilitado.
     *
     * @param  array<string, mixed>  $details
     */
    public static function log(
        string $action,
        ?string $description = null,
        array $details = [],
        ?int $userId = null,
    ): ?AuditLog {
        if (! config('audit.enabled')) {
            return null;
        }

        try {
            // Se registra la URL de la petición en todos los eventos para
            // poder mostrar el enlace visitado en la página de auditoría.
            $details = array_merge([
                'url' => request()->fullUrl(),
                'path' => request()->path(),
            ], $details);

            return AuditLog::create([
                'user_id' => $userId,
                'action' => $action,
                'description' => $description,
                'details' => $details,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        } catch (\Throwable $e) {
            Log::warning('No se pudo registrar la auditoría: '.$e->getMessage());

            return null;
        }
    }
}
