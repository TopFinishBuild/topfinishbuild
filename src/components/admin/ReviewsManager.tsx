import { useState, useEffect } from 'react';
import { api } from '../../api/client';

interface Testimonial {
    _id: string;
    text: string;
    name: string;
    subtitle: string;
    initials: string;
    stars: number;
}

const inp: React.CSSProperties = { width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '9px 12px', color: '#f1f5f9', fontSize: 14, boxSizing: 'border-box', outline: 'none' };
const lbl: React.CSSProperties = { display: 'block', color: '#b0c4d5', fontSize: 12, fontWeight: 600, marginBottom: 4 };

const EMPTY = { text: '', name: '', subtitle: '', initials: '', stars: 5 };

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hover, setHover] = useState(0);
    return (
        <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4, 5].map(i => (
                <button
                    key={i}
                    type="button"
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => onChange(i)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 3px', fontSize: 22, color: i <= (hover || value) ? '#f97316' : '#334155', transition: 'color 0.12s' }}
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

    useEffect(() => {
        load().catch(() => setError('Грешка при зареждане')).finally(() => setLoading(false));
    }, []);

    const openAdd = () => {
        setForm(EMPTY);
        setEditId(null);
        setShowForm(true);
        setError('');
    };

    const openEdit = (t: Testimonial) => {
        setForm({ text: t.text, name: t.name, subtitle: t.subtitle, initials: t.initials, stars: t.stars ?? 5 });
        setEditId(t._id);
        setShowForm(true);
        setError('');
    };

    const cancel = () => { setShowForm(false); setEditId(null); setForm(EMPTY); setError(''); };

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.text.trim() || !form.name.trim() || !form.subtitle.trim() || !form.initials.trim()) {
            setError('Всички полета са задължителни'); return;
        }
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
        try {
            await api.delete(`/testimonials/${id}`);
            setItems(prev => prev.filter(t => t._id !== id));
        } catch { setError('Грешка при изтриване'); }
    };

    const f = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(prev => ({ ...prev, [k]: e.target.value }));

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 700, margin: 0 }}>Доволни клиенти</h2>
                {!showForm && (
                    <button onClick={openAdd} style={{ background: '#f97316', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                        + Добави отзив
                    </button>
                )}
            </div>
            <p style={{ color: '#7b93a8', fontSize: 13, marginTop: 4, marginBottom: 24 }}>
                На сайта се показват първите 3 отзива.
            </p>

            {success && (
                <div style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '10px 16px', color: '#86efac', fontSize: 13, marginBottom: 16 }}>
                    {success}
                </div>
            )}

            {/* Form */}
            {showForm && (
                <div style={{ background: '#1e293b', borderRadius: 12, padding: 24, marginBottom: 24 }}>
                    <h3 style={{ color: '#dae4ee', fontSize: 16, fontWeight: 600, margin: '0 0 20px' }}>
                        {editId ? 'Редактирай отзив' : 'Нов отзив'}
                    </h3>
                    <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <label style={lbl}>Текст на отзива *</label>
                            <textarea
                                style={{ ...inp, height: 100, resize: 'vertical' }}
                                value={form.text}
                                onChange={f('text')}
                                required
                                placeholder="Текст на отзива..."
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <label style={lbl}>Име *</label>
                                <input style={inp} value={form.name} onChange={f('name')} required placeholder="напр. Мария Иванова" />
                            </div>
                            <div>
                                <label style={lbl}>Инициали * (2-3 букви)</label>
                                <input style={inp} value={form.initials} onChange={f('initials')} required placeholder="напр. МИ" maxLength={3} />
                            </div>
                        </div>
                        <div>
                            <label style={lbl}>Подзаглавие *</label>
                            <input style={inp} value={form.subtitle} onChange={f('subtitle')} required placeholder="напр. Апартамент, кв. Младост" />
                        </div>
                        <div>
                            <label style={{ ...lbl, marginBottom: 8 }}>Оценка</label>
                            <StarPicker value={form.stars} onChange={v => setForm(prev => ({ ...prev, stars: v }))} />
                        </div>

                        {error && <div style={{ color: '#fca5a5', fontSize: 13 }}>{error}</div>}

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button type="submit" disabled={saving} style={{ background: '#f97316', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 24px', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                                {saving ? 'Запазване...' : (editId ? 'Обнови' : 'Добави')}
                            </button>
                            <button type="button" onClick={cancel} style={{ background: '#334155', color: '#cbd5e1', border: 'none', borderRadius: 8, padding: '9px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                                Откажи
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            {loading ? (
                <div style={{ color: '#8fa4b8', fontSize: 14 }}>Зареждане...</div>
            ) : items.length === 0 ? (
                <div style={{ color: '#8fa4b8', fontSize: 14 }}>Няма добавени отзиви. Добавете или стартирайте seed скрипта.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {items.map((t, idx) => (
                        <div key={t._id} style={{ background: '#1e293b', borderRadius: 10, padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start', outline: idx < 3 ? '1px solid rgba(249,115,22,0.2)' : 'none' }}>
                            <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '50%', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316', fontSize: 14, fontWeight: 700 }}>
                                {t.initials}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                    <div style={{ display: 'flex', gap: 2 }}>
                                        {[1,2,3,4,5].map(i => (
                                            <span key={i} style={{ fontSize: 14, color: i <= (t.stars ?? 5) ? '#f97316' : '#334155' }}>★</span>
                                        ))}
                                    </div>
                                    {idx < 3 && <span style={{ fontSize: 10, color: '#f97316', fontWeight: 700, letterSpacing: '0.06em' }}>ПОКАЗВА СЕ</span>}
                                </div>
                                <p style={{ color: '#dae4ee', fontSize: 13, margin: '0 0 6px', lineHeight: 1.5 }}>"{t.text}"</p>
                                <p style={{ color: '#f97316', fontSize: 13, fontWeight: 700, margin: '0 0 2px' }}>{t.name}</p>
                                <p style={{ color: '#8fa4b8', fontSize: 12, margin: 0 }}>{t.subtitle}</p>
                            </div>
                            <div style={{ flexShrink: 0, display: 'flex', gap: 8 }}>
                                <button onClick={() => openEdit(t)} style={{ background: '#334155', border: 'none', borderRadius: 6, padding: '6px 12px', color: '#94a3b8', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                    Редактирай
                                </button>
                                <button onClick={() => void remove(t._id)} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 6, padding: '6px 12px', color: '#fca5a5', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                    Изтрий
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
