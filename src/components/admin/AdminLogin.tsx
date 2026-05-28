import { useState } from 'react';
import { api, token } from '../../api/client';

interface Props {
    onLogin: (name: string) => void;
}

export default function AdminLogin({ onLogin }: Props) {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post<{ token: string; name: string }>('/auth/login', { email, password });
            token.set(res.token);
            onLogin(res.name);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Грешка при вход');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
            <div style={{ background: '#1e293b', borderRadius: 16, padding: '48px 40px', width: '100%', maxWidth: 420, boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <img src="/logos/topfinish-build-logo.png" alt="TopFinish Build" style={{ height: 48, margin: '0 auto 16px', display: 'block' }} />
                    <p style={{ color: '#b0c4d5', fontSize: 14, margin: 0 }}>Администраторски панел</p>
                </div>

                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Имейл</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#f1f5f9', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Парола</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#f1f5f9', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
                        />
                    </div>

                    {error && (
                        <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 8, padding: '10px 14px', color: '#fca5a5', fontSize: 14 }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ marginTop: 8, background: '#f97316', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Влизане...' : 'Вход'}
                    </button>
                </form>
            </div>
        </div>
    );
}
