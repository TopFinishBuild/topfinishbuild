import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { invalidateSettingsCache } from '../../api/settingsCache';

interface ContactForm {
    phone1: string;
    phone2: string;
    email1: string;
    email2: string;
}

const inp: React.CSSProperties = { width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '9px 12px', color: '#f1f5f9', fontSize: 14, boxSizing: 'border-box', outline: 'none' };
const lbl: React.CSSProperties = { display: 'block', color: '#b0c4d5', fontSize: 12, fontWeight: 600, marginBottom: 4 };

export default function ContactSettings() {
    const [form, setForm]     = useState<ContactForm>({ phone1: '', phone2: '', email1: '', email2: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError]   = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        api.get<ContactForm & { calendarVisible: boolean }>('/settings')
            .then(res => setForm({ phone1: res.phone1 ?? '', phone2: res.phone2 ?? '', email1: res.email1 ?? '', email2: res.email2 ?? '' }))
            .catch(() => setError('Грешка при зареждане'))
            .finally(() => setLoading(false));
    }, []);

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.phone1.trim() || !form.email1.trim()) {
            setError('Телефон 1 и Имейл 1 са задължителни'); return;
        }
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

    const f = (k: keyof ContactForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(prev => ({ ...prev, [k]: e.target.value }));

    if (loading) return <div style={{ color: '#8fa4b8', fontSize: 14 }}>Зареждане...</div>;

    return (
        <div>
            <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 700, margin: '0 0 8px' }}>Контакти</h2>
            <p style={{ color: '#8fa4b8', fontSize: 13, marginTop: 0, marginBottom: 28 }}>
                Телефоните и имейлите се показват в долната лента на сайта.
            </p>

            <div style={{ background: '#1e293b', borderRadius: 12, padding: 24, maxWidth: 520 }}>
                <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label style={lbl}>Телефон 1 *</label>
                        <input style={inp} value={form.phone1} onChange={f('phone1')} placeholder="+359 888 000 000" />
                    </div>
                    <div>
                        <label style={lbl}>Телефон 2 <span style={{ color: '#7b93a8', fontWeight: 400 }}>(незадължителен)</span></label>
                        <input style={inp} value={form.phone2} onChange={f('phone2')} placeholder="+359 888 000 001" />
                    </div>
                    <div>
                        <label style={lbl}>Имейл 1 *</label>
                        <input style={inp} type="email" value={form.email1} onChange={f('email1')} placeholder="info@topfinish.bg" />
                    </div>
                    <div>
                        <label style={lbl}>Имейл 2 <span style={{ color: '#7b93a8', fontWeight: 400 }}>(незадължителен)</span></label>
                        <input style={inp} type="email" value={form.email2} onChange={f('email2')} placeholder="support@topfinish.bg" />
                    </div>

                    {error   && <div style={{ color: '#fca5a5', fontSize: 13 }}>{error}</div>}
                    {success && <div style={{ color: '#86efac', fontSize: 13 }}>{success}</div>}

                    <div>
                        <button type="submit" disabled={saving} style={{ background: '#f97316', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                            {saving ? 'Запазване...' : 'Запази контактите'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
