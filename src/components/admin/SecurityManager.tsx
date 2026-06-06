import { useState } from 'react';
import { api } from '../../api/client';
import { inp, lbl, card, sectionTitle, primaryBtn, FH } from './theme';

export default function SecurityManager() {
    const [pw, setPw]         = useState({ current: '', next: '', confirm: '' });
    const [pwMsg, setPwMsg]   = useState<{ text: string; ok: boolean } | null>(null);
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
        } catch (err) { setPwMsg({ text: err instanceof Error ? err.message : 'Грешка', ok: false }); }
        finally { setPwBusy(false); }
    };

    const [nu, setNu]         = useState({ email: '', name: '', password: '' });
    const [nuMsg, setNuMsg]   = useState<{ text: string; ok: boolean } | null>(null);
    const [nuBusy, setNuBusy] = useState(false);

    const submitNu = async (e: React.FormEvent) => {
        e.preventDefault(); setNuBusy(true); setNuMsg(null);
        try {
            await api.post('/auth/users', nu);
            setNuMsg({ text: `Профилът "${nu.name}" е създаден`, ok: true });
            setNu({ email: '', name: '', password: '' });
        } catch (err) { setNuMsg({ text: err instanceof Error ? err.message : 'Грешка', ok: false }); }
        finally { setNuBusy(false); }
    };

    const msg = (m: { text: string; ok: boolean } | null) => m ? (
        <div style={{ background: m.ok ? '#f0fdf4' : '#fef2f2', border: `1px solid ${m.ok ? '#bbf7d0' : '#fecaca'}`, borderRadius: 8, padding: '10px 14px', color: m.ok ? '#15803d' : '#dc2626', fontSize: 13, fontFamily: FH }}>{m.text}</div>
    ) : null;

    return (
        <div>
            <h2 style={{ ...sectionTitle, fontSize: 22, marginBottom: 28 }}>Сигурност</h2>

            <div style={card}>
                <h3 style={sectionTitle}>Смяна на парола</h3>
                <form onSubmit={submitPw} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 420 }}>
                    <div><label style={lbl}>Текуща парола</label><input style={inp} type="password" required value={pw.current} onChange={e => setPw(f => ({ ...f, current: e.target.value }))} /></div>
                    <div><label style={lbl}>Нова парола</label><input style={inp} type="password" required value={pw.next} onChange={e => setPw(f => ({ ...f, next: e.target.value }))} placeholder="Минимум 6 символа" /></div>
                    <div><label style={lbl}>Потвърди нова парола</label><input style={inp} type="password" required value={pw.confirm} onChange={e => setPw(f => ({ ...f, confirm: e.target.value }))} /></div>
                    {msg(pwMsg)}
                    <div><button type="submit" disabled={pwBusy} style={primaryBtn(pwBusy)}>{pwBusy ? 'Запазване...' : 'Смени паролата'}</button></div>
                </form>
            </div>

            <div style={card}>
                <h3 style={sectionTitle}>Нов администраторски профил</h3>
                <form onSubmit={submitNu} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 420 }}>
                    <div><label style={lbl}>Имейл</label><input style={inp} type="email" required value={nu.email} onChange={e => setNu(f => ({ ...f, email: e.target.value }))} placeholder="admin@example.com" /></div>
                    <div><label style={lbl}>Име</label><input style={inp} type="text" required value={nu.name} onChange={e => setNu(f => ({ ...f, name: e.target.value }))} placeholder="Иван Иванов" /></div>
                    <div><label style={lbl}>Парола</label><input style={inp} type="password" required value={nu.password} onChange={e => setNu(f => ({ ...f, password: e.target.value }))} placeholder="Минимум 6 символа" /></div>
                    {msg(nuMsg)}
                    <div><button type="submit" disabled={nuBusy} style={primaryBtn(nuBusy)}>{nuBusy ? 'Създаване...' : 'Създай профил'}</button></div>
                </form>
            </div>
        </div>
    );
}
