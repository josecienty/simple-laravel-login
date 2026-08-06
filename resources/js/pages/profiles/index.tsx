import { Head, router, usePage } from '@inertiajs/react';
import { NiceAlert } from '@josecienty/nice-alert';
import { useEffect } from 'react';
import '@josecienty/nice-alert/style.css';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UsersModuleTabs } from '@/components/users-module-tabs';
import profilesRoute from '@/routes/profiles';
import users from '@/routes/users';
import type { Profile } from '@/types';

interface Flash {
    success?: string;
    error?: string;
}

interface Props {
    profiles: Profile[];
}

export default function ProfilesIndex({ profiles }: Props) {
    const { flash } = usePage<{ flash: Flash }>().props;

    // Muestra un toast cuando el backend devuelve un mensaje flash
    // (por ejemplo, después de eliminar un perfil)
    useEffect(() => {
        if (flash?.success) {
            NiceAlert.toast({
                icon: 'success',
                title: flash.success,
            });
        }

        if (flash?.error) {
            NiceAlert.toast({
                icon: 'error',
                title: flash.error,
            });
        }
    }, [flash]);

    const nuevo = () => {
        router.visit(profilesRoute.create());
    };

    const editar = (profile: Profile) => {
        router.visit(profilesRoute.edit(profile));
    };

    const handleDelete = async (profile: Profile) => {
        const result = await NiceAlert.fire({
            icon: 'warning',
            title: `¿Eliminar "${profile.name}"?`,
            text: 'Esta acción no se puede deshacer.',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (!result.isConfirmed) {
            return;
        }

        router.delete(profilesRoute.destroy(profile.id), {
            preserveScroll: true,
            onError: () => {
                NiceAlert.toast({
                    icon: 'error',
                    title: 'No se pudo eliminar el perfil',
                });
            },
        });
    };

    return (
        <>
            <Head title="Perfiles" />

            <div className="w-full p-4">
                <div className="mx-auto max-w-[1800px] space-y-6">
                    <h1 className="sr-only">Perfiles</h1>

                    <Heading
                        variant="small"
                        title="Perfiles"
                        description="Tipos de perfil que se asignan a los usuarios de la plataforma"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <UsersModuleTabs />

                        <Button onClick={nuevo}>Nuevo perfil</Button>
                    </div>

                    <div className="overflow-hidden rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-left">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        Nombre
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Usuarios
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Orden
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Estado
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {profiles.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-6 text-center text-muted-foreground"
                                        >
                                            No hay perfiles registrados.
                                        </td>
                                    </tr>
                                )}

                                {profiles.map((profile) => (
                                    <tr key={profile.id} className="border-t">
                                        <td className="px-4 py-3 font-medium">
                                            {profile.name}
                                        </td>

                                        <td className="px-4 py-3">
                                            {profile.users_count ? (
                                                <Badge>
                                                    {profile.users_count}{' '}
                                                    {profile.users_count === 1
                                                        ? 'usuario'
                                                        : 'usuarios'}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    Sin usuarios
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            {profile.order}
                                        </td>

                                        <td className="px-4 py-3">
                                            <span
                                                className={
                                                    profile.status
                                                        ? 'inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }
                                            >
                                                {profile.status
                                                    ? 'Activo'
                                                    : 'Inactivo'}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        editar(profile)
                                                    }
                                                >
                                                    Editar
                                                </Button>{' '}
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    disabled={
                                                        !!profile.users_count
                                                    }
                                                    title={
                                                        profile.users_count
                                                            ? 'Reasigne sus usuarios antes de eliminar este perfil'
                                                            : undefined
                                                    }
                                                    onClick={() =>
                                                        handleDelete(profile)
                                                    }
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

ProfilesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Usuarios',
            href: users.index(),
        },
        {
            title: 'Perfiles',
            href: profilesRoute.index(),
        },
    ],
};
