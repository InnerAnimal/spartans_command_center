import Navigation from "@/components/layout/Navigation";
import { Users, MessageSquare, UserCircle, Edit3 } from "lucide-react";

export default function Community() {
  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-neu-emboss bg-gradient-teal">
            <Users className="h-10 w-10 text-charcoal-deep" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Community <span className="text-brand-teal-light">Forum</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Connect, discuss, and share with your community - Coming Soon!
          </p>
          
          <div className="card-neu p-8 max-w-2xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-neu-emboss-sm bg-gradient-teal flex-shrink-0">
                  <MessageSquare className="h-6 w-6 text-charcoal-deep" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold mb-1 text-foreground">Threaded Discussions</h3>
                  <p className="text-muted-foreground">Organize conversations with nested replies and topics</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-neu-emboss-sm bg-gradient-teal flex-shrink-0">
                  <UserCircle className="h-6 w-6 text-charcoal-deep" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold mb-1 text-foreground">User Profiles</h3>
                  <p className="text-muted-foreground">Customize your profile and connect with others</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-neu-emboss-sm bg-gradient-teal flex-shrink-0">
                  <Edit3 className="h-6 w-6 text-charcoal-deep" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold mb-1 text-foreground">Rich Text Editor</h3>
                  <p className="text-muted-foreground">Format your posts with markdown support</p>
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



