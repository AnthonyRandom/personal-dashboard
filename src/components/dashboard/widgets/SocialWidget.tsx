import { Share2, MessageCircle, Heart } from "lucide-react";

export function SocialWidget() {
  return (
    <div className="dashboard-widget animate-scale-in">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Social Highlights</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Messages</span>
          </div>
          <span className="text-sm font-medium">3 new</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Mentions</span>
          </div>
          <span className="text-sm font-medium">2 new</span>
        </div>
      </div>
    </div>
  );
}