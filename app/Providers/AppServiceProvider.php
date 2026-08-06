<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
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
