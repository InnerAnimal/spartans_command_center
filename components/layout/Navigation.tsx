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
              href="/ai-chat" 
              className={`text-sm font-medium transition-all duration-300 ${
                isActive('/ai-chat') 
                  ? 'text-brand-teal drop-shadow-[0_0_8px_rgba(95,156,158,0.6)]' 
                  : 'text-muted-foreground hover:text-brand-teal hover:drop-shadow-[0_0_8px_rgba(95,156,158,0.5)]'
              }`}
            >
              AI Chat
            </Link>
            <Link 
              href="/community" 
              className={`text-sm font-medium transition-all duration-300 ${
                isActive('/community') 
                  ? 'text-brand-teal drop-shadow-[0_0_8px_rgba(95,156,158,0.6)]' 
                  : 'text-muted-foreground hover:text-brand-teal hover:drop-shadow-[0_0_8px_rgba(95,156,158,0.5)]'
              }`}
            >
              Community
            </Link>
            <Link 
              href="/video" 
              className={`text-sm font-medium transition-all duration-300 ${
                isActive('/video') 
                  ? 'text-brand-teal drop-shadow-[0_0_8px_rgba(95,156,158,0.6)]' 
                  : 'text-muted-foreground hover:text-brand-teal hover:drop-shadow-[0_0_8px_rgba(95,156,158,0.5)]'
              }`}
            >
              Video
            </Link>
            <Link 
              href="/login" 
              className="btn-neu text-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

