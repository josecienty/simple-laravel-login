<?php

namespace App\Support;

class UserAgentParser
{
    /**
     * Extrae navegador y plataforma de un user agent.
     *
     * @return array{browser: string, platform: string, is_mobile: bool}
     */
    public static function parse(?string $userAgent): array
    {
        $ua = $userAgent ?? '';

        if (preg_match('/Windows/i', $ua)) {
            $platform = 'Windows';
        } elseif (preg_match('/Android/i', $ua)) {
            $platform = 'Android';
        } elseif (preg_match('/iPhone|iPad|iPod/i', $ua)) {
            $platform = 'iOS';
        } elseif (preg_match('/Mac OS X/i', $ua)) {
            $platform = 'macOS';
        } elseif (preg_match('/Linux/i', $ua)) {
            $platform = 'Linux';
        } else {
            $platform = 'Desconocido';
        }

        if (preg_match('/Edg\//', $ua)) {
            $browser = 'Edge';
        } elseif (preg_match('/OPR\//', $ua)) {
            $browser = 'Opera';
        } elseif (preg_match('/Chrome\//', $ua)) {
            $browser = 'Chrome';
        } elseif (preg_match('/Firefox\//', $ua)) {
            $browser = 'Firefox';
        } elseif (preg_match('/Safari\//', $ua)) {
            $browser = 'Safari';
        } else {
            $browser = 'Desconocido';
        }

        return [
            'browser' => $browser,
            'platform' => $platform,
            'is_mobile' => (bool) preg_match('/Android|iPhone|iPad|iPod|Mobile/i', $ua),
        ];
    }
}
