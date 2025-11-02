import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import { MessageSquare, Users, Video, Bot, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navigation />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Your Unified{" "}
            <span className="text-brand-teal-light drop-shadow-[0_0_20px_rgba(95,156,158,0.5)]">
              Communication Hub
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the power of AI-driven conversations, vibrant community discussions, 
            and seamless video conferencing—all in one place.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              href="/ai-chat" 
              className="btn-neu px-8 py-3"
            >
              Start Chatting
            </Link>
            <Link 
              href="/community" 
              className="px-8 py-3 rounded-xl border-2 border-brand-teal text-brand-teal font-semibold hover:bg-brand-teal/10 transition-all duration-300 hover:shadow-glow-teal"
            >
              Explore Community
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* AI Chat */}
          <div className="card-neu hover:shadow-neu-emboss-lg transition-all duration-300 group cursor-pointer">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-neu-emboss-sm bg-gradient-teal">
              <Bot className="h-7 w-7 text-charcoal-deep" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">AI Chat</h3>
            <p className="text-muted-foreground mb-4">
              Access ChatGPT and Claude for intelligent conversations and assistance
            </p>
            <Link href="/ai-chat" className="text-brand-teal font-semibold hover:text-brand-teal-light transition-colors group-hover:drop-shadow-[0_0_8px_rgba(95,156,158,0.6)]">
              Try AI Chat →
            </Link>
          </div>

          {/* Community Forum */}
          <div className="card-neu hover:shadow-neu-emboss-lg transition-all duration-300 group cursor-pointer">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-neu-emboss-sm bg-gradient-teal">
              <Users className="h-7 w-7 text-charcoal-deep" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Community Forum</h3>
            <p className="text-muted-foreground mb-4">
              Join discussions, share ideas, and connect with like-minded individuals
            </p>
            <Link href="/community" className="text-brand-teal font-semibold hover:text-brand-teal-light transition-colors group-hover:drop-shadow-[0_0_8px_rgba(95,156,158,0.6)]">
              Join Community →
            </Link>
          </div>

          {/* Video Conferencing */}
          <div className="card-neu hover:shadow-neu-emboss-lg transition-all duration-300 group cursor-pointer">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-neu-emboss-sm bg-gradient-teal">
              <Video className="h-7 w-7 text-charcoal-deep" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Video Calls</h3>
            <p className="text-muted-foreground mb-4">
              High-quality video conferencing with screen sharing and real-time chat
            </p>
            <Link href="/video" className="text-brand-teal font-semibold hover:text-brand-teal-light transition-colors group-hover:drop-shadow-[0_0_8px_rgba(95,156,158,0.6)]">
              Start Meeting →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto card-neu p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-teal-light rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Ready to Transform Your{" "}
              <span className="text-brand-teal-light">Communication?</span>
            </h2>
            <p className="text-xl mb-8 text-muted-foreground">
              Join thousands of users already experiencing the future of digital interaction
            </p>
            <Link 
              href="/login" 
              className="btn-neu px-8 py-3 inline-block"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-charcoal-lighter mt-16" style={{
        background: 'linear-gradient(180deg, rgba(26, 29, 35, 0.8), rgba(22, 25, 31, 0.95))',
      }}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-neu-emboss-sm bg-gradient-teal">
                <Sparkles className="h-4 w-4 text-charcoal-deep" />
              </div>
              <span className="font-bold text-foreground">InnerAnimalMedia</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 InnerAnimalMedia. Part of Meauxbility Foundation (501c3)
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/about" className="text-muted-foreground hover:text-brand-teal transition-colors">About</Link>
              <Link href="/contact" className="text-muted-foreground hover:text-brand-teal transition-colors">Contact</Link>
              <a href="mailto:meauxbility@gmail.com" className="text-muted-foreground hover:text-brand-teal transition-colors">
                meauxbility@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

