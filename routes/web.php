<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Route::inertia('/', 'welcome')->name('home');
Route::redirect('/', '/dashboard')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('/usuarios')->controller(UserController::class)->group(function () {
       Route::get('/','index')->name('users.index');
       Route::get('/nuevo', 'create')->name('users.create');
       Route::get('/{user}', 'edit')->name('users.edit'); 
    })->name('users.');
});

require __DIR__.'/settings.php';
