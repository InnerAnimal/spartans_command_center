'use client';

import styles from './MetricsMarquee.module.css';

const brands = [
  'InnerAnimal',
  'Meauxbility',
  'iAutodidact',
  'Leadership Legacy',
  'Southern Pets',
  'Mshippi',
  'Cajun Wheelers',
];

export function MetricsMarquee() {
  return (
    <section className={styles.container} aria-label="Highlights">
      <div className={styles.metrics}>
        <div className={styles.metric}>
          <b>7+</b>
          <span>Active brands</span>
        </div>
        <div className={styles.metric}>
          <b>120+</b>
          <span>Projects shipped</span>
        </div>
        <div className={styles.metric}>
          <b>98/100</b>
          <span>Perf on web builds</span>
        </div>
        <div className={styles.metric}>
          <b>4.9★</b>
          <span>Average client rating</span>
        </div>
      </div>
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.track}>
          {[...brands, ...brands].map((brand, i) => (
            <span key={i} className={styles.chip}>
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

