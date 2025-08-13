import { Newspaper, ExternalLink } from "lucide-react";

const articles = [
  {
    title: "AI Breakthrough in Personal Productivity Tools",
    source: "Tech Daily",
    time: "2h ago",
    category: "Technology",
  },
  {
    title: "Market Update: Tech Stocks Rally Continues",
    source: "Financial Times",
    time: "4h ago",
    category: "Finance",
  },
  {
    title: "New Study Shows Benefits of Mindful Morning Routines",
    source: "Health Journal",
    time: "6h ago",
    category: "Health",
  },
];

export function NewsWidget() {
  return (
    <div className="dashboard-widget animate-scale-in">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Personalized News</h3>
      </div>

      <div className="space-y-4">
        {articles.map((article, index) => (
          <div
            key={index}
            className="group hover-subtle rounded-lg p-2 -m-2 cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>{article.source}</span>
                  <span>•</span>
                  <span>{article.time}</span>
                  <span className="px-2 py-0.5 bg-muted rounded-full">
                    {article.category}
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
