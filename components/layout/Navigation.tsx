"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PlayLogo from "./PlayLogo";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav 
      className="border-b border-charcoal-lighter backdrop-blur-sm sticky top-0 z-50" 
      style={{
        background: 'linear-gradient(180deg, rgba(34, 37, 43, 0.95), rgba(26, 29, 35, 0.9))',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <PlayLogo className="w-10 h-10" />
            <span className="text-xl font-bold text-brand-teal-light">
              InnerAnimalMedia
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              href="/services" 
              className={`text-sm font-medium transition-all duration-300 ${
                isActive('/services') 
                  ? 'text-brand-teal drop-shadow-[0_0_8px_rgba(95,156,158,0.6)]' 
                  : 'text-muted-foreground hover:text-brand-teal hover:drop-shadow-[0_0_8px_rgba(95,156,158,0.5)]'
              }`}
            >
              Services
            </Link>
            <Link 
              href="/portfolio" 
              className={`text-sm font-medium transition-all duration-300 ${
                isActive('/portfolio') 
                  ? 'text-brand-teal drop-shadow-[0_0_8px_rgba(95,156,158,0.6)]' 
                  : 'text-muted-foreground hover:text-brand-teal hover:drop-shadow-[0_0_8px_rgba(95,156,158,0.5)]'
              }`}
            >
              Portfolio
            </Link>
            <Link 
              href="/about" 
              className={`text-sm font-medium transition-all duration-300 ${
                isActive('/about') 
                  ? 'text-brand-teal drop-shadow-[0_0_8px_rgba(95,156,158,0.6)]' 
                  : 'text-muted-foreground hover:text-brand-teal hover:drop-shadow-[0_0_8px_rgba(95,156,158,0.5)]'
              }`}
            >
              About
            </Link>
            <Link 
              href="/blog" 
              className={`text-sm font-medium transition-all duration-300 ${
                isActive('/blog') 
                  ? 'text-brand-teal drop-shadow-[0_0_8px_rgba(95,156,158,0.6)]' 
                  : 'text-muted-foreground hover:text-brand-teal hover:drop-shadow-[0_0_8px_rgba(95,156,158,0.5)]'
              }`}
            >
              Blog
            </Link>
            <Link 
              href="/contact" 
              className="btn-neu text-sm"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

