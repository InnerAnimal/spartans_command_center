'use client';

import styles from './FilterControls.module.css';

interface FilterControlsProps {
  activeFilter: string;
  selectedBrand: string;
  searchQuery: string;
  onFilterChange: (filter: string) => void;
  onBrandChange: (brand: string) => void;
  onSearchChange: (query: string) => void;
}

const filters = [
  { value: 'all', label: 'All' },
  { value: 'web', label: 'Web Design' },
  { value: 'branding', label: 'Branding' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'strategy', label: 'Strategy' },
];

const brands = [
  { value: 'all', label: 'All brands' },
  { value: 'InnerAnimal Media', label: 'InnerAnimal Media' },
  { value: 'Meauxbility', label: 'Meauxbility' },
  { value: 'iAutodidact', label: 'iAutodidact' },
  { value: 'InnerAnimal.app', label: 'InnerAnimal.app' },
  { value: 'Leadership Legacy', label: 'Leadership Legacy' },
  { value: 'Southern Pets', label: 'Southern Pets' },
];

export function FilterControls({
  activeFilter,
  selectedBrand,
  searchQuery,
  onFilterChange,
  onBrandChange,
  onSearchChange,
}: FilterControlsProps) {
  return (
    <div className={styles.subnav}>
      <div className={styles.container}>
        <div className={styles.controls} role="toolbar" aria-label="Portfolio controls">
          <div className={styles.filters} role="group" aria-label="Filter by service">
            {filters.map((filter) => (
              <button
                key={filter.value}
                className={styles.filterBtn}
                data-filter={filter.value}
                aria-pressed={activeFilter === filter.value}
                onClick={() => onFilterChange(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className={styles.brandSelect}>
            <span className={styles.srOnly} id="brand-label">
              Filter by brand
            </span>
            <select
              id="brand"
              aria-labelledby="brand-label"
              value={selectedBrand}
              onChange={(e) => onBrandChange(e.target.value)}
            >
              {brands.map((brand) => (
                <option key={brand.value} value={brand.value}>
                  {brand.label}
                </option>
              ))}
            </select>
          </div>

          <label className={styles.search} aria-label="Search portfolio">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M21 21l-4.3-4.3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            </svg>
            <input
              id="search"
              type="search"
              placeholder="Search by title, client, or tag…"
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

