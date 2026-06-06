import { useState } from 'react';
import { api, token } from '../../api/client';

interface Props { onLogin: (name: string) => void; }

const FH = "'Manrope', sans-serif";
const NAVY   = '#0f1f3d';
const ORANGE = '#f07420';

export default function AdminLogin({ onLogin }: Props) {
    const [email, setEmail]     = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]     = useState('');
    const [loading, setLoading] = useState(false);

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

    const inp: React.CSSProperties = {
        width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0',
        borderRadius: 8, padding: '11px 14px', color: NAVY,
        fontSize: 15, fontFamily: FH, outline: 'none', boxSizing: 'border-box',
    };
    const lbl: React.CSSProperties = {
        display: 'block', color: '#475569', fontSize: 13,
        fontWeight: 600, fontFamily: FH, marginBottom: 6,
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>

            {/* Top bar matching site header */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 64, background: '#fff', borderBottom: '1px solid #f1f5f9', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', padding: '0 32px', zIndex: 10 }}>
                <img src="/logos/topfinish-build-logo.png" alt="TopFinish Build" style={{ height: 44, display: 'block' }} />
            </div>

            <div style={{ background: '#fff', borderRadius: 16, padding: '48px 40px', width: '100%', maxWidth: 420, boxShadow: '0 8px 40px rgba(15,31,61,0.1)', border: '1px solid #e2e8f0' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, background: `rgba(240,116,32,0.1)`, borderRadius: 14, marginBottom: 16 }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                    </div>
                    <h1 style={{ fontFamily: FH, fontSize: 22, fontWeight: 800, color: NAVY, margin: '0 0 4px' }}>Администраторски вход</h1>
                    <p style={{ fontFamily: FH, color: '#64748b', fontSize: 14, margin: 0 }}>TopFinish Build · Admin Panel</p>
                </div>

                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label style={lbl}>Имейл</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inp} placeholder="admin@topfinish.bg" />
                    </div>
                    <div>
                        <label style={lbl}>Парола</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inp} placeholder="••••••••" />
                    </div>

                    {error && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', color: '#dc2626', fontSize: 14, fontFamily: FH }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ marginTop: 8, background: loading ? '#f59e6b' : ORANGE, color: '#fff', border: 'none', borderRadius: 8, padding: '13px 0', fontSize: 15, fontWeight: 700, fontFamily: FH, cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.04em', transition: 'background 0.2s' }}
                    >
                        {loading ? 'Влизане...' : 'Вход'}
                    </button>
                </form>
            </div>
        </div>
    );
}
