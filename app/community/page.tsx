import Link from "next/link";
import { Users, MessageSquare, ArrowLeft } from "lucide-react";

export default function Community() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:text-purple-600">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-purple-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="h-10 w-10 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Community Forum</h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect, discuss, and share with your community - Coming Soon!
          </p>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h3 className="font-bold mb-1">Threaded Discussions</h3>
                  <p className="text-gray-600">Organize conversations with nested replies and topics</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-6 w-6 text-pink-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h3 className="font-bold mb-1">User Profiles</h3>
                  <p className="text-gray-600">Customize your profile and connect with others</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h3 className="font-bold mb-1">Rich Text Editor</h3>
                  <p className="text-gray-600">Format your posts with markdown support</p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-8 text-gray-500">
            🚧 This feature is under development
          </p>
        </div>
      </div>
    </div>
  );
}

