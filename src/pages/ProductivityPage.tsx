import { TrendingUp, Target, Clock, BarChart3, Calendar, Zap } from "lucide-react";

export default function ProductivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Productivity Insights</h1>
        <p className="text-muted-foreground">Track your productivity patterns and optimize your workflow</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="dashboard-widget text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold">6.2h</p>
          <p className="text-sm text-muted-foreground">Focus Time Today</p>
          <p className="text-xs text-green-600 mt-1">+23% vs yesterday</p>
        </div>

        <div className="dashboard-widget text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold">12/15</p>
          <p className="text-sm text-muted-foreground">Goals Completed</p>
          <p className="text-xs text-green-600 mt-1">80% completion rate</p>
        </div>

        <div className="dashboard-widget text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl font-bold">+15%</p>
          <p className="text-sm text-muted-foreground">Weekly Growth</p>
          <p className="text-xs text-green-600 mt-1">Above average</p>
        </div>

        <div className="dashboard-widget text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-2xl font-bold">9-11 AM</p>
          <p className="text-sm text-muted-foreground">Peak Hours</p>
          <p className="text-xs text-blue-600 mt-1">Highest efficiency</p>
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="dashboard-widget">
        <h3 className="text-lg font-semibold mb-4">Weekly Productivity Overview</h3>
        <div className="grid grid-cols-7 gap-2">
          {[
            { day: "Mon", hours: 7.2, completed: 8, total: 10 },
            { day: "Tue", hours: 6.8, completed: 7, total: 9 },
            { day: "Wed", hours: 8.1, completed: 9, total: 10 },
            { day: "Thu", hours: 5.9, completed: 6, total: 8 },
            { day: "Fri", hours: 6.2, completed: 7, total: 8 },
            { day: "Sat", hours: 3.5, completed: 4, total: 5 },
            { day: "Sun", hours: 2.1, completed: 2, total: 3 },
          ].map((day, index) => (
            <div key={index} className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-xs font-medium mb-2">{day.day}</p>
              <div className="space-y-1">
                <p className="text-sm font-semibold">{day.hours}h</p>
                <div className="w-full bg-background rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${(day.completed / day.total) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">{day.completed}/{day.total}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dashboard-widget">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Time Distribution</h3>
          </div>
          <div className="space-y-4">
            {[
              { category: "Deep Work", time: "3.2h", percentage: 52, color: "bg-blue-500" },
              { category: "Meetings", time: "1.8h", percentage: 29, color: "bg-green-500" },
              { category: "Communication", time: "0.8h", percentage: 13, color: "bg-yellow-500" },
              { category: "Admin", time: "0.4h", percentage: 6, color: "bg-gray-500" },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-muted-foreground">{item.time}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-widget">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Recent Achievements</h3>
          </div>
          <div className="space-y-3">
            {[
              { achievement: "Completed 5-day focus streak", date: "Today" },
              { achievement: "Reached weekly goal early", date: "Yesterday" },
              { achievement: "Best productivity week this month", date: "3 days ago" },
              { achievement: "No meeting overlap conflicts", date: "1 week ago" },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.achievement}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="dashboard-widget">
        <h3 className="text-lg font-semibold mb-4">AI Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Optimize Your Schedule</h4>
            <p className="text-sm text-blue-700">
              Your most productive hours are 9-11 AM. Consider scheduling important tasks during this time for maximum efficiency.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">Take More Breaks</h4>
            <p className="text-sm text-green-700">
              You've been focused for 2+ hours. A 10-minute break can boost your next session's productivity by 15%.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">Meeting Efficiency</h4>
            <p className="text-sm text-purple-700">
              Consider batching meetings on Tuesday and Thursday to create longer focus blocks on other days.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
            <h4 className="font-medium text-orange-900 mb-2">Goal Adjustment</h4>
            <p className="text-sm text-orange-700">
              You're consistently exceeding your daily goals. Consider increasing them by 20% for optimal challenge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}