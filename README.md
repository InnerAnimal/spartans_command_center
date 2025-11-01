# 🎯 InnerAnimalMedia.com

**Your Unified Communication & AI Platform**

A modern, full-stack web application providing AI-powered conversations, community forums, and real-time video conferencing—all in one place.

---

## 🚀 Overview

InnerAnimalMedia.com is a comprehensive digital platform designed to bring together the best of AI assistance, community collaboration, and real-time communication. Built with cutting-edge technologies, it offers seamless integration of ChatGPT, Claude AI, message boards, and video conferencing capabilities.

### Key Features

- 🤖 **Dual AI Chat Interfaces** - Access both ChatGPT and Claude for diverse AI assistance
- 💬 **Community Message Board** - Engage in threaded discussions with your community
- 📹 **Video Conferencing** - High-quality Meet/FaceTime-style video calls
- 🔐 **Secure Authentication** - User accounts with role-based access control
- 📱 **Responsive Design** - Seamless experience across desktop, tablet, and mobile
- ⚡ **Real-time Updates** - Live message notifications and presence indicators

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (React)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI + Radix UI
- **State Management**: React Context / Zustand

### Backend & Services
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Authentication**: Supabase Auth (Email, OAuth, Magic Links)
- **Storage**: Cloudflare R2 (for media files, chat history)
- **Email**: Resend (transactional emails)
- **Payments**: Stripe (optional premium features)

### AI Integration
- **ChatGPT**: OpenAI API
- **Claude**: Anthropic API
- **Real-time Streaming**: Server-Sent Events (SSE)

### Video/Communication
- **WebRTC**: Peer-to-peer video/audio
- **Signaling**: Supabase Realtime / WebSockets

### Hosting & Infrastructure
- **Hosting**: Vercel (Serverless)
- **CDN**: Cloudflare
- **Domain**: inneranimalmedia.com

---

## 📋 Prerequisites

Before setting up the project, ensure you have:

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Git**: Latest version
- **Vercel Account**: For deployment
- **Supabase Account**: For database & auth
- **Cloudflare Account**: For storage & CDN

---

## 🔧 Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ghiulqoqujsiofsjcrqk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application Settings
NEXT_PUBLIC_APP_URL=https://inneranimalmedia.com
NEXT_PUBLIC_API_URL=https://api.inneranimalmedia.com
NODE_ENV=development

# AI API Keys (Optional - for AI features)
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Cloudflare Configuration
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_KV_NAMESPACE_ID=your_kv_namespace_id

# Email Service
RESEND_API_KEY=your_resend_api_key

# Admin Contact
ADMIN_EMAIL=meauxbility@gmail.com
ADMIN_PHONE=+13374509998
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

### 3. Run Database Migrations

```bash
# Apply Supabase migrations
npm run db:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

---

## 📦 Project Structure

```
inneranimalmedia/
├── app/                      # Next.js 14 App Router
│   ├── (auth)/              # Authentication pages
│   ├── (dashboard)/         # Protected dashboard pages
│   ├── ai-chat/             # AI chat interfaces
│   ├── community/           # Message board
│   ├── video/               # Video conferencing
│   ├── api/                 # API routes
│   └── layout.tsx           # Root layout
├── components/              # Reusable React components
│   ├── ui/                  # UI primitives
│   ├── chat/                # Chat components
│   ├── video/               # Video call components
│   └── community/           # Forum components
├── lib/                     # Utility functions
│   ├── supabase/            # Supabase client & helpers
│   ├── ai/                  # AI integration utilities
│   └── utils.ts             # General utilities
├── public/                  # Static assets
├── styles/                  # Global styles
├── types/                   # TypeScript type definitions
└── package.json             # Dependencies & scripts
```

---

## 🎨 Features Breakdown

### 🤖 AI Chat Interface

- **Multi-Model Support**: Switch between ChatGPT and Claude
- **Conversation History**: Save and resume conversations
- **Streaming Responses**: Real-time token-by-token responses
- **Context Management**: Smart context window handling
- **Export Options**: Download conversations as markdown/JSON

### 💬 Community Message Board

- **Threaded Discussions**: Organize conversations with nested replies
- **Rich Text Editor**: Format posts with markdown support
- **User Profiles**: Customizable avatars and bios
- **Moderation Tools**: Report, flag, and moderate content
- **Search & Filter**: Find discussions by topic, user, or date

### 📹 Video Conferencing

- **HD Video/Audio**: High-quality peer-to-peer calls
- **Screen Sharing**: Share your screen with participants
- **Chat During Calls**: Text chat alongside video
- **Recording**: Save important meetings (optional)
- **Waiting Rooms**: Secure entry control

---

## 🔒 Security Features

- **Row-Level Security (RLS)**: Supabase database protection
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: API endpoint protection
- **Content Sanitization**: XSS protection for user input
- **HTTPS Only**: Enforced secure connections
- **CORS Configuration**: Controlled cross-origin requests

---

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

---

## 📈 Deployment

### Deploy to Vercel

The project is configured for seamless deployment to Vercel:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

**Project ID**: `prj_4rOWsKyVlnVE2kHyRT75ZXYLaM3f`

### Automatic Deployments

Connected to GitHub for automatic deployments:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and feature branches

---

## 🔄 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run format       # Format code with Prettier
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support & Contact

- **Email**: meauxbility@gmail.com
- **Phone**: +1 (337) 450-9998
- **Website**: https://inneranimalmedia.com

---

## 📄 License

© 2025 InnerAnimalMedia. All rights reserved.

Part of the Meauxbility Foundation - 501(c)(3) EIN: 33-4214907

---

## 🙏 Acknowledgments

Built with ❤️ using:
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/)
- [Cloudflare](https://cloudflare.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenAI](https://openai.com/)
- [Anthropic](https://anthropic.com/)

---

**Ready to revolutionize digital communication? Let's build something amazing! 🚀**

