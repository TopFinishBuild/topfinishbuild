import { useState, useEffect, useRef } from 'react';
import { api } from '../../api/client';
import { prepareImage } from '../../utils/image';
import { inp, lbl, card, sectionTitle, muted, successBox, errorBox, primaryBtn, NAVY, FH } from './theme';

interface Partner { _id: string; name: string; url: string; urlSmall?: string; }

export default function PartnersManager() {
    const [partners, setPartners]   = useState<Partner[]>([]);
    const [loading, setLoading]     = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError]         = useState('');
    const [success, setSuccess]     = useState('');
    const [name, setName]           = useState('');
    const [preview, setPreview]     = useState<string | null>(null);
    const [fileData, setFileData]   = useState<{ base64: string; name: string; type: string } | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const load = async () => { const res = await api.get<{ partners: Partner[] }>('/partners'); setPartners(res.partners); };
    useEffect(() => { load().catch(() => setError('Грешка при зареждане')).finally(() => setLoading(false)); }, []);

    const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file) return;
        const data = await prepareImage(file, { maxDim: 600 });
        setPreview(data.base64); setFileData(data);
    };

    const upload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileData || !name.trim()) { setError('Логото и името са задължителни'); return; }
        setUploading(true); setError('');
        try {
            await api.post('/partners', { file: fileData, name: name.trim() });
            setSuccess('Партньорът е добавен'); setName(''); setPreview(null); setFileData(null);
            if (fileRef.current) fileRef.current.value = '';
            await load(); setTimeout(() => setSuccess(''), 3000);
        } catch (err) { setError(err instanceof Error ? err.message : 'Грешка при качване'); }
        finally { setUploading(false); }
    };

    const remove = async (id: string) => {
        if (!confirm('Изтрий партньора?')) return;
        try { await api.delete(`/partners/${id}`); setPartners(prev => prev.filter(p => p._id !== id)); }
        catch { setError('Грешка при изтриване'); }
    };

    return (
        <div>
            <h2 style={{ ...sectionTitle, fontSize: 22, marginBottom: 4 }}>Партньори</h2>
            <p style={{ ...muted, marginBottom: 24 }}>Логата се оразмеряват автоматично.</p>

            <div style={card}>
                <h3 style={sectionTitle}>Добави партньор</h3>
                <form onSubmit={upload} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                        <div
                            onClick={() => fileRef.current?.click()}
                            style={{ flexShrink: 0, width: 120, height: 80, borderRadius: 8, border: '2px dashed #e2e8f0', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}
                        >
                            {preview
                                ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }} />
                                : <span style={{ color: '#94a3b8', fontSize: 12, textAlign: 'center', padding: 8, fontFamily: FH }}>Лого</span>
                            }
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
                        <div style={{ flex: 1 }}>
                            <label style={lbl}>Име на партньора *</label>
                            <input style={inp} value={name} onChange={e => setName(e.target.value)} required placeholder="напр. Bosch" />
                        </div>
                    </div>
                    {error   && <div style={errorBox}>{error}</div>}
                    {success && <div style={successBox}>{success}</div>}
                    <div><button type="submit" disabled={uploading || !fileData || !name.trim()} style={primaryBtn(uploading || !fileData || !name.trim())}>{uploading ? 'Качване...' : 'Добави'}</button></div>
                </form>
            </div>

            {loading ? <div style={muted}>Зареждане...</div>
            : partners.length === 0 ? <div style={muted}>Няма добавени партньори</div>
            : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
                    {partners.map(p => (
                        <div key={p._id} style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', position: 'relative', boxShadow: '0 1px 3px rgba(15,31,61,0.06)' }}>
                            <div style={{ background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80, padding: 12 }}>
                                <img src={p.urlSmall ?? p.url} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            </div>
                            <div style={{ padding: '8px 10px' }}>
                                <p style={{ color: NAVY, fontSize: 12, fontWeight: 600, fontFamily: FH, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                            </div>
                            <button onClick={() => void remove(p._id)} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(239,68,68,0.88)', border: 'none', borderRadius: 6, width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }} title="Изтрий">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
