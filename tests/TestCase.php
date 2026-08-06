<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Fortify\Features;

abstract class TestCase extends BaseTestCase
{
    /**
     * PHPUnit (phpunit.xml) solo actualiza putenv()/$_ENV, pero Dotenv
     * (ServerConstAdapter) lee $_SERVER antes, y $_SERVER hereda los valores
     * de .env del proceso artisan. Al forzar aquí el entorno de testing se
     * evita que el middleware CSRF siga activo en los tests (respuestas 419)
     * y que RefreshDatabase borre la base de datos de desarrollo.
     */
    public function createApplication()
    {
        $_SERVER['APP_ENV'] = 'testing';
        $_SERVER['DB_DATABASE'] = 'login_test';
        $_SERVER['SESSION_DRIVER'] = 'array';
        $_SERVER['CACHE_STORE'] = 'array';
        $_SERVER['QUEUE_CONNECTION'] = 'sync';
        $_SERVER['MAIL_MAILER'] = 'array';
        $_SERVER['BROADCAST_CONNECTION'] = 'null';

        return parent::createApplication();
    }

    protected function skipUnlessFortifyHas(string $feature, ?string $message = null): void
    {
        if (! Features::enabled($feature)) {
            $this->markTestSkipped($message ?? "Fortify feature [{$feature}] is not enabled.");
        }
    }
}
