export type Profile = {
    id: number;
    name: string;
    slug: string;
    order: number;
    status: boolean;
    users_count?: number;
    created_at: string;
    updated_at: string;
};
