<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Route::inertia('/', 'welcome')->name('home');
Route::redirect('/', '/dashboard')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Perfiles de usuario (integrados dentro del módulo de usuarios).
    // Se registran antes que /usuarios/{user} para no colisionar con él.
    Route::name('profiles.')
        ->prefix('/usuarios/perfiles')
        ->controller(ProfileController::class)
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/nuevo', 'create')->name('create');
            Route::get('/{profile}', 'edit')->name('edit');
            Route::post('/', 'store')->name('store');
            Route::put('/{profile}', 'update')->name('update');
            Route::delete('/{profile}', 'destroy')->name('destroy');
        });

    Route::name('users.')
        ->prefix('/usuarios')
        ->controller(UserController::class)
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/nuevo', 'create')->name('create');
            Route::get('/{user}', 'edit')->name('edit');
            Route::post('/', 'store')->name('store');
            Route::put('/{user}', 'update')->name('update');
            Route::delete('/{user}', 'destroy')->name('destroy');
        });
});

require __DIR__.'/settings.php';
