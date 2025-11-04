'use client';

import Link from 'next/link';
import styles from './PortfolioHeader.module.css';

export function PortfolioHeader() {
  return (
    <header className={styles.siteHeader}>
      <div className={styles.container}>
        <nav className={styles.nav} role="navigation" aria-label="Primary">
          <Link href="/" className={styles.brand} aria-label="Inner Animal Media home">
            <span className={styles.brandMark} aria-hidden="true"></span>
            <span>Inner Animal Media</span>
          </Link>

          <nav className={styles.navLinks}>
            <Link href="/">Home</Link>
            <Link href="/portfolio" aria-current="page">
              Portfolio
            </Link>
            <Link href="/services">Services</Link>
            <Link href="/team">Team</Link>
            <Link href="/about">About</Link>
            <Link href="/blog">Blog</Link>
          </nav>

          <Link href="/contact" className={styles.cta}>
            Let's Talk
          </Link>
        </nav>
      </div>
    </header>
  );
}

