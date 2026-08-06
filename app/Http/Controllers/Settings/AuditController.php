<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditController extends Controller
{
    /**
     * Muestra el registro de auditoría con filtros y paginación.
     */
    public function index(Request $request): Response
    {
        $logs = AuditLog::query()
            ->with('user')
            ->when($request->filled('action'), fn ($query) => $query->where('action', $request->action))
            ->when($request->filled('user'), function ($query) use ($request) {
                $query->whereHas('user', function ($q) use ($request) {
                    $q->where('name', 'like', "%{$request->user}%")
                        ->orWhere('email', 'like', "%{$request->user}%");
                });
            })
            ->when($request->filled('from'), fn ($query) => $query->whereDate('created_at', '>=', $request->from))
            ->when($request->filled('to'), fn ($query) => $query->whereDate('created_at', '<=', $request->to))
            ->latest()
            ->paginate(30)
            ->withQueryString();

        return Inertia::render('settings/audit', [
            'logs' => $logs,
            'actions' => AuditLog::query()
                ->select('action')
                ->distinct()
                ->orderBy('action')
                ->pluck('action'),
            'filters' => $request->only(['action', 'user', 'from', 'to']),
        ]);
    }
}
