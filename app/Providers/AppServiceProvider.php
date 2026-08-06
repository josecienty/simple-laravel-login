<?php

namespace App\Providers;

use App\Listeners\AuditAuthListener;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureMacro();
        $this->configureDefaults();
        $this->registerAuditEvents();
        $this->configureRateLimiting();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(
            fn (): ?Password => app()->isProduction()
                ? Password::min(12)
                    ->mixedCase()
                    ->letters()
                    ->numbers()
                    ->symbols()
                    ->uncompromised()
                : null,
        );
    }

    /**
     * Registra los eventos de autenticación en la auditoría.
     */
    private function registerAuditEvents(): void
    {
        Event::listen(Login::class, [AuditAuthListener::class, 'handleLogin']);
        Event::listen(Failed::class, [AuditAuthListener::class, 'handleFailed']);
        Event::listen(Logout::class, [AuditAuthListener::class, 'handleLogout']);
        Event::listen(Registered::class, [AuditAuthListener::class, 'handleRegistered']);
        Event::listen(PasswordReset::class, [AuditAuthListener::class, 'handlePasswordReset']);
        Event::listen(Verified::class, [AuditAuthListener::class, 'handleVerified']);
    }

    /**
     * Límite global de peticiones por IP (aplicado en bootstrap/app.php).
     * Configurable con RATE_LIMIT_PER_MINUTE en el .env.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for(
            'global',
            fn (Request $request) => Limit::perMinute((int) env('RATE_LIMIT_PER_MINUTE', 60))->by($request->ip()),
        );
    }

    private function configureMacro(): void
    {

        Route::macro('modulo', function ($uri, $controller, $name = null) {
            if (! $name || trim($name) === '') {
                $name = trim($uri, '/');
            }

            return Route::prefix($uri)
                ->name("{$name}.")
                ->controller($controller)
                ->group(function () {
                    Route::get('/', 'index')->name('listar');
                    Route::get('/nuevo', 'create')->name('nuevo');
                    Route::post('/', 'store')->name('guardar');
                    Route::get('/{id}', 'edit')->name('editar');
                    Route::put('/{id}', 'update')->name('actualizar');
                    Route::delete('/{id}', 'destroy')->name('eliminar');
                });
        });

    }
}
