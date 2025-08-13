import { DollarSign, TrendingUp, TrendingDown, CreditCard, PiggyBank, Target } from "lucide-react";

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finance Overview</h1>
        <p className="text-muted-foreground">Track your financial health and spending patterns</p>
      </div>

      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="dashboard-widget">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold">Total Balance</h3>
          </div>
          <div>
            <p className="text-3xl font-bold">$4,247.83</p>
            <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+2.4% this month</span>
            </div>
          </div>
        </div>

        <div className="dashboard-widget">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">Monthly Spending</h3>
          </div>
          <div>
            <p className="text-3xl font-bold">$2,847.30</p>
            <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+8.2% vs last month</span>
            </div>
          </div>
        </div>

        <div className="dashboard-widget">
          <div className="flex items-center gap-2 mb-4">
            <PiggyBank className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold">Savings Goal</h3>
          </div>
          <div>
            <p className="text-3xl font-bold">$1,250</p>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '62%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">$750 remaining to reach $2,000 goal</p>
          </div>
        </div>
      </div>

      {/* Spending Categories */}
      <div className="dashboard-widget">
        <h3 className="text-lg font-semibold mb-4">Spending Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[
              { category: "Housing", amount: 1200, percentage: 42, color: "bg-blue-500" },
              { category: "Food & Dining", amount: 380, percentage: 13, color: "bg-green-500" },
              { category: "Transportation", amount: 285, percentage: 10, color: "bg-yellow-500" },
              { category: "Utilities", amount: 190, percentage: 7, color: "bg-purple-500" },
              { category: "Entertainment", amount: 175, percentage: 6, color: "bg-red-500" },
              { category: "Other", amount: 617, percentage: 22, color: "bg-gray-500" },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-muted-foreground">${item.amount}</span>
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

          <div className="flex items-center justify-center">
            <div className="w-48 h-48 relative">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${42 * 2.51}, 251`}
                  className="text-blue-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold">$2,847</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="dashboard-widget">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {[
            { description: "Grocery Store", amount: -89.42, date: "Today", category: "Food" },
            { description: "Salary Deposit", amount: 3200.00, date: "Jan 15", category: "Income" },
            { description: "Electric Bill", amount: -127.50, date: "Jan 14", category: "Utilities" },
            { description: "Coffee Shop", amount: -8.75, date: "Jan 14", category: "Food" },
            { description: "Gas Station", amount: -45.20, date: "Jan 13", category: "Transportation" },
            { description: "Netflix Subscription", amount: -15.99, date: "Jan 12", category: "Entertainment" },
          ].map((transaction, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  transaction.amount > 0 ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <p className="font-medium text-sm">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">{transaction.category} • {transaction.date}</p>
                </div>
              </div>
              <div className={`font-semibold ${
                transaction.amount > 0 ? 'text-green-600' : 'text-foreground'
              }`}>
                {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Goals */}
      <div className="dashboard-widget">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Financial Goals</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { goal: "Emergency Fund", current: 2500, target: 5000, color: "bg-blue-500" },
            { goal: "Vacation Savings", current: 1250, target: 2000, color: "bg-green-500" },
            { goal: "New Car", current: 8500, target: 15000, color: "bg-purple-500" },
            { goal: "Home Down Payment", current: 12000, target: 40000, color: "bg-orange-500" },
          ].map((goal, index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">{goal.goal}</span>
                <span className="text-sm text-muted-foreground">
                  ${goal.current} / ${goal.target}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${goal.color}`}
                  style={{ width: `${(goal.current / goal.target) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((goal.current / goal.target) * 100)}% complete
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}