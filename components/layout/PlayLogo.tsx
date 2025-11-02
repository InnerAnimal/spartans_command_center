export default function PlayLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer raised teal border */}
      <defs>
        <linearGradient id="tealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7DB8BA" />
          <stop offset="100%" stopColor="#5F9C9E" />
        </linearGradient>
        <filter id="emboss">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
          <feOffset in="blur" dx="2" dy="2" result="offsetBlur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Outer rounded square - teal embossed border */}
      <rect 
        x="5" 
        y="5" 
        width="90" 
        height="90" 
        rx="20" 
        fill="url(#tealGradient)"
        filter="url(#emboss)"
      />
      
      {/* Inner debossed area - darker charcoal */}
      <rect 
        x="12" 
        y="12" 
        width="76" 
        height="76" 
        rx="16" 
        fill="#1A1D23"
        opacity="0.95"
      />
      
      {/* Shadow for debossed effect */}
      <rect 
        x="12" 
        y="12" 
        width="76" 
        height="76" 
        rx="16" 
        fill="url(#tealGradient)"
        opacity="0.05"
      />
      
      {/* Play triangle - light beige/cream, embossed */}
      <path 
        d="M 38 30 L 38 70 L 70 50 Z" 
        fill="#E8DDD0"
        filter="url(#emboss)"
      />
      
      {/* Subtle highlight on triangle */}
      <path 
        d="M 38 30 L 38 70 L 70 50 Z" 
        fill="url(#tealGradient)"
        opacity="0.15"
      />
    </svg>
  );
}

