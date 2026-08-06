import { Form, Head, router, usePage } from '@inertiajs/react';
import { NiceAlert } from '@josecienty/nice-alert';
import {
    Globe,
    Laptop,
    LogOut,
    Monitor,
    MonitorSmartphone,
    Smartphone,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import '@josecienty/nice-alert/style.css';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { edit } from '@/routes/security';
import sessions from '@/routes/sessions';

type BrowserSession = {
    id: string;
    ip_address: string | null;
    agent: {
        browser: string;
        platform: string;
        is_mobile: boolean;
    };
    last_active: string;
    is_current_device: boolean;
};

type Flash = {
    success?: string;
    error?: string;
};

type Props = {
    passwordRules: string;
    sessions: BrowserSession[];
};

const TITLE = 'Configuraciones de Seguridad';

export default function Security(props: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const { flash } = usePage<{ flash: Flash }>().props;

    useEffect(() => {
        if (flash?.success) {
            NiceAlert.toast({ icon: 'success', title: flash.success });
        }

        if (flash?.error) {
            NiceAlert.toast({ icon: 'error', title: flash.error });
        }
    }, [flash]);

    const revoke = async (session: BrowserSession) => {
        const result = await NiceAlert.fire({
            icon: 'warning',
            title: '¿Cerrar esta sesión?',
            text: 'El dispositivo dejará de tener acceso a tu cuenta.',
            showCancelButton: true,
            confirmButtonText: 'Sí, cerrar',
            cancelButtonText: 'Cancelar',
        });

        if (!result.isConfirmed) {
            return;
        }

        router.delete(sessions.destroy(session.id), {
            preserveScroll: true,
        });
    };

    const revokeOthers = async () => {
        const result = await NiceAlert.fire({
            icon: 'warning',
            title: '¿Cerrar todas las demás sesiones?',
            text: 'Se cerrará tu sesión en todos los demás dispositivos.',
            showCancelButton: true,
            confirmButtonText: 'Sí, cerrar todo',
            cancelButtonText: 'Cancelar',
        });

        if (!result.isConfirmed) {
            return;
        }

        router.delete(sessions.destroyOthers(), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={TITLE} />

            <h1 className="sr-only">{TITLE}</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Actualizar tu contraseña"
                    description="Asegúrate de que tu cuenta utilice una contraseña larga y aleatoria para mantenerla segura."
                />

                <Form
                    {...SecurityController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    resetOnError={[
                        'password',
                        'password_confirmation',
                        'current_password',
                    ]}
                    resetOnSuccess
                    onError={(errors) => {
                        if (errors.password) {
                            passwordInput.current?.focus();
                        }

                        if (errors.current_password) {
                            currentPasswordInput.current?.focus();
                        }
                    }}
                    className="space-y-6"
                >
                    {({ errors, processing }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="current_password">
                                    Contraseña actual
                                </Label>

                                <PasswordInput
                                    id="current_password"
                                    ref={currentPasswordInput}
                                    name="current_password"
                                    className="mt-1 block w-full"
                                    autoComplete="current-password"
                                    placeholder="Contraseña actual"
                                />

                                <InputError message={errors.current_password} />
                            </div>
                            <hr />
                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    Nueva Contraseña
                                </Label>

                                <PasswordInput
                                    id="password"
                                    ref={passwordInput}
                                    name="password"
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    placeholder="Nueva Contraseña"
                                    passwordrules={props.passwordRules}
                                />

                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirmar contraseña
                                </Label>

                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    placeholder="Confirmar contraseña"
                                    passwordrules={props.passwordRules}
                                />

                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-password-button"
                                >
                                    Guardar
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <hr />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Sesiones activas"
                    description="Si ves algo que no reconoces, cierra esa sesión y cambia tu contraseña."
                />

                <div className="space-y-3">
                    {props.sessions.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            No hay sesiones activas.
                        </p>
                    )}

                    {props.sessions.map((session) => (
                        <div
                            key={session.id}
                            className={cn(
                                'flex items-center justify-between gap-3 rounded-xl border p-4',
                                session.is_current_device &&
                                    'border-primary/40 bg-primary/5',
                            )}
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <span
                                    className={cn(
                                        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset',
                                        session.is_current_device
                                            ? 'bg-primary/10 text-primary ring-primary/20'
                                            : 'bg-muted text-muted-foreground ring-border',
                                    )}
                                >
                                    <SessionIcon agent={session.agent} />
                                </span>

                                <div className="min-w-0">
                                    <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                                        {session.agent.browser} ·{' '}
                                        {session.agent.platform}
                                        {session.is_current_device && (
                                            <Badge>Este dispositivo</Badge>
                                        )}
                                    </p>

                                    <p className="truncate text-xs text-muted-foreground">
                                        {session.ip_address ?? 'IP desconocida'}{' '}
                                        · {session.last_active}
                                    </p>
                                </div>
                            </div>

                            {!session.is_current_device && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="shrink-0 text-destructive hover:text-destructive"
                                    onClick={() => revoke(session)}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Cerrar
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                {props.sessions.length > 1 && (
                    <Button variant="outline" size="sm" onClick={revokeOthers}>
                        <MonitorSmartphone className="h-4 w-4" />
                        Cerrar todas las demás sesiones
                    </Button>
                )}
            </div>
        </>
    );
}

function SessionIcon({ agent }: { agent: BrowserSession['agent'] }) {
    let Icon: LucideIcon = Globe;

    if (agent.is_mobile) {
        Icon = Smartphone;
    } else if (agent.platform === 'Windows') {
        Icon = Monitor;
    } else if (agent.platform === 'macOS' || agent.platform === 'Linux') {
        Icon = Laptop;
    }

    return <Icon className="h-4 w-4" />;
}

Security.layout = {
    breadcrumbs: [
        {
            title: TITLE,
            href: edit(),
        },
    ],
};
