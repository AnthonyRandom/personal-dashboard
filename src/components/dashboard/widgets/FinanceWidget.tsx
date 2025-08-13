import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export function FinanceWidget() {
  return (
    <div className="dashboard-widget animate-scale-in">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Finance</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-2xl font-bold">$4,247.83</p>
          <p className="text-sm text-muted-foreground">Total Balance</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">This Month</span>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs font-medium">+$124.50</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Expenses</span>
            <div className="flex items-center gap-1 text-red-600">
              <TrendingDown className="w-3 h-3" />
              <span className="text-xs font-medium">-$892.30</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            You're saving 12% more than last month
          </p>
        </div>
      </div>
    </div>
  );
}
