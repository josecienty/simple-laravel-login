import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

type AvatarColors = {
    backgroundColor: string;
    color: string;
};

const AVATAR_COLORS: AvatarColors[] = [
    { backgroundColor: '#6366f1', color: '#ffffff' }, // índigo
    { backgroundColor: '#10b981', color: '#ffffff' }, // esmeralda
    { backgroundColor: '#f59e0b', color: '#1b1e26' }, // ámbar
    { backgroundColor: '#ef4444', color: '#ffffff' }, // rojo
    { backgroundColor: '#0ea5e9', color: '#ffffff' }, // cielo
    { backgroundColor: '#8b5cf6', color: '#ffffff' }, // violeta
    { backgroundColor: '#14b8a6', color: '#ffffff' }, // teal
    { backgroundColor: '#f43f5e', color: '#ffffff' }, // rosa
    { backgroundColor: '#f97316', color: '#ffffff' }, // naranja
    { backgroundColor: '#22c55e', color: '#1b1e26' }, // verde
    { backgroundColor: '#06b6d4', color: '#ffffff' }, // cian
    { backgroundColor: '#a855f7', color: '#ffffff' }, // púrpura
    { backgroundColor: '#eab308', color: '#1b1e26' }, // amarillo
    { backgroundColor: '#3b82f6', color: '#ffffff' }, // azul
    { backgroundColor: '#ec4899', color: '#ffffff' }, // rosa fuerte
    { backgroundColor: '#84cc16', color: '#1b1e26' }, // lima
    { backgroundColor: '#0891b2', color: '#ffffff' }, // cian oscuro
    { backgroundColor: '#d946ef', color: '#ffffff' }, // fucsia
    { backgroundColor: '#e11d48', color: '#ffffff' }, // carmesí
    { backgroundColor: '#0284c7', color: '#ffffff' }, // azul profundo
];

/**
 * Colores deterministas para un avatar según el nombre: el mismo
 * nombre siempre recibe el mismo color, y nombres distintos reciben
 * colores distintos (no monotónicos).
 *
 * Se usa el hash FNV-1a (mejor distribución que el anterior *31), que
 * evita que nombres comunes compartan color.
 */
export function avatarColors(name: string): AvatarColors {
    let hash = 0x811c9dc5;

    for (let i = 0; i < name.length; i++) {
        hash ^= name.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
    }

    return AVATAR_COLORS[(hash >>> 0) % AVATAR_COLORS.length];
}
