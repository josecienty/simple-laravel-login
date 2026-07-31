import { Head } from "@inertiajs/react"
import UserForm from "./_components/form"
import users from "@/routes/users"

export default function CreateUsuario() {
    return <>
        <Head title="Registrar usuario" />

        <div className="w-full flex">
            <div className="mx-auto w-full md:max-w-xl p-6">
                <UserForm />
            </div>
        </div>
    </>
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
}