import { Head } from '@inertiajs/react';
import { UsersModuleTabs } from '@/components/users-module-tabs';
import users from '@/routes/users';
import type { User, Profile } from '@/types';
import UserForm from './_components/form';

interface Props {
    user: User;
    profiles: Profile[];
}

export default function EditForm({ user, profiles }: Props) {
    return (
        <>
            <Head title="Editar usuario" />

            <div className="flex w-full">
                <div className="mx-auto w-full space-y-6 p-6 md:max-w-xl">
                    <UsersModuleTabs />

                    <UserForm user={user} profiles={profiles} />
                </div>
            </div>
        </>
    );
}

EditForm.layout = {
    breadcrumbs: [
        {
            title: 'Listado de usuarios',
            href: users.index(),
        },
        {
            title: 'Editar usuario',
        },
    ],
};
