import { Share2, MessageCircle, Heart } from "lucide-react";

export default function SocialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Social Highlights</h1>
        <p className="text-muted-foreground">Stay connected with your social networks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="dashboard-widget">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">Messages</h3>
          </div>
          <p className="text-2xl font-bold">3</p>
          <p className="text-sm text-muted-foreground">New messages</p>
        </div>

        <div className="dashboard-widget">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold">Mentions</h3>
          </div>
          <p className="text-2xl font-bold">2</p>
          <p className="text-sm text-muted-foreground">Recent mentions</p>
        </div>

        <div className="dashboard-widget">
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold">Shares</h3>
          </div>
          <p className="text-2xl font-bold">5</p>
          <p className="text-sm text-muted-foreground">Content shared</p>
        </div>
      </div>
    </div>
  );
}