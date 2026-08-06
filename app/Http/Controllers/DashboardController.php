<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Muestra el dashboard con estadísticas de usuarios y perfiles.
     */
    public function index(): Response
    {
        return Inertia::render('dashboard', [
            'stats' => [
                'total_users' => User::count(),
                'verified_users' => User::whereNotNull('email_verified_at')->count(),
                'users_without_profile' => User::whereNull('profile_id')->count(),
                'total_profiles' => Profile::count(),
                'active_profiles' => Profile::where('status', true)->count(),
            ],
            'users_per_profile' => Profile::query()
                ->withCount('users')
                ->orderByDesc('users_count')
                ->orderBy('order')
                ->get(),
            'recent_users' => User::query()
                ->with('profile')
                ->latest()
                ->take(5)
                ->get(),
            'registrations' => $this->registrationsPerDay(30),
        ]);
    }

    /**
     * Registros de usuarios por día para los últimos $days días.
     *
     * @return array<int, array{date: string, label: string, total: int}>
     */
    private function registrationsPerDay(int $days): array
    {
        $start = today()->subDays($days - 1);

        $totals = User::query()
            ->where('created_at', '>=', $start)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('total', 'date');

        return collect(range(0, $days - 1))
            ->map(fn (int $i) => $start->copy()->addDays($i))
            ->map(function ($date) use ($totals) {
                return [
                    'date' => $date->format('Y-m-d'),
                    'label' => $date->format('d M'),
                    'total' => (int) ($totals[$date->format('Y-m-d')] ?? 0),
                ];
            })
            ->all();
    }
}
