import Navigation from "@/components/layout/Navigation";
import { Video, Monitor, MessageSquare } from "lucide-react";

export default function VideoConference() {
  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-neu-emboss bg-gradient-teal">
            <Video className="h-10 w-10 text-charcoal-deep" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Video <span className="text-brand-teal-light">Conferencing</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            High-quality video calls with screen sharing - Coming Soon!
          </p>
          
          <div className="card-neu p-8 max-w-2xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-neu-emboss-sm bg-gradient-teal flex-shrink-0">
                  <Video className="h-6 w-6 text-charcoal-deep" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold mb-1 text-foreground">HD Video & Audio</h3>
                  <p className="text-muted-foreground">Crystal-clear peer-to-peer video conferencing</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-neu-emboss-sm bg-gradient-teal flex-shrink-0">
                  <Monitor className="h-6 w-6 text-charcoal-deep" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold mb-1 text-foreground">Screen Sharing</h3>
                  <p className="text-muted-foreground">Share your screen with meeting participants</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-neu-emboss-sm bg-gradient-teal flex-shrink-0">
                  <MessageSquare className="h-6 w-6 text-charcoal-deep" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold mb-1 text-foreground">Real-time Chat</h3>
                  <p className="text-muted-foreground">Text chat alongside your video calls</p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-8 text-muted-foreground opacity-60">
            🚧 This feature is under development
          </p>
        </div>
      </div>
    </div>
  );
}



