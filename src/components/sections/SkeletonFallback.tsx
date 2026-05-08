import type { ReactNode } from 'react';

const S = ({ w = '100%', h = 20, r = 8, mb = 0 }: { w?: string | number; h?: number; r?: number; mb?: number }) => (
  <div className="skel-block" style={{ width: w, height: h, borderRadius: r, marginBottom: mb }} />
);

const Section = ({ children, bg = '#fff' }: { children: ReactNode; bg?: string }) => (
  <div style={{ background: bg, padding: '80px 0' }}>
    <div className="container">{children}</div>
  </div>
);

const SectionHeader = () => (
  <div style={{ textAlign: 'center', marginBottom: 48 }}>
    <S w={90} h={28} r={999} mb={16} />
    <div style={{ display: 'flex', justifyContent: 'center' }}><S w={280} h={36} r={6} mb={12} /></div>
    <div style={{ display: 'flex', justifyContent: 'center' }}><S w={60} h={4} r={2} /></div>
  </div>
);

export default function SkeletonFallback() {
  return (
    <div>
      {/* AboutPreview — two column */}
      <Section>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 48, alignItems: 'center' }}>
          <S w="100%" h={320} r={16} />
          <div>
            <S w={80} h={24} r={999} mb={16} />
            <S w="90%" h={40} r={6} mb={8} />
            <S w="75%" h={40} r={6} mb={20} />
            <S w="100%" h={16} r={4} mb={8} />
            <S w="95%" h={16} r={4} mb={8} />
            <S w="80%" h={16} r={4} mb={32} />
            <S w={140} h={44} r={8} />
          </div>
        </div>
      </Section>

      {/* Services — card grid */}
      <Section bg="#f8fafc">
        <SectionHeader />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ padding: 24, borderRadius: 12, background: '#fff' }}>
              <S w={48} h={48} r={12} mb={16} />
              <S w="70%" h={20} r={4} mb={10} />
              <S w="100%" h={14} r={4} mb={6} />
              <S w="85%" h={14} r={4} />
            </div>
          ))}
        </div>
      </Section>

      {/* BeforeAfter — full width image bar */}
      <Section>
        <SectionHeader />
        <S w="100%" h={360} r={12} />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}><S w={260} h={16} r={4} /></div>
      </Section>

      {/* Projects — grid */}
      <Section bg="#f8fafc">
        <SectionHeader />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ borderRadius: 12, overflow: 'hidden' }}>
              <S w="100%" h={200} r={0} mb={0} />
              <div style={{ padding: '12px 16px', background: '#fff' }}>
                <S w="60%" h={16} r={4} mb={6} />
                <S w="40%" h={12} r={4} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Testimonials — cards row */}
      <Section>
        <SectionHeader />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ padding: 28, borderRadius: 16, background: '#f8fafc' }}>
              <S w="100%" h={14} r={4} mb={6} />
              <S w="100%" h={14} r={4} mb={6} />
              <S w="70%" h={14} r={4} mb={24} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <S w={44} h={44} r={999} />
                <div><S w={100} h={14} r={4} mb={6} /><S w={80} h={12} r={4} /></div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* TeamSchedule — calendar */}
      <Section bg="#f8fafc">
        <SectionHeader />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 32 }}>
          <S w="100%" h={340} r={16} />
          <S w="100%" h={340} r={16} />
        </div>
      </Section>

      {/* Partners — logo row */}
      <Section>
        <SectionHeader />
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <S key={i} w={120} h={48} r={8} />
          ))}
        </div>
      </Section>
    </div>
  );
}
