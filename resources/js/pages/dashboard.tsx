import { Head, Link } from '@inertiajs/react';
import type { InertiaLinkProps } from '@inertiajs/react';
import {
    ArrowUpRight,
    BadgeCheck,
    CalendarDays,
    ShieldCheck,
    Tags,
    Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMemo } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { avatarColors } from '@/lib/utils';
import { dashboard } from '@/routes';
import profiles from '@/routes/profiles';
import users from '@/routes/users';
import type { Profile, User } from '@/types';

interface Stats {
    total_users: number;
    verified_users: number;
    users_without_profile: number;
    total_profiles: number;
    active_profiles: number;
}

interface Registration {
    date: string;
    label: string;
    total: number;
}

interface Props {
    stats: Stats;
    users_per_profile: Profile[];
    recent_users: User[];
    registrations: Registration[];
}

const CHART_COLORS = [
    '#6366f1',
    '#10b981',
    '#f59e0b',
    '#f43f5e',
    '#0ea5e9',
    '#8b5cf6',
    '#14b8a6',
];

const NO_PROFILE_COLOR = '#94a3b8';

const ACCENTS = {
    indigo: {
        chip: 'bg-indigo-500/10 text-indigo-600 ring-indigo-500/25 dark:text-indigo-400',
        border: 'hover:border-indigo-500/40',
        glow: 'from-indigo-500/20',
        value: 'text-indigo-600 dark:text-indigo-400',
    },
    emerald: {
        chip: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/25 dark:text-emerald-400',
        border: 'hover:border-emerald-500/40',
        glow: 'from-emerald-500/20',
        value: 'text-emerald-600 dark:text-emerald-400',
    },
    amber: {
        chip: 'bg-amber-500/10 text-amber-600 ring-amber-500/25 dark:text-amber-400',
        border: 'hover:border-amber-500/40',
        glow: 'from-amber-500/20',
        value: 'text-amber-600 dark:text-amber-400',
    },
    rose: {
        chip: 'bg-rose-500/10 text-rose-600 ring-rose-500/25 dark:text-rose-400',
        border: 'hover:border-rose-500/40',
        glow: 'from-rose-500/20',
        value: 'text-rose-600 dark:text-rose-400',
    },
} as const;

type AccentKey = keyof typeof ACCENTS;

export default function Dashboard({
    stats,
    users_per_profile,
    recent_users,
    registrations,
}: Props) {
    const totalUsers = stats.total_users;
    const profileCoverage = Math.round(
        ((totalUsers - stats.users_without_profile) / Math.max(totalUsers, 1)) *
            100,
    );

    const donutData = useMemo(() => {
        const rows = users_per_profile
            .map((profile, index) => ({
                name: profile.name,
                value: profile.users_count ?? 0,
                color: CHART_COLORS[index % CHART_COLORS.length],
            }))
            .filter((row) => row.value > 0);

        if (stats.users_without_profile > 0) {
            rows.push({
                name: 'Sin perfil',
                value: stats.users_without_profile,
                color: NO_PROFILE_COLOR,
            });
        }

        return rows;
    }, [users_per_profile, stats.users_without_profile]);

    const donutTotal = donutData.reduce((sum, row) => sum + row.value, 0);
    const totalRegistrations = registrations.reduce(
        (sum, row) => sum + row.total,
        0,
    );

    return (
        <>
            <Head title="Dashboard" />

            <div className="w-full p-3 sm:p-4">
                <div className="mx-auto max-w-[1800px] space-y-5 sm:space-y-6">
                    <h1 className="sr-only">Dashboard</h1>

                    <Heading
                        variant="small"
                        title="Dashboard"
                        description="Resumen general de usuarios y perfiles de la plataforma"
                    />

                    {/* Tarjetas de resumen */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                        <StatCard
                            title="Usuarios"
                            value={stats.total_users}
                            icon={Users}
                            description={`${stats.users_without_profile} sin perfil asignado`}
                            href={users.index()}
                            accent="indigo"
                        />

                        <StatCard
                            title="Verificados"
                            value={stats.verified_users}
                            icon={BadgeCheck}
                            description={`de ${stats.total_users} usuarios totales`}
                            accent="emerald"
                        />

                        <StatCard
                            title="Perfiles"
                            value={stats.total_profiles}
                            icon={Tags}
                            description={`${stats.active_profiles} activos`}
                            href={profiles.index()}
                            accent="amber"
                        />

                        <StatCard
                            title="Perfiles activos"
                            value={stats.active_profiles}
                            icon={ShieldCheck}
                            description={`de ${stats.total_profiles} perfiles totales`}
                            accent="rose"
                        />
                    </div>

                    <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                        {/* Donut: usuarios por perfil */}
                        <Card className="flex flex-col gap-4 py-4 sm:gap-6 sm:py-6">
                            <CardHeader className="px-4 sm:px-6">
                                <CardTitle>Usuarios por perfil</CardTitle>
                                <CardDescription>
                                    Distribución según el perfil asignado
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="flex flex-1 flex-col px-4 sm:px-6">
                                {donutData.length === 0 ? (
                                    <p className="py-10 text-center text-sm text-muted-foreground">
                                        Aún no hay datos para mostrar.
                                    </p>
                                ) : (
                                    <div className="flex flex-1 flex-col items-center justify-center gap-5 sm:flex-row sm:gap-6">
                                        <div
                                            role="img"
                                            aria-label="Distribución de usuarios por perfil"
                                            className="relative h-48 w-48 shrink-0 sm:h-56 sm:w-56"
                                        >
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <PieChart>
                                                    <Pie
                                                        data={donutData}
                                                        dataKey="value"
                                                        nameKey="name"
                                                        innerRadius={64}
                                                        outerRadius={88}
                                                        paddingAngle={3}
                                                        strokeWidth={0}
                                                    >
                                                        {donutData.map(
                                                            (row) => (
                                                                <Cell
                                                                    key={
                                                                        row.name
                                                                    }
                                                                    fill={
                                                                        row.color
                                                                    }
                                                                />
                                                            ),
                                                        )}
                                                    </Pie>
                                                    <Tooltip
                                                        content={
                                                            <DonutTooltip />
                                                        }
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>

                                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-2xl font-semibold tabular-nums sm:text-3xl">
                                                    {donutTotal}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    usuarios
                                                </span>
                                            </div>
                                        </div>

                                        <ul className="w-full max-w-xs space-y-2.5">
                                            {donutData.map((row) => (
                                                <li
                                                    key={row.name}
                                                    className="flex items-center justify-between gap-3 text-sm"
                                                >
                                                    <span className="inline-flex min-w-0 items-center gap-2 font-medium">
                                                        <span
                                                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    row.color,
                                                            }}
                                                        />
                                                        <span className="truncate">
                                                            {row.name}
                                                        </span>
                                                    </span>

                                                    <span className="shrink-0 text-muted-foreground">
                                                        {row.value} ·{' '}
                                                        {Math.round(
                                                            (row.value /
                                                                donutTotal) *
                                                                100,
                                                        )}
                                                        %
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Área: registros últimos 30 días */}
                        <Card className="gap-4 py-4 sm:gap-6 sm:py-6 lg:col-span-2">
                            <CardHeader className="flex-row items-center justify-between space-y-0 px-4 sm:px-6">
                                <div className="space-y-1.5">
                                    <CardTitle>Registros de usuarios</CardTitle>
                                    <CardDescription>
                                        Últimos 30 días · {totalRegistrations}{' '}
                                        en total
                                    </CardDescription>
                                </div>

                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/25 ring-inset dark:text-indigo-400">
                                    <CalendarDays className="h-4 w-4" />
                                </span>
                            </CardHeader>

                            <CardContent className="px-4 sm:px-6">
                                {totalRegistrations === 0 ? (
                                    <p className="py-10 text-center text-sm text-muted-foreground">
                                        Aún no hay registros en los últimos 30
                                        días.
                                    </p>
                                ) : (
                                    <div
                                        role="img"
                                        aria-label="Registros de usuarios en los últimos 30 días"
                                        className="h-52 sm:h-64"
                                    >
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <AreaChart
                                                data={registrations}
                                                margin={{
                                                    top: 8,
                                                    right: 8,
                                                    left: 0,
                                                    bottom: 0,
                                                }}
                                            >
                                                <defs>
                                                    <linearGradient
                                                        id="registrationsGradient"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="0%"
                                                            stopColor="#6366f1"
                                                            stopOpacity={0.35}
                                                        />
                                                        <stop
                                                            offset="100%"
                                                            stopColor="#6366f1"
                                                            stopOpacity={0.02}
                                                        />
                                                    </linearGradient>
                                                </defs>

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="var(--border)"
                                                    vertical={false}
                                                />

                                                <XAxis
                                                    dataKey="label"
                                                    tick={{
                                                        fill: 'var(--muted-foreground)',
                                                        fontSize: 11,
                                                    }}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    minTickGap={28}
                                                />

                                                <YAxis
                                                    width={36}
                                                    allowDecimals={false}
                                                    tick={{
                                                        fill: 'var(--muted-foreground)',
                                                        fontSize: 11,
                                                    }}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />

                                                <Tooltip
                                                    cursor={{
                                                        stroke: 'var(--border)',
                                                        strokeWidth: 1,
                                                    }}
                                                    content={
                                                        <RegistrationsTooltip />
                                                    }
                                                />

                                                <Area
                                                    type="monotone"
                                                    dataKey="total"
                                                    stroke="#6366f1"
                                                    strokeWidth={2.5}
                                                    fill="url(#registrationsGradient)"
                                                    activeDot={{ r: 5 }}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                        {/* Cobertura de perfiles */}
                        <Card className="flex flex-col gap-4 py-4 sm:gap-6 sm:py-6">
                            <CardHeader className="px-4 sm:px-6">
                                <CardTitle>Cobertura de perfiles</CardTitle>
                                <CardDescription>
                                    Usuarios con un perfil asignado
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="flex flex-1 flex-col items-center justify-center gap-5 px-4 sm:px-6">
                                <CoverageRing
                                    percentage={profileCoverage}
                                    color="#10b981"
                                />

                                <div className="grid w-full grid-cols-2 gap-3">
                                    <div className="rounded-lg bg-emerald-500/10 p-3 text-center ring-1 ring-emerald-500/20 ring-inset">
                                        <p className="text-xl font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                                            {totalUsers -
                                                stats.users_without_profile}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Con perfil
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-muted p-3 text-center ring-1 ring-border ring-inset">
                                        <p className="text-xl font-semibold text-muted-foreground tabular-nums">
                                            {stats.users_without_profile}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Sin perfil
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Últimos usuarios registrados */}
                        <Card className="gap-4 py-4 sm:gap-6 sm:py-6 lg:col-span-2">
                            <CardHeader className="flex-row items-center justify-between space-y-0 px-4 sm:px-6">
                                <div className="space-y-1.5">
                                    <CardTitle>
                                        Últimos usuarios registrados
                                    </CardTitle>
                                    <CardDescription>
                                        Los 5 usuarios más recientes de la
                                        plataforma
                                    </CardDescription>
                                </div>

                                <Link
                                    href={users.index()}
                                    className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                                >
                                    Ver todos
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </CardHeader>

                            <CardContent className="space-y-1 px-4 sm:px-6">
                                {recent_users.length === 0 && (
                                    <p className="py-6 text-center text-sm text-muted-foreground">
                                        Aún no hay usuarios registrados.
                                    </p>
                                )}

                                {recent_users.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                                    >
                                        <div
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                                            style={avatarColors(user.name)}
                                        >
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">
                                                {user.name}
                                            </p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {user.email ??
                                                    `@${user.username}`}
                                            </p>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-2">
                                            {user.profile ? (
                                                <Badge variant="outline">
                                                    {user.profile.name}
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    Sin perfil
                                                </Badge>
                                            )}
                                            <span className="hidden text-xs text-muted-foreground sm:block">
                                                {user.created_at}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

function StatCard({
    title,
    value,
    icon: Icon,
    description,
    href,
    accent,
}: {
    title: string;
    value: number;
    icon: LucideIcon;
    description: string;
    href?: NonNullable<InertiaLinkProps['href']>;
    accent: AccentKey;
}) {
    const style = ACCENTS[accent];

    const content = (
        <>
            <div
                className={`pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br to-transparent opacity-70 blur-2xl transition-opacity duration-300 group-hover:opacity-100 sm:-top-10 sm:-right-10 sm:h-32 sm:w-32 ${style.glow}`}
            />

            <div className="relative flex items-center justify-between">
                <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset sm:h-11 sm:w-11 sm:rounded-xl ${style.chip}`}
                >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>

                {href && (
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                )}
            </div>

            <div className="relative">
                <p
                    className={`text-2xl font-semibold tabular-nums sm:text-3xl ${style.value}`}
                >
                    {value}
                </p>
                <p className="mt-0.5 text-sm font-medium">{title}</p>
                <p className="mt-1 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                    {description}
                </p>
            </div>
        </>
    );

    const className = `group relative flex flex-col gap-3 overflow-hidden rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md sm:gap-4 sm:p-6 ${style.border}`;

    if (href) {
        return (
            <Link href={href} className={className}>
                {content}
            </Link>
        );
    }

    return <div className={className}>{content}</div>;
}

function CoverageRing({
    percentage,
    color,
}: {
    percentage: number;
    color: string;
}) {
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative h-32 w-32">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <defs>
                    <linearGradient
                        id="coverageGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <stop offset="0%" stopColor={color} />
                        <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                </defs>

                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth="10"
                />

                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="url(#coverageGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-700"
                />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-semibold tabular-nums">
                    {percentage}%
                </span>
                <span className="text-[10px] tracking-wider text-muted-foreground uppercase">
                    cobertura
                </span>
            </div>
        </div>
    );
}

function DonutTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: ReadonlyArray<{
        name?: string;
        value?: number | string;
        payload?: { color?: string };
    }>;
}) {
    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg">
            {payload.map((item, index) => (
                <div
                    key={index}
                    className="flex items-center gap-2 text-popover-foreground"
                >
                    <span
                        className="h-2 w-2 rounded-full"
                        style={{
                            backgroundColor: item.payload?.color,
                        }}
                    />
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground">
                        {item.value} usuario{item.value === 1 ? '' : 's'}
                    </span>
                </div>
            ))}
        </div>
    );
}

function RegistrationsTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: ReadonlyArray<{ value?: number | string }>;
    label?: string;
}) {
    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg">
            <p className="font-medium text-popover-foreground">{label}</p>
            <p className="text-muted-foreground">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {payload[0].value}
                </span>{' '}
                usuario{payload[0].value === 1 ? '' : 's'} registrado
                {payload[0].value === 1 ? '' : 's'}
            </p>
        </div>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
