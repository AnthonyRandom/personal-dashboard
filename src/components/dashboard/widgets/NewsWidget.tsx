import { Newspaper, ExternalLink } from "lucide-react";
import { Widget } from "@/components/ui/widget";

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
    <Widget
      title="Personalized News"
      icon={<Newspaper className="w-5 h-5" />}
    >
      {articles.map((article, index) => (
        <div
          key={index}
          className="group hover-subtle rounded-lg p-2 -m-2 cursor-pointer focus:ring-2 focus:ring-primary/20 transition-all"
          role="button"
          tabIndex={0}
          aria-label={`Read article: ${article.title}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                {article.title}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>{article.source}</span>
                <span aria-hidden="true">•</span>
                <span>{article.time}</span>
                <span className="px-2 py-0.5 bg-muted rounded-full">
                  {article.category}
                </span>
              </div>
            </div>
            <ExternalLink 
              className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" 
              aria-hidden="true"
            />
          </div>
        </div>
      ))}
    </Widget>
  );
}
