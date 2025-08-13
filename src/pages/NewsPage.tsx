import { Newspaper, ExternalLink, Filter, Search, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const newsArticles = [
  {
    id: 1,
    title: "AI Breakthrough in Personal Productivity Tools Revolutionizes Daily Workflows",
    summary: "New artificial intelligence technologies are transforming how people manage their daily tasks and schedules, with productivity gains of up to 40% reported in recent studies.",
    source: "Tech Daily",
    time: "2h ago",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop",
    readTime: "3 min read"
  },
  {
    id: 2,
    title: "Market Update: Tech Stocks Rally Continues Amid Economic Recovery",
    summary: "Technology sector sees sustained growth as investors show confidence in digital transformation initiatives across industries.",
    source: "Financial Times",
    time: "4h ago",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop",
    readTime: "2 min read"
  },
  {
    id: 3,
    title: "New Study Shows Benefits of Mindful Morning Routines on Mental Health",
    summary: "Research indicates that structured morning practices can significantly improve focus, reduce stress, and enhance overall well-being.",
    source: "Health Journal",
    time: "6h ago",
    category: "Health",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
    readTime: "4 min read"
  },
  {
    id: 4,
    title: "Climate Tech Innovations Drive Investment Surge in Green Technologies",
    summary: "Venture capital funding for climate technology startups reaches record highs as sustainability becomes a priority.",
    source: "Environmental Weekly",
    time: "8h ago",
    category: "Environment",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=200&fit=crop",
    readTime: "5 min read"
  },
  {
    id: 5,
    title: "Remote Work Revolution: How Hybrid Models are Reshaping Corporate Culture",
    summary: "Companies worldwide are adapting to new work paradigms, with hybrid models becoming the standard for many organizations.",
    source: "Business Today",
    time: "12h ago",
    category: "Business",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=200&fit=crop",
    readTime: "6 min read"
  }
];

const categories = ["All", "Technology", "Finance", "Health", "Business", "Environment"];

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personalized News</h1>
          <p className="text-muted-foreground">Stay updated with AI-curated content</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="dashboard-widget">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input placeholder="Search news..." className="w-full" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button key={category} variant="outline" size="sm" className="whitespace-nowrap">
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Article */}
      <div className="dashboard-widget">
        <Badge className="mb-3">Featured</Badge>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{newsArticles[0].source}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {newsArticles[0].time}
              </div>
              <span>•</span>
              <span>{newsArticles[0].readTime}</span>
            </div>
            <h2 className="text-2xl font-bold leading-tight hover:text-primary transition-colors cursor-pointer">
              {newsArticles[0].title}
            </h2>
            <p className="text-muted-foreground">
              {newsArticles[0].summary}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{newsArticles[0].category}</Badge>
              <Button variant="ghost" size="sm" className="ml-auto">
                Read more <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden">
            <img 
              src={newsArticles[0].image} 
              alt={newsArticles[0].title}
              className="w-full h-64 object-cover hover:scale-105 transition-transform cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {newsArticles.slice(1).map((article) => (
          <div key={article.id} className="dashboard-widget group cursor-pointer">
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{article.source}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.time}
                  </div>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
                
                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {article.summary}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{article.category}</Badge>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trending Topics */}
      <div className="dashboard-widget">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Trending Topics</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {["AI Technology", "Climate Change", "Remote Work", "Digital Health", "Cryptocurrency", "Space Exploration"].map((topic) => (
            <Badge key={topic} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              #{topic}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}