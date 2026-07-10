import { Head, router } from '@inertiajs/react'
import { } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2 } from 'lucide-react'
import Heading from '@/components/heading'
import { } from '@/components/ui/breadcrumb'
import users from '@/routes/users'
import { User } from '@/types'

interface Props {
    users: {
        data: User[]
    }
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Listado de usuarios',
            href: users.index(),
        },
    ],
}

const edit = (user: User) => {
    router.visit(users.edit(user))
}

const nuevo = () =>{
    router.visit(users.create())
}

export default function UsersIndex({ users }: Props) {
    return <>
        <Head title="Listado de usuarios" />

        <div className="w-full p-4">
            <div className="max-w-[1800px] mx-auto space-y-6">
                <h1 className="sr-only">Listado de usuarios</h1>
                <Heading
                    variant="small"
                    title="Usuarios"
                    description="Listado de usuarios registrados en la plataforma"
                />
                <button
                    onClick={() => nuevo()}
                    type="button"
                    data-slot="button"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[&gt;svg]:px-3"
                >
                    Registrar usuario
                </button>

                <div className="mb-4">
                    <Input
                        placeholder="Buscar usuario..."
                    />
                </div>

                <TableData users={users.data} />

            </div>
        </div>
    </>

}

const TableData = ({ users }: { users: User[] }) => {
    return <>
        <Table>
            <TableHeader>
                <TableRow>

                    <TableHead>
                        Nombre y Apellido
                    </TableHead>

                    <TableHead>
                        Correo
                    </TableHead>

                    <TableHead>
                        Estado
                    </TableHead>

                    <TableHead>
                        Fecha de registro
                    </TableHead>

                    <TableHead className="text-right">
                        Acciones
                    </TableHead>

                </TableRow>
            </TableHeader>


            <TableBody>
                {users.map(user => (
                    <TableRow key={user.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                    {user.name.charAt(0)}
                                </div>

                                <span className="font-medium">
                                    {user.name}
                                </span>
                            </div>
                        </TableCell>

                        <TableCell>
                            {user.email}
                        </TableCell>

                        <TableCell>
                            {user.email_verified_at ? (
                                <Badge>
                                    Verificado
                                </Badge>
                            ) : (
                                <Badge variant="secondary">
                                    Pendiente
                                </Badge>
                            )}
                        </TableCell>

                        <TableCell>
                            {user.created_at}
                        </TableCell>

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
}