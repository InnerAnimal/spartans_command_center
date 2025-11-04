'use client';

import Link from 'next/link';
import styles from './PortfolioHero.module.css';

export function PortfolioHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <span className={styles.eyebrow}>Creative Agency</span>
        <h1>Design that transforms brands.</h1>
        <p className={styles.lede}>
          We craft fast, conversion‑focused websites, brand systems, and campaigns across multiple
          brands in our network. Explore featured work below or filter by service and brand.
        </p>
        <div className={styles.ctaRow}>
          <a href="#portfolio" className={`${styles.btn} ${styles.primary}`}>
            View Portfolio
          </a>
          <Link href="/contact" className={`${styles.btn} ${styles.ghost}`}>
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}

