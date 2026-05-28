import { useState, useEffect, useRef } from 'react';
import { api } from '../../api/client';

interface Partner {
    _id: string;
    name: string;
    url: string;
    urlSmall?: string;
}

const inp: React.CSSProperties = { width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '9px 12px', color: '#f1f5f9', fontSize: 14, boxSizing: 'border-box', outline: 'none' };
const lbl: React.CSSProperties = { display: 'block', color: '#b0c4d5', fontSize: 12, fontWeight: 600, marginBottom: 4 };

export default function PartnersManager() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading]   = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError]       = useState('');
    const [success, setSuccess]   = useState('');
    const [name, setName]         = useState('');
    const [preview, setPreview]   = useState<string | null>(null);
    const [fileData, setFileData] = useState<{ base64: string; name: string; type: string } | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const load = async () => {
        const res = await api.get<{ partners: Partner[] }>('/partners');
        setPartners(res.partners);
    };

    useEffect(() => {
        load().catch(() => setError('Грешка при зареждане')).finally(() => setLoading(false));
    }, []);

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
        if (!fileData || !name.trim()) { setError('Логото и името са задължителни'); return; }
        setUploading(true); setError('');
        try {
            await api.post('/partners', { file: fileData, name: name.trim() });
            setSuccess('Партньорът е добавен');
            setName(''); setPreview(null); setFileData(null);
            if (fileRef.current) fileRef.current.value = '';
            await load();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Грешка при качване');
        } finally { setUploading(false); }
    };

    const remove = async (id: string) => {
        if (!confirm('Изтрий партньора?')) return;
        try {
            await api.delete(`/partners/${id}`);
            setPartners(prev => prev.filter(p => p._id !== id));
        } catch { setError('Грешка при изтриване'); }
    };

    return (
        <div>
            <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 700, margin: '0 0 28px' }}>Партньори</h2>
            <p style={{ color: '#8fa4b8', fontSize: 13, marginTop: -20, marginBottom: 24 }}>
                Логата се оразмеряват автоматично до малък формат.
            </p>

            {/* Upload */}
            <div style={{ background: '#1e293b', borderRadius: 12, padding: 24, marginBottom: 32 }}>
                <h3 style={{ color: '#dae4ee', fontSize: 16, fontWeight: 600, margin: '0 0 20px' }}>Добави партньор</h3>
                <form onSubmit={upload} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                        <div
                            onClick={() => fileRef.current?.click()}
                            style={{ flexShrink: 0, width: 120, height: 80, borderRadius: 8, border: '2px dashed #334155', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}
                        >
                            {preview
                                ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }} />
                                : <span style={{ color: '#8fa4b8', fontSize: 12, textAlign: 'center', padding: 8 }}>Лого</span>
                            }
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
                        <div style={{ flex: 1 }}>
                            <label style={lbl}>Име на партньора *</label>
                            <input style={inp} value={name} onChange={e => setName(e.target.value)} required placeholder="напр. Bosch" />
                        </div>
                    </div>

                    {error   && <div style={{ color: '#fca5a5', fontSize: 13 }}>{error}</div>}
                    {success && <div style={{ color: '#86efac', fontSize: 13 }}>{success}</div>}

                    <div>
                        <button type="submit" disabled={uploading || !fileData || !name.trim()} style={{ background: '#f97316', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 700, cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1 }}>
                            {uploading ? 'Качване...' : 'Добави'}
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            {loading ? (
                <div style={{ color: '#8fa4b8', fontSize: 14 }}>Зареждане...</div>
            ) : partners.length === 0 ? (
                <div style={{ color: '#8fa4b8', fontSize: 14 }}>Няма добавени партньори</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
                    {partners.map(p => (
                        <div key={p._id} style={{ background: '#1e293b', borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
                            <div style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80, padding: 12 }}>
                                <img src={p.urlSmall ?? p.url} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            </div>
                            <div style={{ padding: '8px 10px' }}>
                                <p style={{ color: '#dae4ee', fontSize: 12, fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                            </div>
                            <button
                                onClick={() => void remove(p._id)}
                                style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(239,68,68,0.85)', border: 'none', borderRadius: 6, width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
                                title="Изтрий"
                            >
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
