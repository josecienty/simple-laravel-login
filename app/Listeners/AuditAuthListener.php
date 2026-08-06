<?php

namespace App\Listeners;

use App\Models\User;
use App\Services\AuditLogger;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;

class AuditAuthListener
{
    public function handleLogin(Login $event): void
    {
        AuditLogger::log('login.success', 'Inicio de sesión exitoso', [], $event->user->id);
    }

    public function handleFailed(Failed $event): void
    {
        $identifier = $event->credentials['username'] ?? $event->credentials['email'] ?? null;
        $userId = $identifier
            ? User::where('username', $identifier)->orWhere('email', $identifier)->value('id')
            : null;

        AuditLogger::log(
            'login.failed',
            'Intento de inicio de sesión fallido',
            ['identifier' => $identifier],
            $userId,
        );
    }

    public function handleLogout(Logout $event): void
    {
        AuditLogger::log('logout', 'Cierre de sesión', [], $event->user?->id);
    }

    public function handleRegistered(Registered $event): void
    {
        AuditLogger::log('register', 'Nuevo usuario registrado', [
            'name' => $event->user->name,
            'email' => $event->user->email,
        ], $event->user->id);
    }

    public function handlePasswordReset(PasswordReset $event): void
    {
        AuditLogger::log('password.reset', 'Contraseña restablecida', [], $event->user->id);
    }

    public function handleVerified(Verified $event): void
    {
        AuditLogger::log('email.verified', 'Correo electrónico verificado', [], $event->user->id);
    }
}
