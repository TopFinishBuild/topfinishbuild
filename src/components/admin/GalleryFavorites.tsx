import { useState, type CSSProperties } from 'react';
import { Star } from 'lucide-react';
import { card, sectionTitle, muted, ORANGE, NAVY, FH } from './theme';

export interface FavoriteImage {
    _id: string;
    label: string;
    category: string;
    url: string;
    urlSmall?: string;
    favorite?: boolean;
    favoriteOrder?: number;
}

interface Props {
    /** Active images, category names already live-renamed. */
    images: FavoriteImage[];
    cats: { _id?: string; name: string }[];
    onReorder: (ids: string[]) => void;
}

const tile: CSSProperties = {
    background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 10,
    overflow: 'hidden', position: 'relative', boxShadow: '0 1px 3px rgba(15,31,61,0.06)',
};

const thumb: CSSProperties = {
    width: '100%', height: 130, objectFit: 'cover', display: 'block', pointerEvents: 'none',
};

const caption: CSSProperties = {
    color: NAVY, fontSize: 12, fontWeight: 600, fontFamily: FH, margin: '0 0 2px',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
};

/** One slot per category: its favorite, or a blurred placeholder until one is picked. */
export default function GalleryFavorites({ images, cats, onReorder }: Props) {
    const [drag, setDrag] = useState<string | null>(null);
    const [over, setOver] = useState<string | null>(null);

    const catNames = new Set(cats.map(c => c.name));
    const favs = images
        .filter(i => i.favorite && catNames.has(i.category))
        .sort((a, b) => (a.favoriteOrder ?? 0) - (b.favoriteOrder ?? 0));
    const missing = cats.filter(c => !favs.some(f => f.category === c.name));

    const reset = () => { setDrag(null); setOver(null); };

    const drop = (targetId: string) => {
        if (!drag || drag === targetId) { reset(); return; }
        const ids = favs.map(f => f._id);
        const from = ids.indexOf(drag);
        const to   = ids.indexOf(targetId);
        reset();
        if (from === -1 || to === -1) return;
        ids.splice(to, 0, ...ids.splice(from, 1));
        onReorder(ids);
    };

    return (
        <div style={{ ...card, border: `1.5px solid ${ORANGE}33` }}>
            <h3 style={{ ...sectionTitle, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Star size={16} color={ORANGE} fill={ORANGE} />
                Любими
                <span style={{ color: '#94a3b8', fontSize: 12, fontWeight: 400 }}>
                    ({favs.length}/{cats.length}) • една на категория, маркира се със ★ • влачи за пренареждане
                </span>
            </h3>

            {cats.length === 0 ? (
                <span style={muted}>Няма категории</span>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                    {favs.map((img, i) => (
                        <div
                            key={img._id}
                            draggable
                            onDragStart={e => { e.stopPropagation(); setDrag(img._id); }}
                            onDragOver={e => { e.preventDefault(); if (drag) setOver(img._id); }}
                            onDrop={e => { e.preventDefault(); drop(img._id); }}
                            onDragEnd={reset}
                            style={{
                                ...tile, cursor: 'grab', borderColor: ORANGE,
                                outline: over === img._id ? `2px solid ${ORANGE}` : '2px solid transparent',
                                opacity: drag === img._id ? 0.4 : 1,
                                transition: 'outline 0.1s, opacity 0.1s',
                            }}
                        >
                            <img src={img.urlSmall ?? img.url} alt={img.label} style={thumb} />
                            <span style={{ position: 'absolute', top: 6, left: 6, background: ORANGE, color: '#fff', borderRadius: 6, minWidth: 22, height: 22, padding: '0 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, fontFamily: FH }}>
                                {i + 1}
                            </span>
                            <div style={{ padding: '8px 10px' }}>
                                <p style={caption}>{img.label}</p>
                                <p style={{ color: ORANGE, fontSize: 11, fontWeight: 700, fontFamily: FH, margin: 0 }}>{img.category}</p>
                            </div>
                        </div>
                    ))}

                    {missing.map(cat => {
                        const sample = images.find(i => i.category === cat.name);
                        return (
                            <div
                                key={cat._id ?? cat.name}
                                aria-disabled
                                title="Няма избрана любима — маркирай снимка със ★ в категорията"
                                style={{ ...tile, cursor: 'not-allowed', borderStyle: 'dashed', opacity: 0.6 }}
                            >
                                {sample
                                    ? <img src={sample.urlSmall ?? sample.url} alt="" style={{ ...thumb, filter: 'blur(4px) grayscale(1)', transform: 'scale(1.1)' }} />
                                    : <div style={{ ...thumb, background: '#f1f5f9' }} />}
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: 11, fontWeight: 700, fontFamily: FH, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    Не е избрана
                                </div>
                                <div style={{ padding: '8px 10px' }}>
                                    <p style={{ ...caption, color: '#94a3b8' }}>—</p>
                                    <p style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, fontFamily: FH, margin: 0 }}>{cat.name}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
