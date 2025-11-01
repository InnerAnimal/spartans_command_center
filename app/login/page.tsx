import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium hover:text-blue-600 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <span className="text-2xl font-bold">InnerAnimalMedia</span>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-gray-600 text-center mb-6">Sign in to your account</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              />
            </div>

            <button className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Sign In
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>

          <p className="text-center text-xs text-gray-500 mt-6">
            🚧 Authentication coming soon
          </p>
        </div>
      </div>
    </div>
  );
}

