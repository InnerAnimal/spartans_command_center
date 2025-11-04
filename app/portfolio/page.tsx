'use client';

import { useState, useEffect, useMemo } from 'react';
import { getProjectsByBrand, getServicesByBrand } from '@inneranimal/shared-ui/lib/supabase';
import type { ProjectWithServices, Service } from '@inneranimal/shared-types/portfolio';
import { PortfolioHeader } from './components/PortfolioHeader';
import { PortfolioHero } from './components/PortfolioHero';
import { PortfolioPlanetHero } from './components/PlanetHero';
import { MetricsMarquee } from './components/MetricsMarquee';
import { FilterControls } from './components/FilterControls';
import { ProjectGrid } from './components/ProjectGrid';
import { ProjectModal } from './components/ProjectModal';
import { PortfolioFooter } from './components/PortfolioFooter';
import { BackToTop } from './components/BackToTop';
import styles from './portfolio.module.css';

// Fallback static projects (if Supabase unavailable)
const FALLBACK_PROJECTS: ProjectWithServices[] = [
  {
    id: '1',
    brand_id: 'inneranimal-media',
    title: 'WildFit DTC Website',
    slug: 'wildfit',
    summary: 'A high‑performance storefront with modular sections and fast checkout. Built for speed, scale, and content velocity.',
    category: 'web',
    tags: ['web design', 'ecommerce', 'shopify', 'conversion'],
    published: true,
    featured: true,
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    services: [],
  },
  {
    id: '2',
    brand_id: 'meauxbility',
    title: 'Nova Health Rebrand',
    slug: 'nova-health',
    summary: 'A new identity system, logo, and voice kit unified 12 sub‑brands under one banner.',
    category: 'branding',
    tags: ['branding', 'identity', 'guidelines', 'logo'],
    published: true,
    featured: true,
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    services: [],
  },
  {
    id: '3',
    brand_id: 'iautodidact',
    title: 'Rally App Launch',
    slug: 'rally',
    summary: 'Full‑funnel launch with creative, landing pages, and analytics — scaling from 0 → 50k MAU in six months.',
    category: 'marketing',
    tags: ['growth', 'paid social', 'funnel', 'seo'],
    published: true,
    featured: true,
    order_index: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    services: [],
  },
];

export default function PortfolioPage() {
  const [projects, setProjects] = useState<ProjectWithServices[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal state
  const [selectedProject, setSelectedProject] = useState<ProjectWithServices | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data from Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const brandSlug = 'inneranimal-media'; // This should be dynamic based on current brand

        // Fetch projects and services in parallel
        const [projectsResult, servicesResult] = await Promise.all([
          getProjectsByBrand(brandSlug, {
            limit: 50,
            offset: 0,
          }),
          getServicesByBrand(brandSlug),
        ]);

        if (projectsResult.error) {
          console.warn('Supabase unavailable, using fallback data:', projectsResult.error);
          setProjects(FALLBACK_PROJECTS);
        } else {
          setProjects(projectsResult.projects || []);
        }

        if (servicesResult.error) {
          console.warn('Services fetch failed:', servicesResult.error);
          setServices([]);
        } else {
          setServices(servicesResult.services || []);
        }
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError('Failed to load portfolio');
        setProjects(FALLBACK_PROJECTS); // Fallback to static data
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter projects based on active filters
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Filter by service/category
      const matchesCategory = activeFilter === 'all' || project.category === activeFilter;

      // Filter by brand (if we have brand data)
      const matchesBrand = selectedBrand === 'all' || project.brand_id === selectedBrand;

      // Filter by search query
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        project.title.toLowerCase().includes(searchLower) ||
        project.summary.toLowerCase().includes(searchLower) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      return matchesCategory && matchesBrand && matchesSearch;
    });
  }, [projects, activeFilter, selectedBrand, searchQuery]);

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  // Handle brand change
  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
  };

  // Handle search
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Handle modal open
  const handleOpenModal = (project: ProjectWithServices) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // Handle back to top scroll
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.container}>
      <PortfolioHeader />
      
      <main>
        <PortfolioPlanetHero />
        
        <PortfolioHero />
        
        <MetricsMarquee />
        
        <FilterControls
          activeFilter={activeFilter}
          selectedBrand={selectedBrand}
          searchQuery={searchQuery}
          onFilterChange={handleFilterChange}
          onBrandChange={handleBrandChange}
          onSearchChange={handleSearchChange}
        />
        
        <section id="portfolio" className={styles.portfolioSection} aria-label="Portfolio">
          {loading ? (
            <div className={styles.loading}>Loading portfolio...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <>
              <ProjectGrid
                projects={filteredProjects}
                onOpenModal={handleOpenModal}
              />
              {filteredProjects.length === 0 && (
                <div className={styles.empty} id="empty">
                  No results. Try a different filter, brand, or keyword.
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <PortfolioFooter />

      {isModalOpen && selectedProject && (
        <ProjectModal project={selectedProject} onClose={handleCloseModal} />
      )}

      <BackToTop show={showBackToTop} />
    </div>
  );
}

