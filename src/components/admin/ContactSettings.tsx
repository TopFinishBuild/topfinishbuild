import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { invalidateSettingsCache } from '../../api/settingsCache';
import { inp, lbl, card, sectionTitle, muted, successBox, errorBox, primaryBtn, ORANGE, FH } from './theme';

interface PhoneForm { phone1: string; phone2: string; }

const FIXED_EMAIL = 'topfinishbuild@gmail.com';

export default function ContactSettings() {
    const [form, setForm]       = useState<PhoneForm>({ phone1: '', phone2: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving]   = useState(false);
    const [error, setError]     = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        api.get<PhoneForm & { calendarVisible: boolean }>('/settings')
            .then(res => setForm({ phone1: res.phone1 ?? '', phone2: res.phone2 ?? '' }))
            .catch(() => setError('Грешка при зареждане'))
            .finally(() => setLoading(false));
    }, []);

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.phone1.trim()) { setError('Телефон 1 е задължителен'); return; }
        setSaving(true); setError('');
        try {
            await api.put('/settings', form);
            invalidateSettingsCache();
            setSuccess('Настройките са запазени');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Грешка при запазване');
        } finally { setSaving(false); }
    };

    const f = (k: keyof PhoneForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(prev => ({ ...prev, [k]: e.target.value }));

    const primaryBadge: React.CSSProperties = {
        background: 'rgba(240,116,32,0.1)', color: ORANGE, fontSize: 10, fontWeight: 700,
        letterSpacing: '0.08em', padding: '2px 7px', borderRadius: 50,
        border: `1px solid rgba(240,116,32,0.25)`, fontFamily: FH,
    };

    if (loading) return <div style={muted}>Зареждане...</div>;

    return (
        <div>
            <h2 style={{ ...sectionTitle, fontSize: 22, marginBottom: 4 }}>Контакти</h2>
            <p style={{ ...muted, marginBottom: 28 }}>Телефоните се показват в долната лента на сайта.</p>

            <div style={{ ...card, maxWidth: 520 }}>
                <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Fixed email — display only */}
                    <div>
                        <label style={{ ...lbl, display: 'flex', alignItems: 'center', gap: 8 }}>
                            Имейл
                            <span style={primaryBadge}>ФИКСИРАН</span>
                        </label>
                        <div style={{ ...inp, color: '#94a3b8', cursor: 'not-allowed', userSelect: 'none' }}>
                            {FIXED_EMAIL}
                        </div>
                    </div>

                    <div>
                        <label style={{ ...lbl, display: 'flex', alignItems: 'center', gap: 8 }}>
                            Телефон 1 *
                            <span style={primaryBadge}>ОСНОВЕН</span>
                            <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: 11, fontFamily: FH }}>— показва се за цена</span>
                        </label>
                        <input style={inp} value={form.phone1} onChange={f('phone1')} placeholder="+359 888 000 000" />
                    </div>
                    <div>
                        <label style={lbl}>Телефон 2 <span style={{ color: '#94a3b8', fontWeight: 400, fontFamily: FH }}>(незадължителен)</span></label>
                        <input style={inp} value={form.phone2} onChange={f('phone2')} placeholder="+359 888 000 001" />
                    </div>

                    {error   && <div style={errorBox}>{error}</div>}
                    {success && <div style={successBox}>{success}</div>}

                    <div><button type="submit" disabled={saving} style={primaryBtn(saving)}>{saving ? 'Запазване...' : 'Запази контактите'}</button></div>
                </form>
            </div>
        </div>
    );
}
