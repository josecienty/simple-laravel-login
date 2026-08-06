<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Auditoría habilitada
    |--------------------------------------------------------------------------
    |
    | Controla si el sistema registra eventos de auditoría (logins, visitas,
    | operaciones CRUD, sesiones, etc.). Pon AUDIT_ENABLED=false en tu .env
    | para desactivar todo el registro de auditoría.
    |
    */

    'enabled' => (bool) env('AUDIT_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Registro de visitas
    |--------------------------------------------------------------------------
    |
    | Registra cada visita a una página con nombre de ruta. Es el evento más
    | ruidoso; desactívalo con AUDIT_LOG_VISITS=false si solo te interesan
    | logins, operaciones CRUD y eventos de seguridad.
    |
    */

    'log_visits' => (bool) env('AUDIT_LOG_VISITS', true),

];
