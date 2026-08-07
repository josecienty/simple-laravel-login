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
        /** @var User $user */
        $user = $event->user;

        AuditLogger::log('login.success', 'Inicio de sesión exitoso', [], $user->id);
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
        /** @var User|null $user */
        $user = $event->user;

        AuditLogger::log('logout', 'Cierre de sesión', [], $user?->id);
    }

    public function handleRegistered(Registered $event): void
    {
        /** @var User $user */
        $user = $event->user;

        AuditLogger::log('register', 'Nuevo usuario registrado', [
            'name' => $user->name,
            'email' => $user->email,
        ], $user->id);
    }

    public function handlePasswordReset(PasswordReset $event): void
    {
        /** @var User $user */
        $user = $event->user;

        AuditLogger::log('password.reset', 'Contraseña restablecida', [], $user->id);
    }

    public function handleVerified(Verified $event): void
    {
        /** @var User $user */
        $user = $event->user;

        AuditLogger::log('email.verified', 'Correo electrónico verificado', [], $user->id);
    }
}
