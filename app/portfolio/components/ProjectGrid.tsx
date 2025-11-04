'use client';

import Link from 'next/link';
import type { ProjectWithServices } from '@inneranimal/shared-types/portfolio';
import styles from './ProjectGrid.module.css';

interface ProjectGridProps {
  projects: ProjectWithServices[];
  onOpenModal: (project: ProjectWithServices) => void;
}

const categoryLabels: Record<string, string> = {
  web: 'Web',
  branding: 'Branding',
  marketing: 'Marketing',
  strategy: 'Strategy',
};

export function ProjectGrid({ projects, onOpenModal }: ProjectGridProps) {
  return (
    <div className={styles.grid} id="grid" aria-live="polite">
      {projects.map((project) => {
        const category = project.category || 'web';
        const categoryLabel = categoryLabels[category] || category;

        return (
          <article
            key={project.id}
            className={styles.card}
            data-brand={project.brand_id}
            data-category={category}
            data-title={project.title}
            data-tags={project.tags.join(' ')}
          >
            <div className={styles.thumb}>
              <span className={styles.badge}>{categoryLabel}</span>
              <div className={styles.hover}>
                <button
                  className={styles.pill}
                  onClick={() => onOpenModal(project)}
                  aria-label={`Quick view ${project.title}`}
                >
                  Quick view
                </button>
              </div>
            </div>
            <div className={styles.cardBody}>
              <h3>{project.title}</h3>
              <div className={styles.tags}>
                {project.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <p className={styles.summary}>{project.summary}</p>
              <div className={styles.actions}>
                <Link href={`/portfolio/${project.slug}`} className={styles.btn}>
                  View case study
                </Link>
                <Link
                  href={`/services/${project.services?.[0]?.slug || 'web-design'}`}
                  className={`${styles.btn} ${styles.link}`}
                >
                  {project.services?.[0]?.name || 'Web Design'}
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

