'use client';

import { useState, useEffect } from 'react';
import { TransactionList } from '@/components/TransactionList';
import { MonthlyChart } from '@/components/MonthlyChart';
import { CategoryPieChart } from '@/components/CategoryPieChart';
import { RecentTransactions } from '@/components/RecentTransactions';
import { BudgetManager } from '@/components/BudgetManager';
import { BudgetComparisonChart } from '@/components/BudgetComparisonChart';
import { SpendingInsights } from '@/components/SpendingInsights';
import { SummaryCardsSkeleton } from '@/components/SummaryCardsSkeleton';
import { TransactionListSkeleton } from '@/components/TransactionListSkeleton';
import { Transaction, MonthlyData, CategoryData, BudgetComparison, SpendingInsight } from '@/lib/types';
import { Toaster } from 'sonner';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<CategoryData[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<CategoryData[]>([]);
  const [budgetComparison, setBudgetComparison] = useState<BudgetComparison[]>([]);
  const [spendingInsights, setSpendingInsights] = useState<SpendingInsight[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingBudgets, setIsLoadingBudgets] = useState(true);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMonthlyData = async () => {
    try {
      const response = await fetch('/api/transactions/monthly');
      if (!response.ok) {
        throw new Error('Failed to fetch monthly data');
      }
      const data = await response.json();
      setMonthlyData(data);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    } finally {
      setIsLoadingChart(false);
    }
  };

  const fetchCategoryData = async () => {
    try {
      const [expenseResponse, incomeResponse] = await Promise.all([
        fetch('/api/transactions/categories?type=expense'),
        fetch('/api/transactions/categories?type=income')
      ]);

      if (expenseResponse.ok) {
        const expenseData = await expenseResponse.json();
        setExpenseCategories(expenseData);
      }

      if (incomeResponse.ok) {
        const incomeData = await incomeResponse.json();
        setIncomeCategories(incomeData);
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const fetchBudgetData = async () => {
    try {
      const response = await fetch(`/api/budgets/comparison?month=${currentMonth}`);
      if (response.ok) {
        const data = await response.json();
        setBudgetComparison(data);
      }
    } catch (error) {
      console.error('Error fetching budget data:', error);
    } finally {
      setIsLoadingBudgets(false);
    }
  };

  const fetchInsightsData = async () => {
    try {
      const response = await fetch(`/api/insights?month=${currentMonth}`);
      if (response.ok) {
        const data = await response.json();
        setSpendingInsights(data);
      }
    } catch (error) {
      console.error('Error fetching insights data:', error);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchMonthlyData();
    fetchCategoryData();
    fetchBudgetData();
    fetchInsightsData();
  }, [currentMonth]);

  const handleTransactionUpdate = () => {
    fetchTransactions();
    fetchMonthlyData();
    fetchCategoryData();
    fetchBudgetData();
    fetchInsightsData();
  };

  const handleBudgetUpdate = () => {
    fetchBudgetData();
    fetchInsightsData();
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">

          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 animate-fade-in">
            Personal Finance Visualizer
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Track your income and expenses with beautiful visualizations and gain insights into your financial health
          </p>
          <div className="flex items-center justify-center space-x-4 mt-6">
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Real-time tracking</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
              <span>Smart insights</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-600"></div>
              <span>Budget management</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {isLoading ? (
          <SummaryCardsSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:scale-105">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
                  Total Income
                </h3>
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl font-bold text-green-700 dark:text-green-300 mb-2">
                ₹{totalIncome.toFixed(2)}
              </p>
              <div className="w-full bg-green-100 dark:bg-green-900/30 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min((totalIncome / (totalIncome + totalExpenses)) * 100, 100)}%` }}></div>
              </div>
            </div>

            <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:scale-105">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                  Total Expenses
                </h3>
                <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl font-bold text-red-700 dark:text-red-300 mb-2">
                ₹{totalExpenses.toFixed(2)}
              </p>
              <div className="w-full bg-red-100 dark:bg-red-900/30 rounded-full h-2">
                <div className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min((totalExpenses / (totalIncome + totalExpenses)) * 100, 100)}%` }}></div>
              </div>
            </div>

            <div className={`group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 ${balance >= 0 ? 'ring-2 ring-green-200/50 dark:ring-green-800/50' : 'ring-2 ring-red-200/50 dark:ring-red-800/50'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-sm font-bold uppercase tracking-wider ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  Balance
                </h3>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ${balance >= 0 ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-600'}`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className={`text-4xl font-bold mb-2 ${balance >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                ₹{balance.toFixed(2)}
              </p>
              <div className={`w-full rounded-full h-2 ${balance >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                <div className={`h-2 rounded-full transition-all duration-1000 ${balance >= 0 ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-red-400 to-red-600'}`} style={{ width: `${Math.min(Math.abs(balance) / (totalIncome + totalExpenses) * 100, 100)}%` }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Month Selector */}
        <div className="mb-12">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">Financial Dashboard</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Track your finances month by month</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Select Month:
                </label>
                <div className="relative">
                  <input
                    type="month"
                    value={currentMonth}
                    onChange={(e) => setCurrentMonth(e.target.value)}
                    className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg transition-all duration-300 hover:shadow-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spending Insights */}
        <div className="mb-16">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-8">
            <SpendingInsights
              insights={spendingInsights}
              isLoading={isLoadingInsights}
            />
          </div>
        </div>

        {/* Budget Management and Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-8 hover:shadow-3xl transition-all duration-500">
            <BudgetManager
              month={currentMonth}
              onBudgetUpdate={handleBudgetUpdate}
            />
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-8 hover:shadow-3xl transition-all duration-500">
            <BudgetComparisonChart
              data={budgetComparison}
              isLoading={isLoadingBudgets}
              month={currentMonth}
            />
          </div>
        </div>

        {/* Category Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-8 hover:shadow-3xl transition-all duration-500">
            <CategoryPieChart
              data={expenseCategories}
              isLoading={isLoadingCategories}
              title="Expense Breakdown"
              type="expense"
            />
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-8 hover:shadow-3xl transition-all duration-500">
            <CategoryPieChart
              data={incomeCategories}
              isLoading={isLoadingCategories}
              title="Income Breakdown"
              type="income"
            />
          </div>
        </div>

        {/* Monthly Chart and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <MonthlyChart data={monthlyData} isLoading={isLoadingChart} />
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-8 hover:shadow-3xl transition-all duration-500">
            <RecentTransactions
              transactions={transactions}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* All Transactions */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-8 mb-16 hover:shadow-3xl transition-all duration-500">
          {isLoading ? (
            <TransactionListSkeleton />
          ) : (
            <TransactionList
              transactions={transactions}
              onTransactionUpdate={handleTransactionUpdate}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-t border-white/30 mt-auto relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                Made with ❤️ by{' '}
                <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Abhishek Jain
                </span>
              </p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Personal Finance Visualizer • Track • Analyze • Grow
            </p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}
