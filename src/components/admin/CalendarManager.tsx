import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { fetchSettings, updateSettingsCache } from '../../api/settingsCache';
import { MONTH_NAMES, DAY_NAMES } from '../../data';
import { card, sectionTitle, muted, primaryBtn, ORANGE, NAVY, FH } from './theme';

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstWeekday(y: number, m: number) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }

export default function CalendarManager() {
    const [busyDates, setBusyDates] = useState<Set<string>>(new Set());
    const [cal, setCal]     = useState(() => { const n = new Date(); return { year: n.getFullYear(), month: n.getMonth() }; });
    const [loading, setLoading]   = useState(true);
    const [saving, setSaving]     = useState(false);
    const [toggling, setToggling] = useState(false);
    const [msg, setMsg]           = useState('');
    const [visible, setVisible]   = useState(true);

    useEffect(() => {
        Promise.all([api.get<{ dates: string[] }>('/calendar'), fetchSettings()])
            .then(([calRes, settings]) => { setBusyDates(new Set(calRes.dates)); setVisible(settings.calendarVisible); })
            .catch(() => setMsg('Грешка при зареждане'))
            .finally(() => setLoading(false));
    }, []);

    const toggleVisibility = async () => {
        setToggling(true);
        const next = !visible;
        try { await api.put('/settings', { calendarVisible: next }); updateSettingsCache({ calendarVisible: next }); setVisible(next); }
        catch (err) { setMsg(err instanceof Error ? err.message : 'Грешка'); }
        finally { setToggling(false); }
    };

    const { year, month } = cal;
    const totalDays = daysInMonth(year, month);
    const startDay  = firstWeekday(year, month);
    const dateKey   = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    const toggle = (d: number) => {
        const key = dateKey(d);
        setBusyDates(prev => { const next = new Set(prev); if (next.has(key)) next.delete(key); else next.add(key); return next; });
    };

    const shift = (dir: 1 | -1) => setCal(({ year: y, month: m }) => {
        const nm = m + dir;
        if (nm < 0)  return { year: y - 1, month: 11 };
        if (nm > 11) return { year: y + 1, month: 0 };
        return { year: y, month: nm };
    });

    const save = async () => {
        setSaving(true); setMsg('');
        try { await api.put('/calendar', { dates: [...busyDates] }); setMsg('Запазено успешно!'); setTimeout(() => setMsg(''), 3000); }
        catch (err) { setMsg(err instanceof Error ? err.message : 'Грешка при запазване'); }
        finally { setSaving(false); }
    };

    const navBtn: React.CSSProperties = { width: 36, height: 36, borderRadius: 8, border: '1.5px solid #e2e8f0', cursor: 'pointer', background: '#f8fafc', color: NAVY, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FH };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <h2 style={{ ...sectionTitle, fontSize: 22, margin: 0 }}>Календар — Заети дни</h2>
                    <button
                        onClick={() => void toggleVisibility()} disabled={toggling}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, background: visible ? 'rgba(240,116,32,0.08)' : '#f1f5f9', border: `1.5px solid ${visible ? 'rgba(240,116,32,0.3)' : '#e2e8f0'}`, borderRadius: 6, padding: '5px 12px', color: visible ? ORANGE : '#64748b', fontSize: 12, fontWeight: 600, fontFamily: FH, cursor: toggling ? 'not-allowed' : 'pointer', opacity: toggling ? 0.6 : 1 }}
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {visible ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></> : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>}
                        </svg>
                        {visible ? 'Скрий' : 'Покажи'}
                    </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {msg && <span style={{ color: msg.includes('Грешка') ? '#dc2626' : '#15803d', fontSize: 13, fontFamily: FH }}>{msg}</span>}
                    <button onClick={save} disabled={saving || loading} style={primaryBtn(saving || loading)}>{saving ? 'Запазване...' : 'Запази промените'}</button>
                </div>
            </div>

            {!visible && (
                <div style={{ ...card, color: '#64748b', fontSize: 14, fontFamily: FH }}>
                    Календарът е скрит — натисни "Покажи" за да редактираш заетите дни.
                </div>
            )}

            <div style={{ display: visible ? 'block' : 'none', ...card, maxWidth: 480, marginBottom: 0 }}>
                {loading ? <div style={muted}>Зареждане...</div> : (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                            <button onClick={() => shift(-1)} style={navBtn}>‹</button>
                            <span style={{ color: NAVY, fontSize: 16, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: FH }}>
                                {MONTH_NAMES[month]} {year}
                            </span>
                            <button onClick={() => shift(1)} style={navBtn}>›</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 6 }}>
                            {DAY_NAMES.map((d: string) => (
                                <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: '#94a3b8', fontFamily: FH, padding: '4px 0' }}>{d}</div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
                            {Array.from({ length: startDay }).map((_, i) => <div key={`e${i}`} />)}
                            {Array.from({ length: totalDays }).map((_, i) => {
                                const day  = i + 1;
                                const busy = busyDates.has(dateKey(day));
                                return (
                                    <div key={day} onClick={() => toggle(day)} style={{ borderRadius: 8, padding: '7px 2px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${busy ? ORANGE : '#e2e8f0'}`, background: busy ? 'rgba(240,116,32,0.1)' : '#f8fafc', cursor: 'pointer', minHeight: '2.6rem', userSelect: 'none' }}>
                                        <span style={{ fontSize: 15, fontWeight: 700, fontFamily: FH, color: busy ? ORANGE : NAVY, lineHeight: 1 }}>{day}</span>
                                        <span style={{ width: 5, height: 5, borderRadius: '50%', marginTop: 3, background: busy ? ORANGE : '#e2e8f0', display: 'block' }} />
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ display: 'flex', gap: 20, marginTop: 16, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                            {([['Зает', true], ['Свободен', false]] as const).map(([label, busy]) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontFamily: FH, color: '#475569' }}>
                                    <span style={{ width: 14, height: 14, borderRadius: 3, display: 'inline-block', background: busy ? 'rgba(240,116,32,0.15)' : '#f8fafc', border: `1.5px solid ${busy ? ORANGE : '#e2e8f0'}` }} />
                                    {label}
                                </div>
                            ))}
                            <span style={{ marginLeft: 'auto', fontSize: 12, fontFamily: FH, color: '#94a3b8' }}>Клик за превключване</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
