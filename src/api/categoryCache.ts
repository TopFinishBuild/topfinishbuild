import { api } from './client';

export interface Category { _id: string; name: string; }

let cache: Category[] | null = null;
let inflight: Promise<Category[]> | null = null;

export async function fetchCategories(): Promise<Category[]> {
    if (cache) return cache;
    if (inflight) return inflight;
    inflight = api.get<{ categories: Category[] }>('/categories').then(res => {
        cache = res.categories;
        inflight = null;
        return cache;
    });
    return inflight;
}

export function prefetchCategories(): void { void fetchCategories(); }

export function invalidateCategoriesCache(): void { cache = null; inflight = null; }
