import { useState, useEffect, useRef } from 'react';
import { api } from '../../api/client';
import { fetchCategories, invalidateCategoriesCache, type Category } from '../../api/categoryCache';

interface GalleryImage {
    _id: string;
    label: string;
    category: string;
    duration?: string;
    city?: string;
    area?: string;
    url: string;
    urlSmall?: string;
    order?: number;
    deleted?: boolean;
}

interface DraftCat {
    _id?: string;
    name: string;
}

function catsEqual(a: DraftCat[], b: DraftCat[]) {
    if (a.length !== b.length) return false;
    return a.every((x, i) => x._id === b[i]._id && x.name === b[i].name);
}

function computeGlobalOrders(cats: DraftCat[], imgs: GalleryImage[]) {
    const result: { _id: string; order: number }[] = [];
    let idx = 0;
    const catNames = new Set(cats.map(c => c.name));
    cats.forEach(cat => {
        imgs.filter(i => i.category === cat.name && !i.deleted)
            .forEach(img => result.push({ _id: img._id, order: idx++ }));
    });
    // Orphaned images (category deleted/renamed)
    imgs.filter(i => !catNames.has(i.category) && !i.deleted)
        .forEach(img => result.push({ _id: img._id, order: idx++ }));
    return result;
}

import { inp, lbl, card, sectionTitle, muted, successBox, errorBox, primaryBtn, ORANGE, NAVY, FH } from './theme';

const actionBtn = (active: boolean, orange = false): React.CSSProperties => ({
    background: orange ? (active ? ORANGE : '#fff') : (active ? '#f1f5f9' : '#fff'),
    color: orange ? (active ? '#fff' : '#94a3b8') : (active ? NAVY : '#94a3b8'),
    border: `1.5px solid ${active ? (orange ? ORANGE : '#cbd5e1') : '#e2e8f0'}`,
    borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 700, fontFamily: FH,
    cursor: active ? 'pointer' : 'not-allowed', opacity: active ? 1 : 0.55,
});

const DragHandle = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#94a3b8', flexShrink: 0, cursor: 'grab' }}>
        <circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/>
        <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
        <circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
    </svg>
);

export default function GalleryManager() {
    const [images, setImages]         = useState<GalleryImage[]>([]);
    const [savedCats, setSavedCats]   = useState<Category[]>([]);
    const [draftCats, setDraftCats]   = useState<DraftCat[]>([]);
    const [loading, setLoading]       = useState(true);
    const [uploading, setUploading]   = useState(false);
    const [savingCats, setSavingCats] = useState(false);
    const [error, setError]           = useState('');
    const [success, setSuccess]       = useState('');
    const [catError, setCatError]     = useState('');
    const [newCat, setNewCat]         = useState('');
    const [showDeleted, setShowDeleted] = useState(false);
    const [editingCatIdx, setEditingCatIdx] = useState<number | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({ label: '', category: '', duration: '', city: '', area: '' });
    const [preview, setPreview] = useState<string | null>(null);
    const [fileData, setFileData] = useState<{ base64: string; name: string; type: string } | null>(null);

    // Drag state
    const [dragCat, setDragCat]       = useState<string | null>(null);
    const [dragCatOver, setDragCatOver] = useState<string | null>(null);
    const [dragImg, setDragImg]       = useState<string | null>(null);
    const [dragImgOver, setDragImgOver] = useState<string | null>(null);

    const activeImages  = images.filter(i => !i.deleted);
    const deletedImages = images.filter(i => i.deleted);
    const hasChanges    = !catsEqual(draftCats, savedCats);

    // Live rename map: oldName → newName for renamed draft categories
    const renameMap = new Map<string, string>();
    savedCats.forEach(s => {
        const d = draftCats.find(d => d._id === s._id);
        if (d && d.name !== s.name) renameMap.set(s.name, d.name);
    });
    // Apply rename map to images for real-time display
    const displayImages = activeImages.map(img => ({
        ...img,
        category: renameMap.get(img.category) ?? img.category,
    }));

    const loadCategories = async () => {
        const cats = await fetchCategories();
        setSavedCats(cats);
        setDraftCats(cats.map(c => ({ ...c })));
        if (cats.length > 0) setForm(f => f.category ? f : { ...f, category: cats[0].name });
        return cats;
    };

    const loadImages = async () => {
        const res = await api.get<{ images: GalleryImage[] }>('/gallery/admin');
        setImages(res.images);
    };

    useEffect(() => {
        Promise.all([loadCategories(), loadImages()])
            .catch(err => setError(err instanceof Error ? err.message : 'Грешка при зареждане'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (draftCats.length > 0 && !draftCats.find(c => c.name === form.category)) {
            setForm(f => ({ ...f, category: draftCats[0].name }));
        }
    }, [draftCats]);

    // ── Category draft ops ──────────────────────────────────────────────────

    const addToDraft = () => {
        const name = newCat.trim();
        if (!name) return;
        if (draftCats.find(c => c.name.toLowerCase() === name.toLowerCase())) {
            setCatError('Категорията вече съществува'); return;
        }
        setCatError('');
        setDraftCats(prev => [...prev, { name }]);
        setNewCat('');
    };

    const removeFromDraft = (idx: number) => setDraftCats(prev => prev.filter((_, i) => i !== idx));

    const renameDraftCat = (idx: number, name: string) => {
        const trimmed = name.trim();
        if (!trimmed) { setEditingCatIdx(null); return; }
        setDraftCats(prev => prev.map((c, i) => i === idx ? { ...c, name: trimmed } : c));
        setEditingCatIdx(null);
    };

    const saveCats = async () => {
        setSavingCats(true); setCatError('');
        try {
            const toDelete  = savedCats.filter(s => !draftCats.find(d => d._id === s._id));
            const toAdd     = draftCats.filter(d => !d._id);
            const toRename  = draftCats.filter(d =>
                d._id && savedCats.find(s => s._id === d._id && s.name !== d.name)
            );

            await Promise.all([
                ...toDelete.map(c  => api.delete(`/categories/${c._id}`)),
                ...toRename.map(c  => api.put(`/categories/${c._id}`, { name: c.name })),
            ]);

            const addResults = await Promise.all(
                toAdd.map(c => api.post<{ category: { _id: string; name: string } }>('/categories', { name: c.name }))
            );

            const newIds = new Map<string, string>();
            toAdd.forEach((c, i) => newIds.set(c.name, addResults[i].category._id));

            const finalOrder = draftCats
                .filter(d => !toDelete.find(td => td._id === d._id))
                .map((d, i) => ({ _id: d._id ?? newIds.get(d.name)!, order: i }))
                .filter(x => x._id);

            if (finalOrder.length > 0) {
                await api.put('/categories/reorder', { items: finalOrder });
            }

            invalidateCategoriesCache();
            await Promise.all([loadCategories(), loadImages()]); // reload images too — category names changed
        } catch (err) {
            setCatError(err instanceof Error ? err.message : 'Грешка при запазване');
        } finally {
            setSavingCats(false);
        }
    };

    const discardCats = () => { setCatError(''); setNewCat(''); setDraftCats(savedCats.map(c => ({ ...c }))); };

    // ── Category DnD ────────────────────────────────────────────────────────

    const onCatDragStart = (e: React.DragEvent, id: string | undefined) => {
        if (!id) { e.preventDefault(); return; }
        setDragCat(id);
    };

    const onCatDragOver = (e: React.DragEvent, id: string | undefined) => {
        e.preventDefault();
        if (id) setDragCatOver(id);
    };

    const onCatDrop = (targetId: string | undefined) => {
        if (!dragCat || !targetId || dragCat === targetId) { setDragCat(null); setDragCatOver(null); return; }
        const from = draftCats.findIndex(c => c._id === dragCat);
        const to   = draftCats.findIndex(c => c._id === targetId);
        if (from === -1 || to === -1) { setDragCat(null); setDragCatOver(null); return; }
        const next = [...draftCats];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        setDraftCats(next);
        setDragCat(null); setDragCatOver(null);
    };

    // ── Image DnD ───────────────────────────────────────────────────────────

    const onImgDragStart = (e: React.DragEvent, id: string) => {
        e.stopPropagation();
        setDragImg(id);
    };

    const onImgDragOver = (e: React.DragEvent, id: string) => {
        e.preventDefault(); e.stopPropagation();
        setDragImgOver(id);
    };

    const onImgDrop = async (e: React.DragEvent, targetId: string) => {
        e.preventDefault(); e.stopPropagation();
        if (!dragImg || dragImg === targetId) { setDragImg(null); setDragImgOver(null); return; }
        const dragged = images.find(i => i._id === dragImg);
        const target  = images.find(i => i._id === targetId);
        if (!dragged || !target || dragged.category !== target.category) { setDragImg(null); setDragImgOver(null); return; }

        const catImgs = images.filter(i => i.category === dragged.category && !i.deleted);
        const others  = images.filter(i => i.category !== dragged.category || i.deleted);
        const from = catImgs.findIndex(i => i._id === dragImg);
        const to   = catImgs.findIndex(i => i._id === targetId);
        const next = [...catImgs];
        next.splice(from, 1);
        next.splice(to, 0, dragged);

        const newImages = [...others, ...next];
        setImages(newImages);
        setDragImg(null); setDragImgOver(null);

        const orderItems = computeGlobalOrders(draftCats, newImages);
        try { await api.put('/gallery/reorder', { items: orderItems }); }
        catch { setError('Грешка при пренареждане'); }
    };

    // ── File upload ─────────────────────────────────────────────────────────

    const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            const base64 = ev.target?.result as string;
            setPreview(base64);
            setFileData({ base64, name: file.name, type: file.type });
        };
        reader.readAsDataURL(file);
    };

    const upload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileData) { setError('Изберете снимка'); return; }
        setUploading(true); setError('');
        try {
            await api.post('/gallery', { file: fileData, ...form });
            setSuccess('Снимката е качена успешно');
            setForm(f => ({ ...f, label: '', duration: '', city: '', area: '' }));
            setPreview(null); setFileData(null);
            if (fileRef.current) fileRef.current.value = '';
            await loadImages();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Грешка при качване');
        } finally { setUploading(false); }
    };

    // ── Image actions ───────────────────────────────────────────────────────

    const softDelete = async (id: string) => {
        if (!confirm('Изтрий снимката? (може да се възстанови)')) return;
        try {
            await api.delete(`/gallery/${id}`);
            setImages(prev => prev.map(img => img._id === id ? { ...img, deleted: true } : img));
        } catch { setError('Грешка при изтриване'); }
    };

    const restore = async (id: string) => {
        try {
            await api.patch(`/gallery/${id}/restore`, {});
            setImages(prev => prev.map(img => img._id === id ? { ...img, deleted: false } : img));
        } catch { setError('Грешка при възстановяване'); }
    };

    const hardDelete = async (id: string) => {
        if (!confirm('Изтрий ОКОНЧАТЕЛНО? Снимката не може да се възстанови.')) return;
        try {
            await api.delete(`/gallery/${id}/hard`);
            setImages(prev => prev.filter(img => img._id !== id));
        } catch { setError('Грешка при изтриване'); }
    };

    // ── Render ──────────────────────────────────────────────────────────────

    return (
        <div>
            {/* Categories */}
            <div style={card}>
                <h3 style={sectionTitle}>
                    Категории
                    <span style={{ color: '#94a3b8', fontSize: 12, fontWeight: 400, marginLeft: 10, fontFamily: FH }}>влачи за пренареждане</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minHeight: 36, marginBottom: 14 }}>
                    {loading && <span style={muted}>Зареждане...</span>}
                    {!loading && draftCats.length === 0 && <span style={muted}>Няма категории</span>}
                    {draftCats.map((cat, i) => (
                        <div
                            key={cat._id ?? `new-${i}`}
                            draggable={!!cat._id}
                            onDragStart={e => onCatDragStart(e, cat._id)}
                            onDragOver={e => onCatDragOver(e, cat._id)}
                            onDrop={() => onCatDrop(cat._id)}
                            onDragEnd={() => { setDragCat(null); setDragCatOver(null); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                background: dragCatOver === cat._id ? 'rgba(240,116,32,0.06)' : (cat._id ? '#f8fafc' : 'rgba(240,116,32,0.08)'),
                                border: `1.5px solid ${dragCatOver === cat._id ? ORANGE : (cat._id ? '#e2e8f0' : 'rgba(240,116,32,0.35)')}`,
                                borderRadius: 8, padding: '8px 12px',
                                opacity: dragCat === cat._id ? 0.4 : 1,
                                transition: 'border-color 0.15s, background 0.15s',
                            }}
                        >
                            {cat._id && <DragHandle />}

                            {/* Inline editable name */}
                            {editingCatIdx === i ? (
                                <input
                                    autoFocus
                                    defaultValue={cat.name}
                                    style={{ ...inp, flex: 1, padding: '4px 8px', fontSize: 13, fontWeight: 600 }}
                                    onBlur={e => renameDraftCat(i, e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter')  renameDraftCat(i, (e.target as HTMLInputElement).value);
                                        if (e.key === 'Escape') setEditingCatIdx(null);
                                    }}
                                    onClick={e => e.stopPropagation()}
                                />
                            ) : (
                                <span
                                    style={{ color: cat._id ? NAVY : ORANGE, fontSize: 13, fontWeight: 600, fontFamily: FH, flex: 1, cursor: 'text' }}
                                    title="Кликни за преименуване"
                                    onClick={e => { e.stopPropagation(); setEditingCatIdx(i); }}
                                >{cat.name}</span>
                            )}

                            {!cat._id && <span style={{ fontSize: 10, color: ORANGE, fontWeight: 700, fontFamily: FH }}>НОВО</span>}
                            <button
                                onClick={() => removeFromDraft(i)}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px 4px', borderRadius: 4, display: 'flex' }}
                                title="Премахни"
                            >
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                    ))}
                </div>

                {catError && <div style={{ ...errorBox, marginBottom: 10 }}>{catError}</div>}

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                        style={{ ...inp, flex: 1 }}
                        placeholder="Нова категория..."
                        value={newCat}
                        onChange={e => { setNewCat(e.target.value); setCatError(''); }}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addToDraft(); } }}
                    />
                    <button onClick={addToDraft} disabled={!newCat.trim()} style={actionBtn(!!newCat.trim(), true)}>+ Добави</button>
                    <div style={{ width: 1, height: 28, background: '#e2e8f0', flexShrink: 0 }} />
                    <button onClick={() => void saveCats()} disabled={!hasChanges || savingCats} style={actionBtn(hasChanges && !savingCats, true)}>
                        {savingCats ? 'Запазване...' : 'Запази'}
                    </button>
                    <button onClick={discardCats} disabled={!hasChanges} style={actionBtn(hasChanges)}>Изчисти</button>
                </div>
            </div>

            {/* Upload form */}
            <div style={card}>
                <h3 style={sectionTitle}>Качи нова снимка</h3>
                <form onSubmit={upload} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                        <div
                            onClick={() => fileRef.current?.click()}
                            style={{ flexShrink: 0, width: 120, height: 100, borderRadius: 8, border: '2px dashed #e2e8f0', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}
                        >
                            {preview
                                ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <span style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', padding: 8, fontFamily: FH }}>Избери файл</span>
                            }
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div>
                                <label style={lbl}>Заглавие *</label>
                                <input style={inp} value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} required placeholder="напр. Луксозна баня" />
                            </div>
                            <div>
                                <label style={lbl}>Категория *</label>
                                <select style={inp} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                    {savedCats.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div><label style={lbl}>Срок на изпълнение</label><input style={inp} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="напр. 12 дни" /></div>
                    <div><label style={lbl}>Град</label><input style={inp} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="напр. София" /></div>
                    <div><label style={lbl}>Площ</label><input style={inp} value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} placeholder="напр. 45 м²" /></div>

                    {error   && <div style={{ gridColumn: '1/-1', ...errorBox }}>{error}</div>}
                    {success && <div style={{ gridColumn: '1/-1', ...successBox }}>{success}</div>}

                    <div style={{ gridColumn: '1/-1' }}>
                        <button type="submit" disabled={uploading || savedCats.length === 0} style={primaryBtn(uploading || savedCats.length === 0)}>
                            {uploading ? 'Качване...' : 'Качи снимката'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Active images grouped by category */}
            {loading ? (
                <div style={muted}>Зареждане...</div>
            ) : displayImages.length === 0 ? (
                <div style={muted}>Няма качени снимки</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {draftCats.map(cat => {
                        const catImgs = displayImages.filter(i => i.category === cat.name);
                        return (
                            <div key={cat._id ?? cat.name}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    <h3 style={{ color: NAVY, fontSize: 13, fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: FH }}>{cat.name}</h3>
                                    <span style={{ color: '#94a3b8', fontSize: 12, fontFamily: FH }}>({catImgs.length})</span>
                                    {catImgs.length > 1 && <span style={{ color: '#94a3b8', fontSize: 11, fontFamily: FH }}>• влачи снимките за пренареждане</span>}
                                </div>
                                {catImgs.length === 0 ? (
                                    <div style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic', fontFamily: FH }}>Няма снимки</div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                                        {catImgs.map(img => (
                                            <div
                                                key={img._id}
                                                draggable
                                                onDragStart={e => onImgDragStart(e, img._id)}
                                                onDragOver={e => onImgDragOver(e, img._id)}
                                                onDrop={e => void onImgDrop(e, img._id)}
                                                onDragEnd={() => { setDragImg(null); setDragImgOver(null); }}
                                                style={{
                                                    background: '#fff', border: '1.5px solid #e2e8f0',
                                                    borderRadius: 10, overflow: 'hidden', position: 'relative',
                                                    cursor: 'grab',
                                                    outline: dragImgOver === img._id ? `2px solid ${ORANGE}` : '2px solid transparent',
                                                    opacity: dragImg === img._id ? 0.4 : 1,
                                                    transition: 'outline 0.1s, opacity 0.1s',
                                                    boxShadow: '0 1px 3px rgba(15,31,61,0.06)',
                                                }}
                                            >
                                                <img src={img.urlSmall ?? img.url} alt={img.label} style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block', pointerEvents: 'none' }} />
                                                <div style={{ padding: '8px 10px' }}>
                                                    <p style={{ color: NAVY, fontSize: 12, fontWeight: 600, fontFamily: FH, margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{img.label}</p>
                                                </div>
                                                <button
                                                    onClick={() => void softDelete(img._id)}
                                                    style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(239,68,68,0.88)', border: 'none', borderRadius: 6, width: 26, height: 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
                                                    title="Изтрий"
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Orphaned */}
                    {(() => {
                        const catNames = new Set(draftCats.map(c => c.name));
                        const orphaned = displayImages.filter(i => !catNames.has(i.category));
                        if (orphaned.length === 0) return null;
                        return (
                            <div>
                                <h3 style={{ color: '#94a3b8', fontSize: 13, fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: FH }}>Без категория</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                                    {orphaned.map(img => (
                                        <div key={img._id} style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', position: 'relative', boxShadow: '0 1px 3px rgba(15,31,61,0.06)' }}>
                                            <img src={img.urlSmall ?? img.url} alt={img.label} style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }} />
                                            <div style={{ padding: '8px 10px' }}>
                                                <p style={{ color: NAVY, fontSize: 12, fontWeight: 600, fontFamily: FH, margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{img.label}</p>
                                                <p style={{ color: '#94a3b8', fontSize: 11, fontFamily: FH, margin: 0 }}>{img.category}</p>
                                            </div>
                                            <button onClick={() => void softDelete(img._id)} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(239,68,68,0.88)', border: 'none', borderRadius: 6, width: 26, height: 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }} title="Изтрий">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* Deleted images */}
            {deletedImages.length > 0 && (
                <div style={{ marginTop: 32 }}>
                    <button
                        onClick={() => setShowDeleted(v => !v)}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '8px 16px', color: '#64748b', fontSize: 13, fontWeight: 600, fontFamily: FH, cursor: 'pointer', marginBottom: showDeleted ? 16 : 0 }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points={showDeleted ? '18 15 12 9 6 15' : '6 9 12 15 18 9'}/></svg>
                        Изтрити снимки ({deletedImages.length})
                    </button>

                    {showDeleted && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                            {deletedImages.map(img => (
                                <div key={img._id} style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', opacity: 0.75 }}>
                                    <img src={img.urlSmall ?? img.url} alt={img.label} style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block', filter: 'grayscale(0.4)' }} />
                                    <div style={{ padding: '8px 10px' }}>
                                        <p style={{ color: NAVY, fontSize: 12, fontWeight: 600, fontFamily: FH, margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{img.label}</p>
                                        <p style={{ color: '#94a3b8', fontSize: 11, fontFamily: FH, margin: '0 0 8px' }}>{img.category}</p>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button onClick={() => void restore(img._id)} style={{ flex: 1, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, padding: '5px 0', color: '#15803d', fontSize: 11, fontWeight: 700, fontFamily: FH, cursor: 'pointer' }}>Възстанови</button>
                                            <button onClick={() => void hardDelete(img._id)} style={{ flex: 1, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '5px 0', color: '#dc2626', fontSize: 11, fontWeight: 700, fontFamily: FH, cursor: 'pointer' }}>Изтрий</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
