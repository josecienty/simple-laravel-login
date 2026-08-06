<?php

namespace App\Http\Middleware;

use App\Services\AuditLogger;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogVisits
{
    /**
     * Registra en auditoría las visitas a páginas con nombre de ruta
     * y los accesos denegados (403).
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! config('audit.enabled')) {
            return $response;
        }

        $route = $request->route();

        if (config('audit.log_visits') && $route && $route->getName() && in_array($request->method(), ['GET', 'HEAD'])) {
            AuditLogger::log(
                'visit',
                'Visita a '.$request->path(),
                [
                    'route' => $route->getName(),
                    'url' => $request->fullUrl(),
                    'path' => $request->path(),
                    'status' => $response->getStatusCode(),
                ],
                $request->user()?->id,
            );
        }

        if ($response->getStatusCode() === Response::HTTP_FORBIDDEN) {
            AuditLogger::log(
                'access.denied',
                'Acceso denegado a '.$request->path(),
                ['path' => $request->path()],
                $request->user()?->id,
            );
        }

        return $response;
    }
}
