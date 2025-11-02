# 🎨 InnerAnimalMedia.com - Brand Identity Guide

**Design Philosophy:** Neumorphic, Modern, Sophisticated, Tactile

---

## 🎨 **Color Palette**

### **Primary Colors**

```css
/* Muted Teal - Primary Brand Color */
--brand-teal: #5F9C9E;
--brand-teal-light: #7DB8BA;
--brand-teal-dark: #4A7D7F;
--brand-teal-glow: rgba(95, 156, 158, 0.3);

/* Dark Charcoal - Background & Base */
--charcoal-deep: #1A1D23;
--charcoal-base: #22252B;
--charcoal-light: #2C3038;
--charcoal-lighter: #363A42;

/* Light Accents */
--beige-light: #E8DDD0;
--cream: #F5F1EC;
--white-soft: #FAFAF8;
```

### **UI Colors**

```css
/* Backgrounds */
--bg-primary: #1A1D23;
--bg-secondary: #22252B;
--bg-elevated: #2C3038;
--bg-card: #22252B;

/* Text */
--text-primary: #FAFAF8;
--text-secondary: #B8BCC4;
--text-muted: #6B7280;
--text-inverse: #1A1D23;

/* Borders & Dividers */
--border-subtle: #363A42;
--border-medium: #4A4E56;
--border-accent: #5F9C9E;

/* Shadows for Neumorphism */
--shadow-emboss-light: rgba(255, 255, 255, 0.08);
--shadow-emboss-dark: rgba(0, 0, 0, 0.5);
--shadow-deboss-light: rgba(255, 255, 255, 0.03);
--shadow-deboss-dark: rgba(0, 0, 0, 0.7);

/* Interactive States */
--interactive-hover: #7DB8BA;
--interactive-active: #4A7D7F;
--interactive-disabled: #363A42;
```

---

## 🎯 **Typography**

### **Font Families**

```css
/* Primary Font - Modern, Clean */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;

/* Secondary Font - Display/Headers */
--font-display: 'Outfit', 'Inter', sans-serif;

/* Monospace - Code */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
```

### **Font Sizes**

```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

---

## 🔲 **Neumorphic Design System**

### **Embossed (Raised) Elements**

```css
.embossed {
  background: linear-gradient(145deg, #2C3038, #22252B);
  box-shadow: 
    8px 8px 16px rgba(0, 0, 0, 0.5),
    -4px -4px 12px rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}

.embossed-teal {
  background: linear-gradient(145deg, #7DB8BA, #5F9C9E);
  box-shadow: 
    6px 6px 12px rgba(0, 0, 0, 0.4),
    -3px -3px 8px rgba(125, 184, 186, 0.3);
  border-radius: 16px;
}
```

### **Debossed (Pressed) Elements**

```css
.debossed {
  background: linear-gradient(145deg, #1A1D23, #22252B);
  box-shadow: 
    inset 6px 6px 12px rgba(0, 0, 0, 0.7),
    inset -3px -3px 8px rgba(255, 255, 255, 0.03);
  border-radius: 12px;
}
```

### **Flat with Border**

```css
.flat-bordered {
  background: #22252B;
  border: 2px solid #5F9C9E;
  box-shadow: 
    0 2px 8px rgba(95, 156, 158, 0.15),
    0 0 0 1px rgba(95, 156, 158, 0.1);
  border-radius: 12px;
}
```

---

## 🎨 **Component Styles**

### **Buttons**

```css
/* Primary Button (Embossed Teal) */
.btn-primary {
  background: linear-gradient(145deg, #7DB8BA, #5F9C9E);
  color: #1A1D23;
  padding: 12px 24px;
  font-weight: 600;
  border-radius: 16px;
  box-shadow: 
    6px 6px 12px rgba(0, 0, 0, 0.4),
    -3px -3px 8px rgba(125, 184, 186, 0.3);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(145deg, #8DC5C7, #6FADB0);
  box-shadow: 
    8px 8px 16px rgba(0, 0, 0, 0.5),
    -4px -4px 12px rgba(125, 184, 186, 0.4);
  transform: translateY(-1px);
}

.btn-primary:active {
  box-shadow: 
    inset 4px 4px 8px rgba(0, 0, 0, 0.3),
    inset -2px -2px 6px rgba(125, 184, 186, 0.2);
  transform: translateY(0);
}

/* Secondary Button (Embossed Charcoal) */
.btn-secondary {
  background: linear-gradient(145deg, #2C3038, #22252B);
  color: #FAFAF8;
  padding: 12px 24px;
  font-weight: 600;
  border-radius: 16px;
  box-shadow: 
    6px 6px 12px rgba(0, 0, 0, 0.5),
    -3px -3px 8px rgba(255, 255, 255, 0.08);
  border: 1px solid #5F9C9E;
}

/* Ghost Button (Flat with Teal Border) */
.btn-ghost {
  background: transparent;
  color: #5F9C9E;
  padding: 12px 24px;
  font-weight: 600;
  border-radius: 16px;
  border: 2px solid #5F9C9E;
  transition: all 0.3s ease;
}

.btn-ghost:hover {
  background: rgba(95, 156, 158, 0.1);
  box-shadow: 0 0 20px rgba(95, 156, 158, 0.3);
}
```

### **Cards**

```css
.card-embossed {
  background: linear-gradient(145deg, #2C3038, #22252B);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 
    12px 12px 24px rgba(0, 0, 0, 0.5),
    -6px -6px 16px rgba(255, 255, 255, 0.08);
}

.card-debossed {
  background: linear-gradient(145deg, #1A1D23, #22252B);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 
    inset 8px 8px 16px rgba(0, 0, 0, 0.7),
    inset -4px -4px 12px rgba(255, 255, 255, 0.03);
}
```

### **Input Fields**

```css
.input-debossed {
  background: linear-gradient(145deg, #1A1D23, #22252B);
  color: #FAFAF8;
  padding: 12px 16px;
  border-radius: 12px;
  border: none;
  box-shadow: 
    inset 4px 4px 8px rgba(0, 0, 0, 0.7),
    inset -2px -2px 6px rgba(255, 255, 255, 0.03);
}

.input-debossed:focus {
  outline: none;
  box-shadow: 
    inset 4px 4px 8px rgba(0, 0, 0, 0.7),
    inset -2px -2px 6px rgba(255, 255, 255, 0.03),
    0 0 0 2px rgba(95, 156, 158, 0.5);
}
```

---

## 🎯 **Logo & Icon System**

### **Logo Variations**

```
Primary Logo: Teal on Charcoal
├─ Full Color: Teal (#5F9C9E) on Dark Charcoal (#1A1D23)
├─ Monochrome Light: White (#FAFAF8) on Dark
├─ Monochrome Dark: Charcoal (#1A1D23) on Light
└─ Minimal: Icon only (for small sizes)
```

### **Icon Style**

- **Shape:** Rounded squares (squircles) or shields
- **Style:** Neumorphic with embossed/debossed layers
- **Colors:** Teal frames with charcoal centers
- **Symbols:** Simple, geometric, centered
- **Border:** Thick teal raised borders
- **Inner:** Debossed charcoal background
- **Symbol:** Light beige or teal, softly embossed

### **Feature Icons**

```
🤖 AI Chat:       Embossed teal frame + debossed charcoal + light beige chat bubble
👥 Community:     Embossed teal frame + debossed charcoal + teal people icon
🎥 Video:         Embossed teal frame + debossed charcoal + light beige play triangle
🔐 Security:      Embossed teal shield frame + debossed charcoal + teal checkmark
⚙️ Settings:      Embossed teal frame + debossed charcoal + teal gear
```

---

## 🎨 **Application UI Theme**

### **Navigation Bar**

```css
.navbar {
  background: linear-gradient(180deg, #22252B, #1A1D23);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid #363A42;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.nav-item {
  color: #B8BCC4;
  transition: all 0.3s ease;
}

.nav-item:hover {
  color: #5F9C9E;
  text-shadow: 0 0 8px rgba(95, 156, 158, 0.5);
}

.nav-item.active {
  color: #7DB8BA;
  position: relative;
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #5F9C9E, transparent);
  box-shadow: 0 0 8px rgba(95, 156, 158, 0.6);
}
```

### **Message Bubbles (AI Chat)**

```css
/* User Message (Embossed) */
.message-user {
  background: linear-gradient(145deg, #7DB8BA, #5F9C9E);
  color: #1A1D23;
  padding: 12px 16px;
  border-radius: 18px 18px 4px 18px;
  box-shadow: 
    6px 6px 12px rgba(0, 0, 0, 0.4),
    -3px -3px 8px rgba(125, 184, 186, 0.3);
}

/* AI Message (Debossed) */
.message-ai {
  background: linear-gradient(145deg, #1A1D23, #22252B);
  color: #FAFAF8;
  padding: 12px 16px;
  border-radius: 18px 18px 18px 4px;
  box-shadow: 
    inset 4px 4px 8px rgba(0, 0, 0, 0.7),
    inset -2px -2px 6px rgba(255, 255, 255, 0.03);
  border-left: 3px solid #5F9C9E;
}
```

### **Forum Posts**

```css
.post-card {
  background: linear-gradient(145deg, #2C3038, #22252B);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 
    10px 10px 20px rgba(0, 0, 0, 0.5),
    -5px -5px 14px rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(95, 156, 158, 0.1);
  transition: all 0.3s ease;
}

.post-card:hover {
  box-shadow: 
    12px 12px 24px rgba(0, 0, 0, 0.6),
    -6px -6px 16px rgba(255, 255, 255, 0.1),
    0 0 0 2px rgba(95, 156, 158, 0.3);
  transform: translateY(-2px);
}
```

---

## 🎬 **Animations & Transitions**

### **Timing Functions**

```css
--ease-smooth: cubic-bezier(0.4, 0.0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-natural: cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

### **Hover Effects**

```css
.interactive:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 16px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(95, 156, 158, 0.2);
}
```

### **Pressed State**

```css
.interactive:active {
  transform: translateY(0);
  box-shadow: 
    inset 4px 4px 8px rgba(0, 0, 0, 0.5),
    inset -2px -2px 6px rgba(255, 255, 255, 0.05);
}
```

---

## 🎨 **Gradient Overlays**

```css
/* Hero Section Gradient */
.hero-gradient {
  background: 
    radial-gradient(circle at 20% 20%, rgba(95, 156, 158, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(125, 184, 186, 0.1) 0%, transparent 50%),
    linear-gradient(180deg, #1A1D23, #22252B);
}

/* Card Gradient Overlay */
.card-gradient {
  background: 
    linear-gradient(145deg, 
      rgba(95, 156, 158, 0.08) 0%, 
      transparent 50%,
      rgba(0, 0, 0, 0.2) 100%);
}
```

---

## 🔲 **Spacing System**

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

---

## 📐 **Border Radius System**

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

---

## ✨ **Special Effects**

### **Glow Effect**

```css
.glow-teal {
  box-shadow: 
    0 0 20px rgba(95, 156, 158, 0.4),
    0 0 40px rgba(95, 156, 158, 0.2),
    0 0 60px rgba(95, 156, 158, 0.1);
}
```

### **Glassmorphism**

```css
.glass {
  background: rgba(34, 37, 43, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(95, 156, 158, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
```

---

## 🎯 **Brand Voice & Messaging**

### **Tone**
- **Professional yet approachable**
- **Innovative and modern**
- **Empowering and supportive**
- **Clear and concise**

### **Key Messages**
- "Your Unified Communication Hub"
- "AI-Powered Conversations, Human-Centered Design"
- "Where Intelligence Meets Community"
- "Built for the Modern Digital Professional"

---

## 📱 **Responsive Breakpoints**

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

---

## 🎨 **Accessibility**

- **Contrast Ratios:** All text meets WCAG AA standards (4.5:1 minimum)
- **Focus States:** Visible focus indicators with teal glow
- **Touch Targets:** Minimum 44x44px for interactive elements
- **Screen Readers:** Semantic HTML with ARIA labels

---

## 📦 **Asset Library**

### **Required Assets**
```
/public/brand/
├── logo-primary.svg          # Teal on transparent
├── logo-light.svg            # White on transparent
├── logo-dark.svg             # Charcoal on light
├── icon-ai-chat.svg          # AI chat feature icon
├── icon-community.svg        # Community feature icon
├── icon-video.svg            # Video feature icon
├── icon-security.svg         # Security/shield icon
├── favicon.ico               # 32x32 favicon
└── og-image.png              # 1200x630 social share
```

---

## 🎯 **Brand Applications**

### **Website**
- Dark mode by default (charcoal backgrounds)
- Neumorphic buttons and cards
- Teal accents for CTAs and links
- Subtle animations on interaction

### **Marketing**
- Hero images with teal overlays
- Neumorphic card layouts for features
- Dark backgrounds with teal highlights

### **Social Media**
- Profile: Teal logo on charcoal
- Posts: Dark backgrounds with teal text highlights
- Cover images: Neumorphic elements

---

## ✅ **Design Checklist**

- [ ] All interactive elements use neumorphic embossed style
- [ ] Primary CTAs are teal with embossed effect
- [ ] Cards have subtle 3D depth with proper shadows
- [ ] Text hierarchy uses defined font sizes
- [ ] Hover states include glow and lift effects
- [ ] Focus states have visible teal outline
- [ ] Icons match brand style (neumorphic, teal/charcoal)
- [ ] Spacing follows 4px grid system
- [ ] Border radius consistent across components

---

**Last Updated:** November 1, 2025  
**Version:** 1.0  
**Project:** InnerAnimalMedia.com

