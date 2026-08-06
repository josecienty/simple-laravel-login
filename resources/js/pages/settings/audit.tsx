import { Head, Link, router } from '@inertiajs/react';
import { FilterX, Search } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { index } from '@/routes/audit';

type AuditLogItem = {
    id: number;
    user_id: number | null;
    action: string;
    description: string | null;
    details: {
        route?: string;
        url?: string;
        path?: string;
        status?: number;
    } | null;
    ip_address: string | null;
    created_at: string;
    user: { name: string; email: string } | null;
};

type PaginatedLogs = {
    data: AuditLogItem[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
};

type Filters = {
    action?: string | null;
    user?: string | null;
    from?: string | null;
    to?: string | null;
};

type Props = {
    logs: PaginatedLogs;
    actions: string[];
    filters: Filters;
};

const TITLE = 'Registro de auditoría';

const ACTION_GROUPS: { label: string; match: (action: string) => boolean }[] = [
    {
        label: 'Autenticación',
        match: (action) =>
            action.startsWith('login') ||
            action === 'logout' ||
            action === 'register' ||
            action.startsWith('email.') ||
            action === 'password.reset',
    },
    {
        label: 'Visitas',
        match: (action) => action.startsWith('visit'),
    },
    {
        label: 'Acceso',
        match: (action) => action === 'access.denied',
    },
    {
        label: 'Usuarios y perfiles',
        match: (action) =>
            action.startsWith('user') || action.startsWith('profile'),
    },
    {
        label: 'Sesiones',
        match: (action) => action.startsWith('session'),
    },
    {
        label: 'Contraseña',
        match: (action) =>
            action.startsWith('password') && action !== 'password.reset',
    },
];

export default function Audit({
    logs,
    actions,
    filters: initialFilters,
}: Props) {
    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [userQuery, setUserQuery] = useState(initialFilters.user ?? '');

    const applyFilters = (overrides: Partial<Filters>) => {
        const next = { ...filters, ...overrides };
        setFilters(next);

        const params: Record<string, string> = {};

        if (next.action) {
            params.action = next.action;
        }

        if (next.user) {
            params.user = next.user;
        }

        if (next.from) {
            params.from = next.from;
        }

        if (next.to) {
            params.to = next.to;
        }

        router.get(index(), params, {
            preserveState: true,
            replace: true,
        });
    };

    const searchUser = () => {
        applyFilters({ user: userQuery || undefined });
    };

    const clearFilters = () => {
        setUserQuery('');
        applyFilters({
            action: undefined,
            user: undefined,
            from: undefined,
            to: undefined,
        });
    };

    const hasFilters = Boolean(
        filters.action || filters.user || filters.from || filters.to,
    );

    const prevUrl = logs.links[0]?.url ?? null;
    const nextUrl = logs.links[logs.links.length - 1]?.url ?? null;
    const pageLinks = logs.links.slice(1, -1);

    return (
        <>
            <Head title={TITLE} />

            <h1 className="sr-only">{TITLE}</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={TITLE}
                    description="Historial de logins, visitas, operaciones CRUD y eventos de seguridad."
                />

                {/* Filtros */}
                <div className="rounded-xl border bg-muted/20 p-4">
                    <div className="flex flex-wrap items-end gap-3">
                        <div className="grid min-w-56 flex-1 gap-1.5">
                            <Label htmlFor="audit-action">Evento</Label>
                            <Select
                                value={filters.action ?? 'all'}
                                onValueChange={(value) =>
                                    applyFilters({
                                        action:
                                            value === 'all' ? undefined : value,
                                    })
                                }
                            >
                                <SelectTrigger id="audit-action">
                                    <SelectValue placeholder="Todos los eventos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Todos los eventos
                                    </SelectItem>

                                    {ACTION_GROUPS.map((group) => {
                                        const items = actions.filter(
                                            group.match,
                                        );

                                        if (items.length === 0) {
                                            return null;
                                        }

                                        return (
                                            <SelectGroup key={group.label}>
                                                <SelectLabel>
                                                    {group.label}
                                                </SelectLabel>
                                                {items.map((action) => (
                                                    <SelectItem
                                                        key={action}
                                                        value={action}
                                                    >
                                                        {action}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid min-w-56 flex-1 gap-1.5">
                            <Label htmlFor="audit-user">Usuario</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="audit-user"
                                    placeholder="Nombre o correo"
                                    value={userQuery}
                                    onChange={(event) =>
                                        setUserQuery(event.target.value)
                                    }
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            searchUser();
                                        }
                                    }}
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={searchUser}
                                    title="Buscar"
                                >
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="audit-from">Desde</Label>
                            <Input
                                id="audit-from"
                                type="date"
                                defaultValue={filters.from ?? ''}
                                onChange={(event) =>
                                    applyFilters({
                                        from: event.target.value || undefined,
                                    })
                                }
                            />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="audit-to">Hasta</Label>
                            <Input
                                id="audit-to"
                                type="date"
                                defaultValue={filters.to ?? ''}
                                onChange={(event) =>
                                    applyFilters({
                                        to: event.target.value || undefined,
                                    })
                                }
                            />
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={!hasFilters}
                            onClick={clearFilters}
                        >
                            <FilterX className="h-4 w-4" />
                            Limpiar
                        </Button>
                    </div>
                </div>

                {/* Tabla */}
                <div className="overflow-hidden rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Evento</TableHead>
                                <TableHead>Detalle</TableHead>
                                <TableHead>Ruta</TableHead>
                                <TableHead>IP</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {logs.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="py-6 text-center text-muted-foreground"
                                    >
                                        No hay registros de auditoría.
                                    </TableCell>
                                </TableRow>
                            )}

                            {logs.data.map((log) => {
                                const meta = actionMeta(log.action);
                                const link = log.details?.url ?? null;
                                const path = log.details?.path ?? null;

                                return (
                                    <TableRow key={log.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {log.created_at}
                                        </TableCell>

                                        <TableCell>
                                            {log.user ? (
                                                <span className="font-medium">
                                                    {log.user.name}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    Invitado
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <Badge className={meta.className}>
                                                {meta.label}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="max-w-[280px] truncate">
                                            {log.description ?? '—'}
                                        </TableCell>

                                        <TableCell className="max-w-[220px]">
                                            {path ? (
                                                <span
                                                    className="block truncate font-mono text-xs text-primary"
                                                    title={link ?? path}
                                                >
                                                    /{path}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {log.ip_address ?? '—'}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

                {/* Paginación */}
                {logs.last_page > 1 && (
                    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                        <p className="text-sm text-muted-foreground">
                            Mostrando {logs.from ?? 0}–{logs.to ?? 0} de{' '}
                            {logs.total} registros
                        </p>

                        <div className="flex flex-wrap items-center gap-1">
                            <PageButton href={prevUrl}>
                                <span aria-hidden>‹</span> Anterior
                            </PageButton>

                            {pageLinks.map((link, linkIndex) =>
                                link.url ? (
                                    <PageButton
                                        key={`${link.label}-${linkIndex}`}
                                        href={link.url}
                                        active={link.active}
                                    >
                                        {link.label}
                                    </PageButton>
                                ) : (
                                    <span
                                        key={`${link.label}-${linkIndex}`}
                                        className="px-1 text-sm text-muted-foreground"
                                    >
                                        …
                                    </span>
                                ),
                            )}

                            <PageButton href={nextUrl}>
                                Siguiente <span aria-hidden>›</span>
                            </PageButton>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function PageButton({
    href,
    active = false,
    children,
}: {
    href: string | null;
    active?: boolean;
    children: ReactNode;
}) {
    if (href) {
        return (
            <Button variant={active ? 'default' : 'outline'} size="sm" asChild>
                <Link href={href}>{children}</Link>
            </Button>
        );
    }

    return (
        <Button variant="outline" size="sm" disabled>
            {children}
        </Button>
    );
}

function actionMeta(action: string): { label: string; className: string } {
    if (action.startsWith('login.success')) {
        return {
            label: 'Login',
            className:
                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        };
    }

    if (action.startsWith('login.failed') || action === 'access.denied') {
        return {
            label: 'Acceso fallido',
            className:
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        };
    }

    if (action.startsWith('session')) {
        return {
            label: 'Sesión',
            className:
                'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        };
    }

    if (action.startsWith('user') || action.startsWith('profile')) {
        return {
            label: 'CRUD',
            className:
                'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
        };
    }

    if (action.startsWith('password')) {
        return {
            label: 'Contraseña',
            className:
                'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
        };
    }

    if (action.startsWith('visit')) {
        return {
            label: 'Visita',
            className: 'bg-muted text-muted-foreground',
        };
    }

    return { label: action, className: '' };
}

Audit.layout = {
    breadcrumbs: [
        {
            title: TITLE,
            href: index(),
        },
    ],
};
