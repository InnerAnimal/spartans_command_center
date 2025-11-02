import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import { Sparkles } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navigation />
      
      <div className="flex items-center justify-center py-16">
      <div className="w-full max-w-md px-4">

        <div className="card-neu p-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-neu-emboss-sm bg-gradient-teal">
              <Sparkles className="h-5 w-5 text-charcoal-deep" />
            </div>
            <span className="text-2xl font-bold text-brand-teal-light">InnerAnimalMedia</span>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2 text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground text-center mb-6">Sign in to your account</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="input-neu w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-neu w-full"
              />
            </div>

            <button className="btn-neu w-full">
              Sign In
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-brand-teal font-semibold hover:text-brand-teal-light transition-colors">
              Sign up
            </Link>
          </p>

          <p className="text-center text-xs text-muted-foreground mt-6 opacity-60">
            🚧 Authentication coming soon
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}

