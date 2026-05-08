const API_BASE = import.meta.env.VITE_NODE_ENV === 'production' ? '/api' : 'http://localhost:3000/api';

const TOKEN_KEY = 'admin_token';

export const token = {
    get: () => localStorage.getItem(TOKEN_KEY),
    set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
    clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const tk = token.get();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> ?? {}),
    };
    if (tk) headers['x-authorization'] = `Bearer ${tk}`;

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error((body as { error?: string }).error ?? res.statusText);
    }
    return res.json() as Promise<T>;
}

export const api = {
    get:    <T>(path: string)               => request<T>(path),
    post:   <T>(path: string, body: unknown) => request<T>(path, { method: 'POST',   body: JSON.stringify(body) }),
    put:    <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT',    body: JSON.stringify(body) }),
    delete: <T>(path: string)               => request<T>(path, { method: 'DELETE' }),
};
