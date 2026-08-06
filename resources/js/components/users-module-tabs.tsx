import { Link } from '@inertiajs/react';
import { Tags, Users } from 'lucide-react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import profiles from '@/routes/profiles';
import users from '@/routes/users';

const tabs = [
    {
        key: 'users',
        label: 'Usuarios',
        href: users.index(),
        icon: Users,
    },
    {
        key: 'profiles',
        label: 'Perfiles',
        href: profiles.index(),
        icon: Tags,
    },
];

/**
 * Pestañas del módulo de usuarios: permite alternar entre el
 * listado de usuarios y la gestión de perfiles.
 */
export function UsersModuleTabs() {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    const active = isCurrentOrParentUrl(profiles.index())
        ? 'profiles'
        : 'users';

    return (
        <div className="inline-flex items-center gap-1 rounded-lg border bg-muted/50 p-1">
            {tabs.map(({ key, label, href, icon: Icon }) => {
                const isActive = active === key;

                return (
                    <Link
                        key={key}
                        href={href}
                        className={cn(
                            'inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
                            isActive
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        {label}
                    </Link>
                );
            })}
        </div>
    );
}
