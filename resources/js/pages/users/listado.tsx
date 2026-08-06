import { Head, router } from '@inertiajs/react';
import NiceAlert from '@josecienty/nice-alert';
import { Pencil, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { UsersModuleTabs } from '@/components/users-module-tabs';
import { avatarColors } from '@/lib/utils';
import users from '@/routes/users';
import type { User } from '@/types';

interface Props {
    users: {
        data: User[];
    };
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Listado de usuarios',
            href: users.index(),
        },
    ],
};

const edit = (user: User) => {
    router.visit(users.edit(user));
};

const nuevo = () => {
    router.visit(users.create());
};

const eliminar = (user: User) => {
    router.delete(users.destroy(user.id));
};

export default function UsersIndex({ users }: Props) {
    return (
        <>
            <Head title="Listado de usuarios" />

            <div className="w-full p-4">
                <div className="mx-auto max-w-[1800px] space-y-6">
                    <h1 className="sr-only">Listado de usuarios</h1>
                    <Heading
                        variant="small"
                        title="Usuarios"
                        description="Listado de usuarios registrados en la plataforma"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <UsersModuleTabs />

                        <Button onClick={() => nuevo()}>
                            Registrar usuario
                        </Button>
                    </div>

                    <div className="mb-4">
                        <Input placeholder="Buscar usuario..." />
                    </div>

                    <TableData users={users.data} />
                </div>
            </div>
        </>
    );
}

const TableData = ({ users }: { users: User[] }) => {
    const goodByeUser = async (user: User) => {
        const { isConfirmed } = await NiceAlert.fire({
            title: '¿Estas seguro?',
            text: `Estas a punto de eliminar a ${user.name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (!isConfirmed) {
            return;
        }

        const resu = await eliminar(user);
        console.log(resu);

        NiceAlert.fire({
            icon: 'success',
            title: `Se elimino a ${user.name} con exito`,
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
        });
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre y Apellido</TableHead>

                        <TableHead>Correo</TableHead>

                        <TableHead>Perfil</TableHead>

                        <TableHead>Estado</TableHead>

                        <TableHead>Fecha de registro</TableHead>

                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex h-9 w-9 items-center justify-center rounded-full font-semibold"
                                        style={avatarColors(user.name)}
                                    >
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>

                                    <span className="font-medium">
                                        {user.name}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell>{user.email}</TableCell>

                            <TableCell>
                                {user.profile ? (
                                    <Badge variant="outline">
                                        {user.profile.name}
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary">
                                        Sin perfil
                                    </Badge>
                                )}
                            </TableCell>

                            <TableCell>
                                {user.email_verified_at ? (
                                    <Badge>Verificado</Badge>
                                ) : (
                                    <Badge variant="secondary">Pendiente</Badge>
                                )}
                            </TableCell>

                            <TableCell>{user.created_at}</TableCell>

                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        onClick={() => edit(user)}
                                        size="icon"
                                        variant="outline"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        onClick={() => goodByeUser(user)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};
