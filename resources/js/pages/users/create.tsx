import { Head } from '@inertiajs/react';
import { UsersModuleTabs } from '@/components/users-module-tabs';
import users from '@/routes/users';
import type { Profile } from '@/types';
import UserForm from './_components/form';

interface Props {
    profiles: Profile[];
}

export default function CreateUsuario({ profiles }: Props) {
    return (
        <>
            <Head title="Registrar usuario" />

            <div className="flex w-full">
                <div className="mx-auto w-full space-y-6 p-6 md:max-w-xl">
                    <UsersModuleTabs />

                    <UserForm profiles={profiles} />
                </div>
            </div>
        </>
    );
}

CreateUsuario.layout = {
    breadcrumbs: [
        {
            title: 'Listado de usuarios',
            href: users.index(),
        },
        {
            title: 'Registrar usuario',
            href: users.create(),
        },
    ],
};
