import { Share2, MessageCircle, Heart } from "lucide-react";
import { Widget } from "@/components/ui/widget";

export function SocialWidget() {
  return (
    <Widget
      title="Social Highlights"
      icon={<Share2 className="w-5 h-5" />}
    >
      <div className="flex items-center justify-between hover-subtle rounded-lg p-2 -m-2 transition-colors cursor-pointer">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm">Messages</span>
        </div>
        <span className="text-sm font-medium">3 new</span>
      </div>

      <div className="flex items-center justify-between hover-subtle rounded-lg p-2 -m-2 transition-colors cursor-pointer">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm">Mentions</span>
        </div>
        <span className="text-sm font-medium">2 new</span>
      </div>
    </Widget>
  );
}
