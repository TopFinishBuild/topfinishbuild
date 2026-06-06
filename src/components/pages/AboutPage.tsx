import { useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { PageHero } from '../common/PageHero';
import { SectionLabel } from '../common/SectionLabel';

const NAVY   = '#0f1f3d';
const ORANGE = '#f07420';
const GRAY   = '#6b7280';
const FH     = "'Manrope',sans-serif";

const VALUES = [
  {
    icon: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    title: 'Прецизност',
    desc: 'Всеки детайл е важен. Работим с грижа и внимание към качеството на всяка стъпка от ремонта.',
  },
  {
    icon: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    title: 'Бързина',
    desc: 'Спазваме договорените срокове, без да правим компромис с качеството на изпълнение.',
  },
  {
    icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    title: 'Екип',
    desc: 'Сертифицирани специалисти с дългогодишен опит в довършителните ремонтни дейности.',
  },
  {
    icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    title: 'Интериорен дизайн',
    desc: 'Работим в партньорство с интериорен дизайнер — при нужда можем да препоръчаме и насочим.',
  },
];

const STATS = [
  { number: '350+', label: 'Завършени обекта' },
  { number: '12+',  label: 'Години опит' },
  { number: '100%', label: 'Доволни клиенти' },
];

interface AboutPageProps {
  onNavigate: (href: string) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  const isMobile = useIsMobile();
  const [btnHover, setBtnHover] = useState(false);

  return (
    <div style={{ background: '#fff' }}>

      <PageHero
        label="За нас"
        title={<>TOPFINISH <em>BUILD</em></>}
        description="Вашият надежден партньор за довършителни ремонтни дейности в жилищни, офис и индустриални пространства."
      />

      {/* Main content */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '60px 24px' : '100px 48px' }}>

        {/* Story section */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 48 : 80, alignItems: 'center', marginBottom: isMobile ? 60 : 100 }}>
          <div>
            <SectionLabel>Нашата история</SectionLabel>
            <h2 className="section-title" style={{ marginTop: 10 }}>
              ПОВЕЧЕ ОТ <em>12 ГОДИНИ</em><br/>В БРАНША
            </h2>
            <div className="divider" style={{ margin: '16px 0' }} />
            <p style={{ fontFamily: FH, fontSize: 16, color: GRAY, lineHeight: 1.9, marginBottom: 16 }}>
              TopFinish Build е специализирана строителна фирма за довършителни ремонтни дейности, основана с мисията да трансформира пространствата на своите клиенти с максимален професионализъм и внимание към детайла.
            </p>
            <p style={{ fontFamily: FH, fontSize: 16, color: GRAY, lineHeight: 1.9, marginBottom: 16 }}>
              В продължение на повече от 12 години сме завършили над 350 обекта — от уютни домове и модерни офиси до производствени и индустриални пространства. Всеки проект третираме индивидуално, съобразявайки се с нуждите и визията на клиента.
            </p>
            <p style={{ fontFamily: FH, fontSize: 16, color: GRAY, lineHeight: 1.9 }}>
              Нашият екип включва сертифицирани майстори по плочкаристки, шпакловъчни, бояджийски и гипсокартонени работи, ВиК и електро инсталации. При необходимост работим и с партньорски интериорен дизайнер, за да осигурим пълноценно решение от идеята до завършения обект.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {STATS.map(s => (
              <div key={s.label} style={{ background: '#f8fafc', borderRadius: 16, padding: '28px 16px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
                <div style={{ fontFamily: FH, fontSize: isMobile ? 32 : 40, fontWeight: 900, color: ORANGE, lineHeight: 1 }}>{s.number}</div>
                <div style={{ fontFamily: FH, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: GRAY, marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* What we do */}
        <div style={{ marginBottom: isMobile ? 60 : 100 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <SectionLabel>Какво правим</SectionLabel>
            <h2 className="section-title" style={{ marginTop: 10 }}>
              РЕМОНТНИ РЕШЕНИЯ ЗА<br/><em>ВСЕКИ ВИД ПРОСТРАНСТВО</em>
            </h2>
            <div className="divider" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 28 }}>
            {[
              { title: 'Жилищни пространства', desc: 'Пълни ремонти на апартаменти и къщи — от бани и кухни до хол и спални. Индивидуален подход за всеки дом.' },
              { title: 'Офис и търговски обекти', desc: 'Офис ремонти, търговски площи и заведения. Работим в удобно за клиента работно време, за да не пречим на бизнеса.' },
              { title: 'Индустриални пространства', desc: 'Производствени зали, складове и индустриални помещения. Издръжливи решения, съобразени с натоварена среда.' },
            ].map(item => (
              <div key={item.title} style={{ background: '#f8fafc', borderRadius: 16, padding: '32px 28px', border: '1px solid #f1f5f9' }}>
                <div style={{ width: 48, height: 4, background: ORANGE, borderRadius: 2, marginBottom: 20 }} />
                <h3 style={{ fontFamily: FH, fontSize: 19, fontWeight: 800, color: NAVY, marginBottom: 12 }}>{item.title}</h3>
                <p style={{ fontFamily: FH, fontSize: 15, color: GRAY, lineHeight: 1.75 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={{ marginBottom: isMobile ? 60 : 100 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <SectionLabel>Екипът</SectionLabel>
            <h2 className="section-title" style={{ marginTop: 10 }}>
              ЛИЦЕТО ЗАД<br/><em>TOPFINISH BUILD</em>
            </h2>
            <div className="divider" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {[
              { name: 'инж. Михаил Василев', role: 'Съосновател & Технически ръководител', img: '/misho.webp' },
             ].map(p => (
              <div key={p.name} style={{ textAlign: 'center', width: isMobile ? '100%' : 360 }}>
                <div style={{ width: '100%', aspectRatio: '4/5', background: '#f1f5f9', borderRadius: 16, overflow: 'hidden', marginBottom: 20, border: '1px solid #e5e7eb' }}>
                  <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                </div>
                <h3 style={{ fontFamily: FH, fontSize: 20, fontWeight: 800, color: NAVY, margin: '0 0 6px' }}>{p.name}</h3>
                <p style={{ fontFamily: FH, fontSize: 14, color: ORANGE, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>{p.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div style={{ marginBottom: isMobile ? 60 : 100 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <SectionLabel>Нашите ценности</SectionLabel>
            <h2 className="section-title" style={{ marginTop: 10 }}>
              ЗАЩО ДА ИЗБЕРЕТЕ<br/><em>TOPFINISH BUILD</em>
            </h2>
            <div className="divider" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 24 }}>
            {VALUES.map(v => (
              <div key={v.title} style={{ textAlign: 'center', padding: '32px 20px', background: '#fff', border: '1px solid #f1f5f9', borderRadius: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ width: 56, height: 56, background: ORANGE, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: v.icon }} />
                </div>
                <h3 style={{ fontFamily: FH, fontSize: 16, fontWeight: 800, color: NAVY, marginBottom: 8 }}>{v.title}</h3>
                <p style={{ fontFamily: FH, fontSize: 14, color: GRAY, lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: NAVY, borderRadius: 20, padding: isMobile ? '40px 24px' : '60px 80px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: FH, fontSize: isMobile ? 28 : 38, fontWeight: 900, color: '#fff', marginBottom: 16 }}>
            Готови за вашия проект?
          </h2>
          <p style={{ fontFamily: FH, fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.8 }}>
            Свържете се с нас за безплатна консултация и оферта, изготвена специално за вашия обект.
          </p>
          <button
            style={{ background: btnHover ? '#d4601a' : ORANGE, color: '#fff', padding: '16px 40px', fontFamily: FH, fontWeight: 700, fontSize: 15, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 50, border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            onClick={() => onNavigate('#calendar')}
          >
            Поискайте оферта →
          </button>
        </div>

      </div>
    </div>
  );
}
