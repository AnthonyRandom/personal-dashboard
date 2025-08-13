import { Heart, Activity, Target, TrendingUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HealthPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health & Wellness</h1>
          <p className="text-muted-foreground">Track your health metrics and wellness goals</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Log Activity
        </Button>
      </div>

      {/* Daily Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="dashboard-widget">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">Steps</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-3xl font-bold">8,547</p>
              <p className="text-sm text-muted-foreground">of 10,000 goal</p>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div className="bg-blue-500 h-3 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground">1,453 steps remaining</p>
          </div>
        </div>

        <div className="dashboard-widget">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold">Heart Rate</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-3xl font-bold">72 <span className="text-sm font-normal">bpm</span></p>
              <p className="text-sm text-muted-foreground">Resting rate</p>
            </div>
            <div className="text-xs text-green-600 font-medium">
              ↓ 3 bpm lower than yesterday
            </div>
          </div>
        </div>

        <div className="dashboard-widget">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold">Calories</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-3xl font-bold">1,847</p>
              <p className="text-sm text-muted-foreground">burned today</p>
            </div>
            <div className="text-xs text-green-600 font-medium">
              ↑ 12% above average
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="dashboard-widget">
        <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-xl font-bold">52,340</p>
            <p className="text-sm text-muted-foreground">Steps this week</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Target className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xl font-bold">5/7</p>
            <p className="text-sm text-muted-foreground">Workout days</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-xl font-bold">7h 23m</p>
            <p className="text-sm text-muted-foreground">Avg sleep</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-xl font-bold">1.8L</p>
            <p className="text-sm text-muted-foreground">Daily water avg</p>
          </div>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dashboard-widget">
          <h3 className="text-lg font-semibold mb-4">Sleep Tracking</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Last night</span>
              <span className="font-semibold">7h 45m</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Deep sleep</span>
                <span>2h 15m</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Light sleep</span>
                <span>4h 30m</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>REM sleep</span>
                <span>1h 00m</span>
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">Sleep quality: Excellent</p>
            </div>
          </div>
        </div>

        <div className="dashboard-widget">
          <h3 className="text-lg font-semibold mb-4">Nutrition</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Calories consumed</span>
              <span className="font-semibold">2,140</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Protein</span>
                <span>125g</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Carbs</span>
                <span>280g</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Fat</span>
                <span>78g</span>
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">Within daily targets</p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals */}
      <div className="dashboard-widget">
        <h3 className="text-lg font-semibold mb-4">Health Goals</h3>
        <div className="space-y-4">
          {[
            { goal: "Walk 10,000 steps daily", progress: 85, current: "8,547", target: "10,000" },
            { goal: "Drink 8 glasses of water", progress: 62, current: "5", target: "8" },
            { goal: "Sleep 8 hours", progress: 96, current: "7h 45m", target: "8h" },
            { goal: "Exercise 5 times per week", progress: 71, current: "5", target: "7" },
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.goal}</span>
                <span className="text-xs text-muted-foreground">{item.current} / {item.target}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all" 
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}