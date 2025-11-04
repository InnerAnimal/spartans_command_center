'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './PortfolioFooter.module.css';

export function PortfolioFooter() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footgrid}>
          <div>
            © {year} Inner Animal Media — Crafted with intent.
          </div>
          <nav className={styles.footlinks} aria-label="Secondary">
            <Link href="/faq">FAQ</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/careers">Careers</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/accessibility">Accessibility</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

