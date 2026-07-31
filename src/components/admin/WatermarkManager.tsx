import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { api } from '../../api/client';
import { prepareImage } from '../../utils/image';
import { lbl, card, sectionTitle, muted, successBox, errorBox, primaryBtn, ORANGE, NAVY, FH } from './theme';

type Position =
    | 'top-left'    | 'top-center'    | 'top-right'
    | 'middle-left' | 'center'        | 'middle-right'
    | 'bottom-left' | 'bottom-center' | 'bottom-right';

interface Watermark {
    enabled: boolean;
    key?: string;
    url?: string;
    position: Position;
    opacity: number;
    size: number;
    margin: number;
}

const DEFAULTS: Watermark = { enabled: false, position: 'bottom-right', opacity: 0.6, size: 22, margin: 3 };

const GRID: Position[] = [
    'top-left',    'top-center',    'top-right',
    'middle-left', 'center',        'middle-right',
    'bottom-left', 'bottom-center', 'bottom-right',
];

const PREVIEW_RATIO = 3 / 4; // height / width of the preview box

/** Mirrors the server placement. Horizontal % resolves against width; vertical is ratio-corrected. */
function overlayStyle(w: Watermark): CSSProperties {
    const mx = `${w.margin}%`;
    const my = `${w.margin / PREVIEW_RATIO}%`;
    const base: CSSProperties = { position: 'absolute', width: `${w.size}%`, opacity: w.opacity };

    const [row, col] = w.position === 'center'
        ? ['middle', 'center']
        : w.position.split('-');

    if (row === 'top')    base.top = my;
    if (row === 'bottom') base.bottom = my;
    if (row === 'middle') { base.top = '50%'; }

    if (col === 'left')  base.left = mx;
    if (col === 'right') base.right = mx;
    if (col === 'center') { base.left = '50%'; }

    const tx = col === 'center' ? '-50%' : '0';
    const ty = row === 'middle' ? '-50%' : '0';
    if (tx !== '0' || ty !== '0') base.transform = `translate(${tx}, ${ty})`;

    return base;
}

function Slider({ label, value, min, max, step, suffix, onChange }: {
    label: string; value: number; min: number; max: number; step: number; suffix: string;
    onChange: (n: number) => void;
}) {
    return (
        <div>
            <label style={{ ...lbl, display: 'flex', justifyContent: 'space-between' }}>
                <span>{label}</span>
                <span style={{ color: ORANGE, fontWeight: 700 }}>{suffix === '%' ? Math.round(value) : value.toFixed(2)}{suffix}</span>
            </label>
            <input
                type="range" min={min} max={max} step={step} value={value}
                onChange={e => onChange(Number(e.target.value))}
                style={{ width: '100%', accentColor: ORANGE, cursor: 'pointer' }}
            />
        </div>
    );
}

export default function WatermarkManager() {
    const [wm, setWm]           = useState<Watermark>(DEFAULTS);
    const [sample, setSample]   = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving]   = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError]     = useState('');
    const [success, setSuccess] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        Promise.all([
            api.get<{ watermark?: Watermark }>('/settings'),
            api.get<{ images: { url: string; urlSmall?: string }[] }>('/gallery?limit=1').catch(() => ({ images: [] })),
        ])
            .then(([s, g]) => {
                if (s.watermark) setWm({ ...DEFAULTS, ...s.watermark });
                if (g.images.length > 0) setSample(g.images[0].url);
            })
            .catch(() => setError('Грешка при зареждане'))
            .finally(() => setLoading(false));
    }, []);

    const flash = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

    const onLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true); setError('');
        try {
            const data = await prepareImage(file, { maxDim: 600, format: 'image/png' });
            const res = await api.post<{ watermark: Watermark }>('/settings/watermark/logo', { file: data });
            setWm({ ...DEFAULTS, ...res.watermark });
            flash('Логото е качено');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Грешка при качване');
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    const save = async () => {
        setSaving(true); setError('');
        try {
            const res = await api.put<{ watermark: Watermark }>('/settings/watermark', {
                enabled: wm.enabled, position: wm.position,
                opacity: wm.opacity, size: wm.size, margin: wm.margin,
            });
            setWm({ ...DEFAULTS, ...res.watermark });
            flash('Настройките са запазени');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Грешка при запазване');
        } finally { setSaving(false); }
    };

    if (loading) return <div style={muted}>Зареждане...</div>;

    const hasLogo = Boolean(wm.url);

    return (
        <div>
            <h2 style={{ ...sectionTitle, fontSize: 22, margin: 0 }}>Воден знак</h2>
            <p style={{ ...muted, marginTop: 6, marginBottom: 24 }}>
                Прилага се автоматично при качване на нови снимки в Галерия и Преди/След.
                Вече качените снимки не се променят. Партньорските лога се пропускат.
            </p>

            {success && <div style={successBox}>{success}</div>}
            {error   && <div style={errorBox}>{error}</div>}

            <div style={card}>
                <h3 style={sectionTitle}>Лого</h3>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div
                        onClick={() => !uploading && fileRef.current?.click()}
                        title="Кликни за избор"
                        style={{
                            width: 160, height: 110, borderRadius: 8, cursor: uploading ? 'wait' : 'pointer',
                            border: '2px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden', flexShrink: 0,
                            // checkerboard so transparency is visible
                            backgroundImage: 'linear-gradient(45deg,#eef1f5 25%,transparent 25%,transparent 75%,#eef1f5 75%),linear-gradient(45deg,#eef1f5 25%,transparent 25%,transparent 75%,#eef1f5 75%)',
                            backgroundSize: '16px 16px',
                            backgroundPosition: '0 0, 8px 8px',
                            backgroundColor: '#fff',
                        }}
                    >
                        {hasLogo
                            ? <img src={wm.url} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', padding: 8 }} />
                            : <span style={{ color: '#94a3b8', fontSize: 12, textAlign: 'center', padding: 8, fontFamily: FH }}>Кликни за лого</span>
                        }
                    </div>
                    <div style={{ flex: 1, minWidth: 220 }}>
                        <p style={{ ...muted, margin: '0 0 10px' }}>
                            PNG с прозрачен фон дава най-добър резултат. Качва се до 600px ширина.
                        </p>
                        <button
                            onClick={() => fileRef.current?.click()}
                            disabled={uploading}
                            style={primaryBtn(uploading)}
                        >
                            {uploading ? 'Качване...' : hasLogo ? 'Смени логото' : 'Качи лого'}
                        </button>
                    </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={onLogo} style={{ display: 'none' }} />
            </div>

            <div style={card}>
                <h3 style={sectionTitle}>Настройки</h3>

                <label style={{
                    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
                    cursor: hasLogo ? 'pointer' : 'not-allowed', opacity: hasLogo ? 1 : 0.5,
                }}>
                    <input
                        type="checkbox" checked={wm.enabled} disabled={!hasLogo}
                        onChange={e => setWm(w => ({ ...w, enabled: e.target.checked }))}
                        style={{ width: 18, height: 18, accentColor: ORANGE, cursor: 'inherit' }}
                    />
                    <span style={{ color: NAVY, fontSize: 14, fontWeight: 600, fontFamily: FH }}>
                        Активен воден знак
                    </span>
                </label>
                {!hasLogo && <p style={{ ...muted, marginTop: -12, marginBottom: 20 }}>Качете лого, за да активирате.</p>}

                <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
                    <div style={{ flexShrink: 0 }}>
                        <label style={lbl}>Позиция</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 42px)', gap: 6 }}>
                            {GRID.map(p => {
                                const active = wm.position === p;
                                return (
                                    <button
                                        key={p} type="button" title={p}
                                        onClick={() => setWm(w => ({ ...w, position: p }))}
                                        style={{
                                            width: 42, height: 42, borderRadius: 6, cursor: 'pointer',
                                            border: `1.5px solid ${active ? ORANGE : '#e2e8f0'}`,
                                            background: active ? 'rgba(240,116,32,0.1)' : '#f8fafc',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            padding: 0,
                                        }}
                                    >
                                        <span style={{
                                            width: 12, height: 8, borderRadius: 2,
                                            background: active ? ORANGE : '#cbd5e1',
                                        }} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <Slider label="Размер"      value={wm.size}    min={5}    max={60} step={1}    suffix="%"
                            onChange={n => setWm(w => ({ ...w, size: n }))} />
                        <Slider label="Прозрачност" value={wm.opacity} min={0.05} max={1}  step={0.05} suffix=""
                            onChange={n => setWm(w => ({ ...w, opacity: n }))} />
                        <Slider label="Отстъп"      value={wm.margin}  min={0}    max={20} step={1}    suffix="%"
                            onChange={n => setWm(w => ({ ...w, margin: n }))} />
                    </div>
                </div>

                <div style={{ marginTop: 24 }}>
                    <label style={lbl}>Преглед</label>
                    <div style={{
                        position: 'relative', width: '100%', maxWidth: 520,
                        aspectRatio: '4 / 3', borderRadius: 10, overflow: 'hidden',
                        border: '1.5px solid #e2e8f0',
                        background: sample ? '#eef1f5' : 'linear-gradient(135deg,#0f1f3d,#f07420)',
                    }}>
                        {sample && <img src={sample} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        {hasLogo && wm.enabled && <img src={wm.url} alt="" style={overlayStyle(wm)} />}
                        {!wm.enabled && (
                            <span style={{
                                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(15,31,61,0.55)', color: '#fff',
                                fontSize: 13, fontWeight: 700, fontFamily: FH,
                            }}>Изключен</span>
                        )}
                    </div>
                </div>

                <div style={{ marginTop: 24 }}>
                    <button onClick={() => void save()} disabled={saving} style={primaryBtn(saving)}>
                        {saving ? 'Запазване...' : 'Запази'}
                    </button>
                </div>
            </div>
        </div>
    );
}
