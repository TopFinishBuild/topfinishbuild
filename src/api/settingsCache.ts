import { api } from './client';

export interface SiteSettings {
    calendarVisible: boolean;
    phone1: string;
    phone2: string;
    email1: string;
    email2: string;
}

let cache: SiteSettings | null = null;
let inflight: Promise<SiteSettings> | null = null;

export async function fetchSettings(): Promise<SiteSettings> {
    if (cache) return cache;
    if (inflight) return inflight;
    inflight = api.get<SiteSettings>('/settings').then(res => {
        cache = res;
        inflight = null;
        return cache;
    });
    return inflight;
}

export function prefetchSettings(): void { void fetchSettings(); }

export function updateSettingsCache(patch: Partial<SiteSettings>): void {
    cache = { ...(cache ?? { calendarVisible: true, phone1: '', phone2: '', email1: '', email2: '' }), ...patch };
}

export function invalidateSettingsCache(): void { cache = null; inflight = null; }
