import { useState, useEffect, useRef } from 'react';
import { api } from '../../api/client';
import BeforeAfterSlider from '../sections/BeforeAfterSlider';

interface Pair {
    _id: string;
    title: string;
    beforeUrl: string;
    beforeUrlSmall?: string;
    afterUrl: string;
    afterUrlSmall?: string;
    order?: number;
}

const inp: React.CSSProperties = { width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '9px 12px', color: '#f1f5f9', fontSize: 14, boxSizing: 'border-box', outline: 'none' };
const lbl: React.CSSProperties = { display: 'block', color: '#b0c4d5', fontSize: 12, fontWeight: 600, marginBottom: 4 };

function ImagePicker({ label, preview, onFile }: { label: string; preview: string | null; onFile: (f: { base64: string; name: string; type: string }) => void }) {
    const ref = useRef<HTMLInputElement>(null);
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            onFile({ base64: ev.target?.result as string, name: file.name, type: file.type });
        };
        reader.readAsDataURL(file);
    };
    return (
        <div style={{ flex: 1 }}>
            <label style={lbl}>{label}</label>
            <div
                onClick={() => ref.current?.click()}
                style={{ width: '100%', height: 120, borderRadius: 8, border: '2px dashed #334155', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}
            >
                {preview
                    ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ color: '#8fa4b8', fontSize: 12, textAlign: 'center', padding: 8 }}>Кликни за снимка</span>
                }
            </div>
            <input ref={ref} type="file" accept="image/*" onChange={onChange} style={{ display: 'none' }} />
        </div>
    );
}

type FileData = { base64: string; name: string; type: string };

const EMPTY_FORM = { title: '', beforePreview: null as string | null, afterPreview: null as string | null, beforeFile: null as FileData | null, afterFile: null as FileData | null };

export default function BeforeAfterManager() {
    const [pairs, setPairs]     = useState<Pair[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving]   = useState(false);
    const [error, setError]     = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId]   = useState<string | null>(null);
    const [form, setForm]       = useState(EMPTY_FORM);
    const [dragIdx, setDragIdx] = useState<number | null>(null);
    const [dragOver, setDragOver] = useState<number | null>(null);

    const load = async () => {
        const res = await api.get<{ pairs: Pair[] }>('/beforeafter');
        setPairs(res.pairs);
    };

    useEffect(() => {
        load().catch(() => setError('Грешка при зареждане')).finally(() => setLoading(false));
    }, []);

    const openAdd = () => {
        setForm(EMPTY_FORM);
        setEditId(null);
        setShowForm(true);
        setError('');
    };

    const openEdit = (p: Pair) => {
        setForm({ title: p.title, beforePreview: p.beforeUrlSmall ?? p.beforeUrl, afterPreview: p.afterUrlSmall ?? p.afterUrl, beforeFile: null, afterFile: null });
        setEditId(p._id);
        setShowForm(true);
        setError('');
    };

    const cancel = () => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM); setError(''); };

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) { setError('Описанието е задължително'); return; }
        if (!editId && (!form.beforeFile || !form.afterFile)) { setError('Изберете снимки преди и след'); return; }
        setSaving(true); setError('');
        try {
            if (editId) {
                await api.put(`/beforeafter/${editId}`, {
                    title: form.title,
                    ...(form.beforeFile ? { beforeFile: form.beforeFile } : {}),
                    ...(form.afterFile  ? { afterFile:  form.afterFile  } : {}),
                });
                setPairs(prev => prev.map(p => p._id === editId ? {
                    ...p,
                    title: form.title,
                    ...(form.beforeFile ? { beforeUrl: form.beforePreview ?? p.beforeUrl } : {}),
                    ...(form.afterFile  ? { afterUrl:  form.afterPreview  ?? p.afterUrl  } : {}),
                } : p));
                setSuccess('Трансформацията е обновена');
            } else {
                const res = await api.post<{ pair: Pair }>('/beforeafter', {
                    title: form.title,
                    beforeFile: form.beforeFile,
                    afterFile: form.afterFile,
                });
                setPairs(prev => [...prev, res.pair]);
                setSuccess('Трансформацията е добавена');
            }
            cancel();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Грешка при запазване');
        } finally { setSaving(false); }
    };

    const remove = async (id: string) => {
        if (!confirm('Изтрий тази трансформация?')) return;
        try {
            await api.delete(`/beforeafter/${id}`);
            setPairs(prev => prev.filter(p => p._id !== id));
        } catch { setError('Грешка при изтриване'); }
    };

    const onDragStart = (idx: number) => setDragIdx(idx);
    const onDragEnter = (idx: number) => setDragOver(idx);
    const onDragEnd   = async () => {
        if (dragIdx === null || dragOver === null || dragIdx === dragOver) {
            setDragIdx(null); setDragOver(null); return;
        }
        const next = [...pairs];
        const [moved] = next.splice(dragIdx, 1);
        next.splice(dragOver, 0, moved);
        const ordered = next.map((p, i) => ({ ...p, order: i }));
        setPairs(ordered);
        setDragIdx(null); setDragOver(null);
        try {
            await api.put('/beforeafter/reorder', { order: ordered.map(p => ({ _id: p._id, order: p.order ?? 0 })) });
        } catch { setError('Грешка при запазване на реда'); }
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 700, margin: 0 }}>Преди и След</h2>
                {!showForm && (
                    <button onClick={openAdd} style={{ background: '#f97316', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                        + Добави нова
                    </button>
                )}
            </div>
            <p style={{ color: '#7b93a8', fontSize: 13, marginTop: 4, marginBottom: 24 }}>
                Всички трансформации се показват на страница /predi-i-sled. Първата се показва и на началната страница.
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
                        {editId ? 'Редактирай трансформация' : 'Нова трансформация'}
                    </h3>
                    <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={lbl}>Описание *</label>
                            <input
                                style={inp}
                                value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                required
                                placeholder="напр. Цялостен ремонт апартамент, кв. Младост"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: 16 }}>
                            <ImagePicker
                                label={editId ? 'Снимка ПРЕДИ (незадължително — за замяна)' : 'Снимка ПРЕДИ *'}
                                preview={form.beforePreview}
                                onFile={f => setForm(prev => ({ ...prev, beforeFile: f, beforePreview: f.base64 }))}
                            />
                            <ImagePicker
                                label={editId ? 'Снимка СЛЕД (незадължително — за замяна)' : 'Снимка СЛЕД *'}
                                preview={form.afterPreview}
                                onFile={f => setForm(prev => ({ ...prev, afterFile: f, afterPreview: f.base64 }))}
                            />
                        </div>

                        {form.beforePreview && form.afterPreview && (
                            <div>
                                <label style={lbl}>Преглед</label>
                                <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #334155' }}>
                                    <BeforeAfterSlider beforeUrl={form.beforePreview} afterUrl={form.afterPreview} />
                                </div>
                            </div>
                        )}

                        {editId && (
                            <p style={{ color: '#7b93a8', fontSize: 12, margin: 0 }}>
                                Оставете снимките непроменени, ако искате само да обновите описанието.
                            </p>
                        )}

                        {error && <div style={{ color: '#fca5a5', fontSize: 13 }}>{error}</div>}

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button type="submit" disabled={saving} style={{ background: '#f97316', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 24px', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                                {saving ? 'Запазване...' : editId ? 'Обнови' : 'Добави'}
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
            ) : pairs.length === 0 ? (
                <div style={{ color: '#8fa4b8', fontSize: 14 }}>Няма добавени трансформации. Добавете или стартирайте seed скрипта.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {pairs.map((pair, idx) => (
                        <div
                            key={pair._id}
                            draggable
                            onDragStart={() => onDragStart(idx)}
                            onDragEnter={() => onDragEnter(idx)}
                            onDragEnd={() => void onDragEnd()}
                            onDragOver={e => e.preventDefault()}
                            style={{
                                background: '#1e293b',
                                borderRadius: 10,
                                padding: 16,
                                display: 'flex',
                                gap: 16,
                                alignItems: 'center',
                                outline: dragOver === idx ? '1px solid rgba(249,115,22,0.5)' : idx === 0 ? '1px solid rgba(249,115,22,0.2)' : 'none',
                                opacity: dragIdx === idx ? 0.5 : 1,
                                cursor: 'grab',
                            }}
                        >
                            {/* Drag handle */}
                            <div style={{ color: '#334155', flexShrink: 0 }}>
                                <svg width="14" height="20" viewBox="0 0 14 20" fill="currentColor">
                                    <circle cx="4" cy="4" r="2"/><circle cx="10" cy="4" r="2"/>
                                    <circle cx="4" cy="10" r="2"/><circle cx="10" cy="10" r="2"/>
                                    <circle cx="4" cy="16" r="2"/><circle cx="10" cy="16" r="2"/>
                                </svg>
                            </div>

                            {/* Index badge */}
                            <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: idx === 0 ? 'rgba(249,115,22,0.2)' : '#0f172a', border: `1px solid ${idx === 0 ? 'rgba(249,115,22,0.4)' : '#334155'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: idx === 0 ? '#f97316' : '#8fa4b8', fontSize: 12, fontWeight: 700 }}>
                                {idx + 1}
                            </div>

                            {/* Thumbnails */}
                            <div style={{ flexShrink: 0, display: 'flex', gap: 4 }}>
                                <div style={{ width: 64, height: 48, borderRadius: 6, overflow: 'hidden', border: '1px solid #334155', position: 'relative' }}>
                                    <img src={pair.beforeUrlSmall ?? pair.beforeUrl} alt="Преди" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <span style={{ position: 'absolute', bottom: 2, left: 3, fontSize: 8, fontWeight: 700, color: '#fff', background: 'rgba(15,23,42,0.8)', borderRadius: 3, padding: '1px 4px' }}>ПРЕДИ</span>
                                </div>
                                <div style={{ width: 64, height: 48, borderRadius: 6, overflow: 'hidden', border: '1px solid #334155', position: 'relative' }}>
                                    <img src={pair.afterUrlSmall ?? pair.afterUrl} alt="След" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <span style={{ position: 'absolute', bottom: 2, right: 3, fontSize: 8, fontWeight: 700, color: '#fff', background: 'rgba(249,115,22,0.8)', borderRadius: 3, padding: '1px 4px' }}>СЛЕД</span>
                                </div>
                            </div>

                            {/* Title */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ color: '#dae4ee', fontSize: 14, fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {pair.title}
                                </p>
                                {idx === 0 && (
                                    <span style={{ fontSize: 10, color: '#f97316', fontWeight: 700, letterSpacing: '0.06em' }}>ПОКАЗВА СЕ НА НАЧАЛНАТА</span>
                                )}
                            </div>

                            {/* Actions */}
                            <div style={{ flexShrink: 0, display: 'flex', gap: 8 }}>
                                <button onClick={() => openEdit(pair)} style={{ background: '#334155', border: 'none', borderRadius: 6, padding: '6px 12px', color: '#94a3b8', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                    Редактирай
                                </button>
                                <button onClick={() => void remove(pair._id)} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 6, padding: '6px 12px', color: '#fca5a5', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
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
