import TeamSchedule from '../sections/TeamSchedule';

interface Props { onNavigate: (href: string) => void; }

export default function CalendarPage({ onNavigate: _onNavigate }: Props) {
    return (
        <div style={{ minHeight: '100vh', background: '#0f1f3d' }}>
            <TeamSchedule />
        </div>
    );
}
