import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { inp, lbl, card, sectionTitle, muted, successBox, errorBox, primaryBtn, ORANGE, NAVY, FH } from './theme';

interface Testimonial {
    _id: string; text: string; name: string;
    subtitle: string; initials: string; stars: number;
}

const EMPTY = { text: '', name: '', subtitle: '', initials: '', stars: 5 };

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hover, setHover] = useState(0);
    return (
        <div style={{ display: 'flex', gap: 4 }}>
            {[1,2,3,4,5].map(i => (
                <button key={i} type="button"
                    onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)}
                    onClick={() => onChange(i)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 3px', fontSize: 24, color: i <= (hover || value) ? ORANGE : '#e2e8f0', transition: 'color 0.12s' }}
                    aria-label={`${i} звезди`}
                >★</button>
            ))}
        </div>
    );
}

export default function ReviewsManager() {
    const [items, setItems]       = useState<Testimonial[]>([]);
    const [loading, setLoading]   = useState(true);
    const [saving, setSaving]     = useState(false);
    const [error, setError]       = useState('');
    const [success, setSuccess]   = useState('');
    const [form, setForm]         = useState(EMPTY);
    const [editId, setEditId]     = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    const load = async () => {
        const res = await api.get<{ testimonials: Testimonial[] }>('/testimonials');
        setItems(res.testimonials);
    };
    useEffect(() => { load().catch(() => setError('Грешка при зареждане')).finally(() => setLoading(false)); }, []);

    const openAdd  = () => { setForm(EMPTY); setEditId(null); setShowForm(true); setError(''); };
    const openEdit = (t: Testimonial) => { setForm({ text: t.text, name: t.name, subtitle: t.subtitle, initials: t.initials, stars: t.stars ?? 5 }); setEditId(t._id); setShowForm(true); setError(''); };
    const cancel   = () => { setShowForm(false); setEditId(null); setForm(EMPTY); setError(''); };

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.text.trim() || !form.name.trim() || !form.subtitle.trim() || !form.initials.trim()) { setError('Всички полета са задължителни'); return; }
        setSaving(true); setError('');
        try {
            if (editId) {
                await api.put(`/testimonials/${editId}`, form);
                setItems(prev => prev.map(t => t._id === editId ? { ...t, ...form } : t));
                setSuccess('Отзивът е обновен');
            } else {
                const res = await api.post<{ testimonial: Testimonial }>('/testimonials', form);
                setItems(prev => [...prev, res.testimonial]);
                setSuccess('Отзивът е добавен');
            }
            cancel();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Грешка при запазване');
        } finally { setSaving(false); }
    };

    const remove = async (id: string) => {
        if (!confirm('Изтрий отзива?')) return;
        try { await api.delete(`/testimonials/${id}`); setItems(prev => prev.filter(t => t._id !== id)); }
        catch { setError('Грешка при изтриване'); }
    };

    const f = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(prev => ({ ...prev, [k]: e.target.value }));

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <h2 style={{ ...sectionTitle, fontSize: 22, margin: 0 }}>Доволни клиенти</h2>
                {!showForm && (
                    <button onClick={openAdd} style={primaryBtn()}>+ Добави отзив</button>
                )}
            </div>
            <p style={{ ...muted, marginBottom: 24, marginTop: 6 }}>На сайта се показват първите 3 отзива.</p>

            {success && <div style={successBox}>{success}</div>}

            {showForm && (
                <div style={card}>
                    <h3 style={sectionTitle}>{editId ? 'Редактирай отзив' : 'Нов отзив'}</h3>
                    <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <label style={lbl}>Текст на отзива *</label>
                            <textarea style={{ ...inp, height: 100, resize: 'vertical' }} value={form.text} onChange={f('text')} required placeholder="Текст на отзива..." />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div><label style={lbl}>Име *</label><input style={inp} value={form.name} onChange={f('name')} required placeholder="напр. Мария Иванова" /></div>
                            <div><label style={lbl}>Инициали * (2-3 букви)</label><input style={inp} value={form.initials} onChange={f('initials')} required placeholder="напр. МИ" maxLength={3} /></div>
                        </div>
                        <div><label style={lbl}>Подзаглавие *</label><input style={inp} value={form.subtitle} onChange={f('subtitle')} required placeholder="напр. Апартамент, кв. Младост" /></div>
                        <div>
                            <label style={{ ...lbl, marginBottom: 8 }}>Оценка</label>
                            <StarPicker value={form.stars} onChange={v => setForm(prev => ({ ...prev, stars: v }))} />
                        </div>
                        {error && <div style={errorBox}>{error}</div>}
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button type="submit" disabled={saving} style={primaryBtn(saving)}>{saving ? 'Запазване...' : (editId ? 'Обнови' : 'Добави')}</button>
                            <button type="button" onClick={cancel} style={{ background: '#f1f5f9', color: '#475569', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '9px 24px', fontSize: 13, fontWeight: 700, fontFamily: FH, cursor: 'pointer' }}>Откажи</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? <div style={muted}>Зареждане...</div>
            : items.length === 0 ? <div style={muted}>Няма добавени отзиви.</div>
            : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {items.map((t, idx) => (
                        <div key={t._id} style={{ background: '#fff', border: `1.5px solid ${idx < 3 ? 'rgba(240,116,32,0.3)' : '#e2e8f0'}`, borderRadius: 12, padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start', boxShadow: '0 1px 4px rgba(15,31,61,0.06)' }}>
                            <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '50%', background: 'rgba(240,116,32,0.1)', border: `1.5px solid rgba(240,116,32,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ORANGE, fontSize: 14, fontWeight: 700, fontFamily: FH }}>
                                {t.initials}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                    <div style={{ display: 'flex', gap: 2 }}>
                                        {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize: 14, color: i <= (t.stars ?? 5) ? ORANGE : '#e2e8f0' }}>★</span>)}
                                    </div>
                                    {idx < 3 && (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(240,116,32,0.1)', border: '1px solid rgba(240,116,32,0.3)', borderRadius: 50, padding: '2px 8px', fontSize: 10, color: ORANGE, fontWeight: 700, fontFamily: FH, letterSpacing: '0.06em' }}>
                                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                            ВИДИМ НА САЙТА
                                        </span>
                                    )}
                                </div>
                                <p style={{ color: '#334155', fontSize: 13, fontFamily: FH, margin: '0 0 6px', lineHeight: 1.6 }}>"{t.text}"</p>
                                <p style={{ color: ORANGE, fontSize: 13, fontWeight: 700, fontFamily: FH, margin: '0 0 2px' }}>{t.name}</p>
                                <p style={{ color: '#94a3b8', fontSize: 12, fontFamily: FH, margin: 0 }}>{t.subtitle}</p>
                            </div>
                            <div style={{ flexShrink: 0, display: 'flex', gap: 8 }}>
                                <button onClick={() => openEdit(t)} style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 6, padding: '6px 12px', color: '#475569', fontSize: 12, fontWeight: 600, fontFamily: FH, cursor: 'pointer' }}>Редактирай</button>
                                <button onClick={() => void remove(t._id)} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '6px 12px', color: '#dc2626', fontSize: 12, fontWeight: 600, fontFamily: FH, cursor: 'pointer' }}>Изтрий</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
