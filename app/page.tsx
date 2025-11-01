import Link from "next/link";
import { MessageSquare, Users, Video, Bot, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InnerAnimalMedia
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/ai-chat" className="text-sm font-medium hover:text-blue-600 transition-colors">
                AI Chat
              </Link>
              <Link href="/community" className="text-sm font-medium hover:text-blue-600 transition-colors">
                Community
              </Link>
              <Link href="/video" className="text-sm font-medium hover:text-blue-600 transition-colors">
                Video
              </Link>
              <Link 
                href="/login" 
                className="text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Unified Communication Hub
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the power of AI-driven conversations, vibrant community discussions, 
            and seamless video conferencing—all in one place.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/ai-chat" 
              className="px-8 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Start Chatting
            </Link>
            <Link 
              href="/community" 
              className="px-8 py-3 rounded-lg border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
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
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Bot className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Chat</h3>
            <p className="text-gray-600 mb-4">
              Access ChatGPT and Claude for intelligent conversations and assistance
            </p>
            <Link href="/ai-chat" className="text-blue-600 font-medium hover:underline">
              Try AI Chat →
            </Link>
          </div>

          {/* Community Forum */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Community Forum</h3>
            <p className="text-gray-600 mb-4">
              Join discussions, share ideas, and connect with like-minded individuals
            </p>
            <Link href="/community" className="text-purple-600 font-medium hover:underline">
              Join Community →
            </Link>
          </div>

          {/* Video Conferencing */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Video className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Video Calls</h3>
            <p className="text-gray-600 mb-4">
              High-quality video conferencing with screen sharing and real-time chat
            </p>
            <Link href="/video" className="text-pink-600 font-medium hover:underline">
              Start Meeting →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Communication?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users already experiencing the future of digital interaction
          </p>
          <Link 
            href="/login" 
            className="inline-block px-8 py-3 rounded-lg bg-white text-blue-600 font-medium hover:bg-gray-100 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <span className="font-bold">InnerAnimalMedia</span>
            </div>
            <div className="text-sm text-gray-600">
              © 2025 InnerAnimalMedia. Part of Meauxbility Foundation (501c3)
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/about" className="hover:text-blue-600 transition-colors">About</Link>
              <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
              <a href="mailto:meauxbility@gmail.com" className="hover:text-blue-600 transition-colors">
                meauxbility@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

