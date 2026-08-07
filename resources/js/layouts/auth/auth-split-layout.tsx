import { Link, usePage } from '@inertiajs/react';
import { MonitorSmartphone, ScrollText, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';

type Feature = {
    icon: LucideIcon;
    title: string;
    description: string;
};

const features: Feature[] = [
    {
        icon: ShieldCheck,
        title: 'Acceso protegido',
        description:
            'Rate limiting y protección contra fuerza bruta en cada intento.',
    },
    {
        icon: ScrollText,
        title: 'Auditoría completa',
        description:
            'Cada acceso, error y cambio queda registrado en el sistema.',
    },
    {
        icon: MonitorSmartphone,
        title: 'Sesiones activas',
        description:
            'Revisa y cierra tus sesiones desde cualquier dispositivo.',
    },
];

export default function AuthSplitLayout({
    children,
    title,
    description,
}: {
    children?: ReactNode;
    title?: string;
    description?: string;
}) {
    const { name } = usePage().props;

    return (
        <div className="min-h-svh bg-background lg:grid lg:grid-cols-[1.05fr_1fr]">
            {/* Panel visual (solo escritorio) */}
            <div className="relative hidden overflow-y-auto bg-slate-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
                {/* Fondo degradado + orbes de luz */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-[#0b1220] to-slate-950" />
                <div className="absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-indigo-500/25 blur-3xl" />
                <div className="absolute -right-32 -bottom-40 h-[30rem] w-[30rem] rounded-full bg-cyan-500/15 blur-3xl" />
                <div className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />

                {/* Rejilla sutil */}
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, rgb(255 255 255 / 0.6) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.6) 1px, transparent 1px)',
                        backgroundSize: '44px 44px',
                    }}
                />

                {/* Marca */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 shadow-lg ring-1 ring-white/15 backdrop-blur">
                        <AppLogoIcon className="size-6 fill-current text-white" />
                    </div>
                    <span className="text-lg font-semibold tracking-tight text-white">
                        {name}
                    </span>
                </div>

                {/* Mensaje + características */}
                <div className="relative z-10 max-w-md space-y-8">
                    <div className="space-y-3">
                        <h2 className="text-3xl leading-tight font-semibold tracking-tight text-white">
                            Bienvenido a tu panel de administración
                        </h2>
                        <p className="text-sm leading-relaxed text-white/60">
                            Gestiona usuarios, perfiles y la seguridad de tu
                            plataforma desde un solo lugar.
                        </p>
                    </div>

                    <ul className="space-y-4">
                        {features.map(
                            ({
                                icon: Icon,
                                title: featureTitle,
                                description: featureDescription,
                            }) => (
                                <li
                                    key={featureTitle}
                                    className="flex items-start gap-3"
                                >
                                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                                        <Icon className="size-4 text-cyan-300" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-white">
                                            {featureTitle}
                                        </p>
                                        <p className="text-xs leading-relaxed text-white/50">
                                            {featureDescription}
                                        </p>
                                    </div>
                                </li>
                            ),
                        )}
                    </ul>
                </div>

                {/* Pie */}
                <p className="relative z-10 text-xs text-white/35">
                    © {new Date().getFullYear()} {name}. Todos los derechos
                    reservados.
                </p>
            </div>

            {/* Panel del formulario */}
            <div className="flex min-h-svh items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <Link
                        href={home()}
                        className="mb-8 flex items-center justify-center lg:hidden"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                            <AppLogoIcon className="size-6 fill-current" />
                        </div>
                    </Link>

                    <div className="mb-8 space-y-2 text-center lg:text-left">
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            {title}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
