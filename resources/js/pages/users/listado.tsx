import { Head } from '@inertiajs/react'
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
import {  } from '@/components/ui/breadcrumb'
import users from '@/routes/users'

interface User {
    id: number
    name: string
    email: string
    email_verified_at: string | null
    created_at: string
}

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

                <div className="mb-4">
                    <Input
                        placeholder="Buscar usuario..."
                    />
                </div>


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
                        {users.data.map(user => (

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
            </div>
        </div>
    </>

}