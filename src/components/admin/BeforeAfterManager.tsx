import { useState, useEffect, useRef } from 'react';
import { api } from '../../api/client';
import { prepareImage } from '../../utils/image';
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

import { inp, lbl, card, sectionTitle, muted, successBox, errorBox, primaryBtn, ORANGE, NAVY, FH } from './theme';

function ImagePicker({ label, preview, onFile }: { label: string; preview: string | null; onFile: (f: { base64: string; name: string; type: string }) => void }) {
    const ref = useRef<HTMLInputElement>(null);
    const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        onFile(await prepareImage(file));
    };
    return (
        <div style={{ flex: 1 }}>
            <label style={lbl}>{label}</label>
            <div
                onClick={() => ref.current?.click()}
                style={{ width: '100%', height: 120, borderRadius: 8, border: '2px dashed #e2e8f0', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}
            >
                {preview
                    ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ color: '#94a3b8', fontSize: 12, textAlign: 'center', padding: 8, fontFamily: FH }}>Кликни за снимка</span>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <h2 style={{ ...sectionTitle, fontSize: 22, margin: 0 }}>Преди и След</h2>
                {!showForm && <button onClick={openAdd} style={primaryBtn()}>+ Добави нова</button>}
            </div>
            <p style={{ ...muted, marginTop: 6, marginBottom: 24 }}>
                Всички трансформации се показват на /predi-i-sled. Първата — и на началната страница.
            </p>

            {success && <div style={successBox}>{success}</div>}

            {showForm && (
                <div style={card}>
                    <h3 style={sectionTitle}>{editId ? 'Редактирай трансформация' : 'Нова трансформация'}</h3>
                    <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={lbl}>Описание *</label>
                            <input style={inp} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="напр. Цялостен ремонт апартамент, кв. Младост" />
                        </div>
                        <div style={{ display: 'flex', gap: 16 }}>
                            <ImagePicker label={editId ? 'Снимка ПРЕДИ (за замяна)' : 'Снимка ПРЕДИ *'} preview={form.beforePreview} onFile={f => setForm(prev => ({ ...prev, beforeFile: f, beforePreview: f.base64 }))} />
                            <ImagePicker label={editId ? 'Снимка СЛЕД (за замяна)' : 'Снимка СЛЕД *'}   preview={form.afterPreview}  onFile={f => setForm(prev => ({ ...prev, afterFile: f, afterPreview: f.base64 }))} />
                        </div>
                        {form.beforePreview && form.afterPreview && (
                            <div>
                                <label style={lbl}>Преглед</label>
                                <div style={{ borderRadius: 10, overflow: 'hidden', border: '1.5px solid #e2e8f0' }}>
                                    <BeforeAfterSlider beforeUrl={form.beforePreview} afterUrl={form.afterPreview} />
                                </div>
                            </div>
                        )}
                        {editId && <p style={{ ...muted, fontSize: 12, margin: 0 }}>Оставете снимките непроменени, ако искате само да обновите описанието.</p>}
                        {error && <div style={errorBox}>{error}</div>}
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button type="submit" disabled={saving} style={primaryBtn(saving)}>{saving ? 'Запазване...' : editId ? 'Обнови' : 'Добави'}</button>
                            <button type="button" onClick={cancel} style={{ background: '#f1f5f9', color: '#475569', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '9px 24px', fontSize: 13, fontWeight: 700, fontFamily: FH, cursor: 'pointer' }}>Откажи</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? <div style={muted}>Зареждане...</div>
            : pairs.length === 0 ? <div style={muted}>Няма добавени трансформации.</div>
            : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {pairs.map((pair, idx) => (
                        <div key={pair._id} draggable
                            onDragStart={() => onDragStart(idx)} onDragEnter={() => onDragEnter(idx)}
                            onDragEnd={() => void onDragEnd()} onDragOver={e => e.preventDefault()}
                            style={{ background: '#fff', border: `1.5px solid ${dragOver === idx ? ORANGE : idx === 0 ? 'rgba(240,116,32,0.3)' : '#e2e8f0'}`, borderRadius: 10, padding: 16, display: 'flex', gap: 16, alignItems: 'center', opacity: dragIdx === idx ? 0.5 : 1, cursor: 'grab', boxShadow: '0 1px 4px rgba(15,31,61,0.06)' }}
                        >
                            <div style={{ color: '#cbd5e1', flexShrink: 0 }}>
                                <svg width="14" height="20" viewBox="0 0 14 20" fill="currentColor">
                                    <circle cx="4" cy="4" r="2"/><circle cx="10" cy="4" r="2"/>
                                    <circle cx="4" cy="10" r="2"/><circle cx="10" cy="10" r="2"/>
                                    <circle cx="4" cy="16" r="2"/><circle cx="10" cy="16" r="2"/>
                                </svg>
                            </div>
                            <div style={{ flexShrink: 0, display: 'flex', gap: 4 }}>
                                <div style={{ width: 64, height: 48, borderRadius: 6, overflow: 'hidden', border: '1.5px solid #e2e8f0', position: 'relative' }}>
                                    <img src={pair.beforeUrlSmall ?? pair.beforeUrl} alt="Преди" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <span style={{ position: 'absolute', bottom: 2, left: 3, fontSize: 8, fontWeight: 700, color: '#fff', background: 'rgba(15,31,61,0.75)', borderRadius: 3, padding: '1px 4px', fontFamily: FH }}>ПРЕДИ</span>
                                </div>
                                <div style={{ width: 64, height: 48, borderRadius: 6, overflow: 'hidden', border: '1.5px solid #e2e8f0', position: 'relative' }}>
                                    <img src={pair.afterUrlSmall ?? pair.afterUrl} alt="След" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <span style={{ position: 'absolute', bottom: 2, right: 3, fontSize: 8, fontWeight: 700, color: '#fff', background: `rgba(240,116,32,0.85)`, borderRadius: 3, padding: '1px 4px', fontFamily: FH }}>СЛЕД</span>
                                </div>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ color: NAVY, fontSize: 14, fontWeight: 600, fontFamily: FH, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pair.title}</p>
                                {idx === 0 && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(240,116,32,0.1)', border: '1px solid rgba(240,116,32,0.3)', borderRadius: 50, padding: '2px 8px', fontSize: 10, color: ORANGE, fontWeight: 700, fontFamily: FH, letterSpacing: '0.06em' }}>
                                        <svg width="8" height="8" viewBox="0 0 24 24" fill={ORANGE}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                                        НАЧАЛНАТА СТРАНИЦА
                                    </span>
                                )}
                            </div>
                            <div style={{ flexShrink: 0, display: 'flex', gap: 8 }}>
                                <button onClick={() => openEdit(pair)} style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 6, padding: '6px 12px', color: '#475569', fontSize: 12, fontWeight: 600, fontFamily: FH, cursor: 'pointer' }}>Редактирай</button>
                                <button onClick={() => void remove(pair._id)} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '6px 12px', color: '#dc2626', fontSize: 12, fontWeight: 600, fontFamily: FH, cursor: 'pointer' }}>Изтрий</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
