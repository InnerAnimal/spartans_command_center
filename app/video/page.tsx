import Link from "next/link";
import { Video, Monitor, MessageSquare, ArrowLeft } from "lucide-react";

export default function VideoConference() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:text-pink-600">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-pink-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Video className="h-10 w-10 text-pink-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Video Conferencing</h1>
          <p className="text-xl text-gray-600 mb-8">
            High-quality video calls with screen sharing - Coming Soon!
          </p>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Video className="h-6 w-6 text-pink-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h3 className="font-bold mb-1">HD Video & Audio</h3>
                  <p className="text-gray-600">Crystal-clear peer-to-peer video conferencing</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Monitor className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h3 className="font-bold mb-1">Screen Sharing</h3>
                  <p className="text-gray-600">Share your screen with meeting participants</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h3 className="font-bold mb-1">Real-time Chat</h3>
                  <p className="text-gray-600">Text chat alongside your video calls</p>
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

