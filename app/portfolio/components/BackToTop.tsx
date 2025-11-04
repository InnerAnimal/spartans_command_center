'use client';

import { useEffect } from 'react';
import styles from './BackToTop.module.css';

interface BackToTopProps {
  show: boolean;
}

export function BackToTop({ show }: BackToTopProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <a
      href="#"
      className={`${styles.toTop} ${show ? styles.show : ''}`}
      onClick={(e) => {
        e.preventDefault();
        scrollToTop();
      }}
      aria-label="Back to top"
    >
      ↑ Back to top
    </a>
  );
}

