'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import type { ProjectWithServices } from '@inneranimal/shared-types/portfolio';
import styles from './ProjectModal.module.css';

interface ProjectModalProps {
  project: ProjectWithServices;
  onClose: () => void;
}

const categoryLabels: Record<string, string> = {
  web: 'Web',
  branding: 'Branding',
  marketing: 'Marketing',
  strategy: 'Strategy',
};

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if ((e.target as HTMLElement).id === 'modal') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClickOutside);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const category = project.category || 'web';
  const categoryLabel = categoryLabels[category] || category;

  return (
    <dialog className={styles.modal} id="modal" open aria-label="Project quick view">
      <div className={styles.sheet}>
        <div className={styles.sheetHead}>
          <span className={styles.badge}>{categoryLabel}</span>
          <button className={styles.close} onClick={onClose} aria-label="Close modal">
            Close ✕
          </button>
        </div>
        <div className={styles.sheetBody}>
          <div>
            <h3>{project.title}</h3>
            <p className={styles.summary}>{project.summary}</p>
            <div className={styles.tags}>
              {project.tags.map((tag, i) => (
                <span key={i} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className={styles.actions}>
              <Link href={`/portfolio/${project.slug}`} className={`${styles.btn} ${styles.primary}`}>
                Open case study
              </Link>
              <Link href="/contact" className={`${styles.btn} ${styles.ghost}`}>
                Start a project
              </Link>
            </div>
          </div>
          <aside>
            <div className={styles.kv}>
              <div>
                <strong>Brand</strong>
                <br />
                <span className={styles.summary}>{project.brand_id || '—'}</span>
              </div>
              <div>
                <strong>Category</strong>
                <br />
                <span className={styles.summary}>{categoryLabel}</span>
              </div>
              <div>
                <strong>Services</strong>
                <br />
                <span className={styles.summary}>
                  {project.services?.map((s) => s.name).join(', ') || '—'}
                </span>
              </div>
              <div>
                <strong>Tags</strong>
                <br />
                <span className={styles.summary}>{project.tags.slice(0, 3).join(', ')}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </dialog>
  );
}

