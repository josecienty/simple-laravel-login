import { Link, router } from '@inertiajs/react';
import { Moon, Settings, Sun, LogOut } from 'lucide-react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useAppearance } from '@/hooks/use-appearance';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { cn } from '@/lib/utils';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { User } from '@/types';

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer"
                        href={edit()}
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2" />
                        Configuraciones de perfil
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <ThemeSwitchItem />
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full cursor-pointer"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2" />
                    Cerrar sesión
                </Link>
            </DropdownMenuItem>
        </>
    );
}

function ThemeSwitchItem() {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const toggleTheme = () => {
        updateAppearance(isDark ? 'light' : 'dark');
    };

    return (
        <DropdownMenuItem
            className="cursor-pointer"
            onClick={toggleTheme}
            onSelect={(event) => event.preventDefault()}
        >
            <span className="flex w-full items-center justify-between gap-2">
                <span className="flex items-center">
                    {isDark ? (
                        <Moon className="mr-2" />
                    ) : (
                        <Sun className="mr-2" />
                    )}
                    <span>{isDark ? 'Tema oscuro' : 'Tema claro'}</span>
                </span>

                <span
                    role="switch"
                    aria-checked={isDark}
                    aria-label="Cambiar tema"
                    className={cn(
                        'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors',
                        isDark ? 'bg-primary' : 'bg-muted-foreground/30',
                    )}
                >
                    <span
                        className={cn(
                            'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform',
                            isDark ? 'translate-x-[18px]' : 'translate-x-[2px]',
                        )}
                    />
                </span>
            </span>
        </DropdownMenuItem>
    );
}
