import { useState } from 'react';
import { api } from '../../api/client';

export default function SecurityManager() {
    const inp: React.CSSProperties = {
        width: '100%', background: '#0f172a', border: '1px solid #334155',
        borderRadius: 8, padding: '9px 12px', color: '#f1f5f9', fontSize: 14,
        boxSizing: 'border-box', outline: 'none',
    };
    const lbl: React.CSSProperties = {
        display: 'block', color: '#b0c4d5', fontSize: 12, fontWeight: 600, marginBottom: 4,
    };

    // Change password
    const [pw, setPw]       = useState({ current: '', next: '', confirm: '' });
    const [pwMsg, setPwMsg] = useState<{ text: string; ok: boolean } | null>(null);
    const [pwBusy, setPwBusy] = useState(false);

    const submitPw = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pw.next !== pw.confirm) { setPwMsg({ text: 'Паролите не съвпадат', ok: false }); return; }
        if (pw.next.length < 6)    { setPwMsg({ text: 'Минимум 6 символа', ok: false }); return; }
        setPwBusy(true); setPwMsg(null);
        try {
            await api.put('/auth/password', { currentPassword: pw.current, newPassword: pw.next });
            setPwMsg({ text: 'Паролата е сменена успешно', ok: true });
            setPw({ current: '', next: '', confirm: '' });
        } catch (err) {
            setPwMsg({ text: err instanceof Error ? err.message : 'Грешка', ok: false });
        } finally { setPwBusy(false); }
    };

    // Create user
    const [nu, setNu]       = useState({ email: '', name: '', password: '' });
    const [nuMsg, setNuMsg] = useState<{ text: string; ok: boolean } | null>(null);
    const [nuBusy, setNuBusy] = useState(false);

    const submitNu = async (e: React.FormEvent) => {
        e.preventDefault();
        setNuBusy(true); setNuMsg(null);
        try {
            await api.post('/auth/users', nu);
            setNuMsg({ text: `Профилът "${nu.name}" е създаден`, ok: true });
            setNu({ email: '', name: '', password: '' });
        } catch (err) {
            setNuMsg({ text: err instanceof Error ? err.message : 'Грешка', ok: false });
        } finally { setNuBusy(false); }
    };

    const card: React.CSSProperties = {
        background: '#1e293b', borderRadius: 12, padding: 24, marginBottom: 24,
    };
    const h3: React.CSSProperties = {
        color: '#dae4ee', fontSize: 16, fontWeight: 600, margin: '0 0 20px',
    };
    const submitBtn = (busy: boolean): React.CSSProperties => ({
        background: '#f97316', color: '#fff', border: 'none', borderRadius: 8,
        padding: '10px 28px', fontSize: 14, fontWeight: 700,
        cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.7 : 1,
    });

    return (
        <div>
            <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 700, margin: '0 0 28px' }}>Сигурност</h2>

            {/* Change password */}
            <div style={card}>
                <h3 style={h3}>Смяна на парола</h3>
                <form onSubmit={submitPw} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 400 }}>
                    <div>
                        <label style={lbl}>Текуща парола</label>
                        <input style={inp} type="password" required value={pw.current}
                            onChange={e => setPw(f => ({ ...f, current: e.target.value }))} />
                    </div>
                    <div>
                        <label style={lbl}>Нова парола</label>
                        <input style={inp} type="password" required value={pw.next}
                            onChange={e => setPw(f => ({ ...f, next: e.target.value }))}
                            placeholder="Минимум 6 символа" />
                    </div>
                    <div>
                        <label style={lbl}>Потвърди нова парола</label>
                        <input style={inp} type="password" required value={pw.confirm}
                            onChange={e => setPw(f => ({ ...f, confirm: e.target.value }))} />
                    </div>
                    {pwMsg && (
                        <div style={{ color: pwMsg.ok ? '#86efac' : '#fca5a5', fontSize: 13 }}>{pwMsg.text}</div>
                    )}
                    <div>
                        <button type="submit" disabled={pwBusy} style={submitBtn(pwBusy)}>
                            {pwBusy ? 'Запазване...' : 'Смени паролата'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Create user */}
            <div style={card}>
                <h3 style={h3}>Нов администраторски профил</h3>
                <form onSubmit={submitNu} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 400 }}>
                    <div>
                        <label style={lbl}>Имейл</label>
                        <input style={inp} type="email" required value={nu.email}
                            onChange={e => setNu(f => ({ ...f, email: e.target.value }))}
                            placeholder="admin@example.com" />
                    </div>
                    <div>
                        <label style={lbl}>Име</label>
                        <input style={inp} type="text" required value={nu.name}
                            onChange={e => setNu(f => ({ ...f, name: e.target.value }))}
                            placeholder="Иван Иванов" />
                    </div>
                    <div>
                        <label style={lbl}>Парола</label>
                        <input style={inp} type="password" required value={nu.password}
                            onChange={e => setNu(f => ({ ...f, password: e.target.value }))}
                            placeholder="Минимум 6 символа" />
                    </div>
                    {nuMsg && (
                        <div style={{ color: nuMsg.ok ? '#86efac' : '#fca5a5', fontSize: 13 }}>{nuMsg.text}</div>
                    )}
                    <div>
                        <button type="submit" disabled={nuBusy} style={submitBtn(nuBusy)}>
                            {nuBusy ? 'Създаване...' : 'Създай профил'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
