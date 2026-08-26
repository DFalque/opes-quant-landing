import { motion, useReducedMotion } from 'motion/react';
import type { LandingService } from '../data/landing-services';
import { sitePath } from '../lib/site-path';

interface Props {
  service: LandingService;
}

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 13 13 3M5 3h8v8" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M13 8H3M7 4 3 8l4 4" />
    </svg>
  );
}

function ServiceDetail({ service }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`service-detail-page service-detail-theme-${service.tone}`}>
      <nav className="service-detail-nav" aria-label="Navegación de servicio">
        <a className="detail-brand" href={sitePath('/')} aria-label="Volver a OPES">
          <span className="detail-brand-orbit" aria-hidden="true"><span /></span>
          <span>opes</span>
        </a>
        <a className="detail-back" href={sitePath('/')}>
          <ArrowLeft /> Volver a OPES
        </a>
      </nav>

      <main>
        <section className="service-detail-hero" aria-labelledby="service-title">
          <motion.div
            className="service-detail-copy"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="detail-eyebrow">{service.category}</span>
            <h1 id="service-title">{service.name}</h1>
            <h2>{service.headline}</h2>
            <p>{service.detail}</p>
            <a className="detail-cta" href="#what-it-does">Descubrir {service.name} <ArrowUpRight /></a>
          </motion.div>

          <motion.div
            className="detail-orbit"
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.84, rotate: reduceMotion ? 0 : -12 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          >
            <span className="detail-orbit-ring detail-orbit-ring-one" />
            <span className="detail-orbit-ring detail-orbit-ring-two" />
            <span className="detail-orbit-mark">{service.mark}</span>
            <span className="detail-orbit-dot detail-orbit-dot-one" />
            <span className="detail-orbit-dot detail-orbit-dot-two" />
          </motion.div>
        </section>

        <section className="service-detail-points" id="what-it-does" aria-labelledby="points-title">
          <div>
            <span className="detail-section-index">WHAT IT BRINGS</span>
            <h2 id="points-title">Una pieza<br /><em>del sistema.</em></h2>
          </div>
          <div className="detail-points-list">
            {service.points.map((point, index) => (
              <motion.div
                className="detail-point"
                key={point}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <span>0{index + 1}</span>
                <strong>{point}</strong>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="service-detail-next">
          <span className="detail-section-index">PART OF OPES</span>
          <p>Una lectura no es una decisión. OPES las reúne todas.</p>
          <a className="detail-back-link" href={sitePath('/#servicios')}>Ver todos los servicios <ArrowUpRight /></a>
        </section>
      </main>

      <footer className="service-detail-footer">
        <span>opes / market intelligence system</span>
        <span>Local draft / 2026</span>
      </footer>
    </div>
  );
}

export default ServiceDetail;
