import { useState, useEffect, useRef } from 'react';
import { api } from '../../api/client';
import { fetchCategories, invalidateCategoriesCache, type Category } from '../../api/categoryCache';

interface GalleryImage {
    _id: string;
    label: string;
    category: string;
    materials?: string;
    duration?: string;
    url: string;
    urlSmall?: string;
}

interface DraftCat {
    _id?: string;   // undefined = newly added, not yet saved
    name: string;
}

function catsEqual(a: DraftCat[], b: DraftCat[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((x, i) => x._id === b[i]._id && x.name === b[i].name);
}

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
    const fileRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({ label: '', category: '', materials: '', duration: '' });
    const [preview, setPreview] = useState<string | null>(null);
    const [fileData, setFileData] = useState<{ base64: string; name: string; type: string } | null>(null);

    const hasChanges = !catsEqual(draftCats, savedCats);

    const loadCategories = async () => {
        const cats = await fetchCategories();
        setSavedCats(cats);
        setDraftCats(cats.map(c => ({ ...c })));
        if (cats.length > 0) setForm(f => f.category ? f : { ...f, category: cats[0].name });
        return cats;
    };

    const loadImages = async () => {
        const res = await api.get<{ images: GalleryImage[] }>('/gallery');
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

    const addToDraft = () => {
        const name = newCat.trim();
        if (!name) return;
        if (draftCats.find(c => c.name.toLowerCase() === name.toLowerCase())) {
            setCatError('Категорията вече съществува');
            return;
        }
        setCatError('');
        setDraftCats(prev => [...prev, { name }]);
        setNewCat('');
    };

    const removeFromDraft = (idx: number) => {
        setDraftCats(prev => prev.filter((_, i) => i !== idx));
    };

    const saveCats = async () => {
        setSavingCats(true);
        setCatError('');
        try {
            const toDelete = savedCats.filter(s => !draftCats.find(d => d._id === s._id));
            const toAdd    = draftCats.filter(d => !d._id);

            await Promise.all([
                ...toDelete.map(c => api.delete(`/categories/${c._id}`)),
                ...toAdd.map(c => api.post<{ category: Category }>('/categories', { name: c.name })),
            ]);

            invalidateCategoriesCache();
            await loadCategories();
        } catch (err) {
            setCatError(err instanceof Error ? err.message : 'Грешка при запазване');
        } finally {
            setSavingCats(false);
        }
    };

    const discardCats = () => {
        setCatError('');
        setNewCat('');
        setDraftCats(savedCats.map(c => ({ ...c })));
    };

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
        setUploading(true);
        setError('');
        try {
            await api.post('/gallery', { file: fileData, ...form });
            setSuccess('Снимката е качена успешно');
            setForm(f => ({ ...f, label: '', materials: '', duration: '' }));
            setPreview(null);
            setFileData(null);
            if (fileRef.current) fileRef.current.value = '';
            await loadImages();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Грешка при качване');
        } finally {
            setUploading(false);
        }
    };

    const deleteImage = async (id: string) => {
        if (!confirm('Изтрий снимката?')) return;
        try {
            await api.delete(`/gallery/${id}`);
            setImages(prev => prev.filter(img => img._id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Грешка при изтриване');
        }
    };

    const inp: React.CSSProperties = { width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '9px 12px', color: '#f1f5f9', fontSize: 14, boxSizing: 'border-box', outline: 'none' };
    const lbl: React.CSSProperties = { display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 4 };
    const actionBtn = (active: boolean, orange = false): React.CSSProperties => ({
        background: orange ? (active ? '#f97316' : '#7c3c10') : (active ? '#334155' : '#1e293b'),
        color: active ? '#fff' : '#475569',
        border: `1px solid ${active ? (orange ? '#f97316' : '#475569') : '#1e3a5f'}`,
        borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 700,
        cursor: active ? 'pointer' : 'not-allowed', opacity: active ? 1 : 0.5,
    });

    return (
        <div>
            <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 700, margin: '0 0 28px' }}>Галерия</h2>

            {/* Category manager */}
            <div style={{ background: '#1e293b', borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <h3 style={{ color: '#cbd5e1', fontSize: 16, fontWeight: 600, margin: '0 0 14px' }}>Категории</h3>

                {/* Row 1 — existing tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, minHeight: 36, marginBottom: 14 }}>
                    {loading && <span style={{ color: '#64748b', fontSize: 13 }}>Зареждане...</span>}
                    {!loading && draftCats.length === 0 && <span style={{ color: '#64748b', fontSize: 13 }}>Няма категории</span>}
                    {draftCats.map((cat, i) => (
                        <div key={cat._id ?? `new-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 6, background: cat._id ? '#0f172a' : 'rgba(249,115,22,0.12)', border: `1px solid ${cat._id ? '#334155' : 'rgba(249,115,22,0.4)'}`, borderRadius: 20, padding: '5px 8px 5px 14px', transition: 'border-color 0.15s' }}>
                            <span style={{ color: cat._id ? '#cbd5e1' : '#fb923c', fontSize: 13, fontWeight: 600 }}>{cat.name}</span>
                            {!cat._id && <span style={{ fontSize: 10, color: '#f97316', fontWeight: 700, letterSpacing: '0.06em' }}>НОВО</span>}
                            <button
                                onClick={() => removeFromDraft(i)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: '2px 4px', borderRadius: 4 }}
                                title="Премахни"
                            >
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                    ))}
                </div>

                {catError && <div style={{ color: '#fca5a5', fontSize: 13, marginBottom: 10 }}>{catError}</div>}

                {/* Row 2 — add + save/discard on one line */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                        style={{ ...inp, flex: 1 }}
                        placeholder="Нова категория..."
                        value={newCat}
                        onChange={e => { setNewCat(e.target.value); setCatError(''); }}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addToDraft(); } }}
                    />
                    <button onClick={addToDraft} disabled={!newCat.trim()} style={actionBtn(!!newCat.trim(), true)}>
                        + Добави
                    </button>
                    <div style={{ width: 1, height: 28, background: '#334155', flexShrink: 0 }} />
                    <button onClick={() => void saveCats()} disabled={!hasChanges || savingCats} style={actionBtn(hasChanges && !savingCats, true)}>
                        {savingCats ? 'Запазване...' : 'Запази'}
                    </button>
                    <button onClick={discardCats} disabled={!hasChanges} style={actionBtn(hasChanges)}>
                        Изчисти
                    </button>
                </div>
            </div>

            {/* Upload form */}
            <div style={{ background: '#1e293b', borderRadius: 12, padding: 24, marginBottom: 32 }}>
                <h3 style={{ color: '#cbd5e1', fontSize: 16, fontWeight: 600, margin: '0 0 20px' }}>Качи нова снимка</h3>
                <form onSubmit={upload} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                        <div
                            onClick={() => fileRef.current?.click()}
                            style={{ flexShrink: 0, width: 120, height: 100, borderRadius: 8, border: '2px dashed #334155', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}
                        >
                            {preview
                                ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <span style={{ color: '#64748b', fontSize: 13, textAlign: 'center', padding: 8 }}>Избери файл</span>
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
                    <div>
                        <label style={lbl}>Материали</label>
                        <input style={inp} value={form.materials} onChange={e => setForm(f => ({ ...f, materials: e.target.value }))} placeholder="напр. Porcelanosa 60×60" />
                    </div>
                    <div>
                        <label style={lbl}>Срок на изпълнение</label>
                        <input style={inp} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="напр. 12 дни" />
                    </div>

                    {error && <div style={{ gridColumn: '1/-1', color: '#fca5a5', fontSize: 13 }}>{error}</div>}
                    {success && <div style={{ gridColumn: '1/-1', color: '#86efac', fontSize: 13 }}>{success}</div>}

                    <div style={{ gridColumn: '1/-1' }}>
                        <button type="submit" disabled={uploading || savedCats.length === 0} style={{ background: '#f97316', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 700, cursor: uploading || savedCats.length === 0 ? 'not-allowed' : 'pointer', opacity: uploading || savedCats.length === 0 ? 0.7 : 1 }}>
                            {uploading ? 'Качване...' : 'Качи снимката'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Images grid */}
            {loading ? (
                <div style={{ color: '#64748b', fontSize: 14 }}>Зареждане...</div>
            ) : images.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: 14 }}>Няма качени снимки</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
                    {images.map(img => (
                        <div key={img._id} style={{ background: '#1e293b', borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
                            <img src={img.urlSmall ?? img.url} alt={img.label} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
                            <div style={{ padding: '10px 12px' }}>
                                <p style={{ color: '#f1f5f9', fontSize: 13, fontWeight: 600, margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{img.label}</p>
                                <p style={{ color: '#64748b', fontSize: 12, margin: 0 }}>{img.category}</p>
                            </div>
                            <button
                                onClick={() => void deleteImage(img._id)}
                                style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(239,68,68,0.85)', border: 'none', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
                                title="Изтрий"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
