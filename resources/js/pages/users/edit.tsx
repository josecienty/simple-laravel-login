import { Head } from '@inertiajs/react'
import UserForm from './_components/form'
import { User } from '@/types'
import users from '@/routes/users'

interface Props {
    user: User
}


export default function EditForm({ user }: Props) {
    return <>
        <Head title="Editar usuario" />

        <div className="w-full flex">
            <div className="mx-auto max-w-xl p-6">
                <UserForm user={user} />
            </div>
        </div>
    </>
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
}