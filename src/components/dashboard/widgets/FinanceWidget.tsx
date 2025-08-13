import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Widget } from "@/components/ui/widget";

export function FinanceWidget() {
  return (
    <Widget
      title="Finance"
      icon={<DollarSign className="w-5 h-5" />}
      footer={
        <p className="text-xs text-muted-foreground">
          You're saving 12% more than last month
        </p>
      }
    >
      <div>
        <p className="text-2xl font-bold">$4,247.83</p>
        <p className="text-sm text-muted-foreground">Total Balance</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between hover-subtle rounded-lg p-2 -m-2 transition-colors">
          <span className="text-sm">This Month</span>
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp className="w-3 h-3" aria-hidden="true" />
            <span className="text-xs font-medium">+$124.50</span>
          </div>
        </div>

        <div className="flex items-center justify-between hover-subtle rounded-lg p-2 -m-2 transition-colors">
          <span className="text-sm">Expenses</span>
          <div className="flex items-center gap-1 text-red-600">
            <TrendingDown className="w-3 h-3" aria-hidden="true" />
            <span className="text-xs font-medium">-$892.30</span>
          </div>
        </div>
      </div>
    </Widget>
  );
}
