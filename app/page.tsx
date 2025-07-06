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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">

          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Personal Finance Visualizer
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Track your income and expenses with beautiful visualizations and gain insights into your financial health
          </p>
        </div>

        {/* Summary Cards */}
        {isLoading ? (
          <SummaryCardsSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">
                  Total Income
                </h3>
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                ₹{totalIncome.toFixed(2)}
              </p>
            </div>

            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">
                  Total Expenses
                </h3>
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-red-700 dark:text-red-300">
                ₹{totalExpenses.toFixed(2)}
              </p>
            </div>

            <div className={`bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${balance >= 0 ? 'ring-2 ring-green-200 dark:ring-green-800' : 'ring-2 ring-red-200 dark:ring-red-800'
              }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-semibold uppercase tracking-wide ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                  Balance
                </h3>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${balance >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                  <svg className={`w-5 h-5 ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                }`}>
                ₹{balance.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Month Selector */}
        <div className="mb-8">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">Dashboard</h2>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Select Month:
                </label>
                <input
                  type="month"
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(e.target.value)}
                  className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Spending Insights */}
        <div className="mb-12">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
            <SpendingInsights
              insights={spendingInsights}
              isLoading={isLoadingInsights}
            />
          </div>
        </div>

        {/* Budget Management and Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
            <BudgetManager
              month={currentMonth}
              onBudgetUpdate={handleBudgetUpdate}
            />
          </div>
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
            <BudgetComparisonChart
              data={budgetComparison}
              isLoading={isLoadingBudgets}
              month={currentMonth}
            />
          </div>
        </div>

        {/* Category Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
            <CategoryPieChart
              data={expenseCategories}
              isLoading={isLoadingCategories}
              title="Expense Breakdown"
              type="expense"
            />
          </div>
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
            <CategoryPieChart
              data={incomeCategories}
              isLoading={isLoadingCategories}
              title="Income Breakdown"
              type="income"
            />
          </div>
        </div>

        {/* Monthly Chart and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
            <MonthlyChart data={monthlyData} isLoading={isLoadingChart} />
          </div>
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
            <RecentTransactions
              transactions={transactions}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* All Transactions */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6 mb-12">
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
      <footer className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-t border-white/20 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Made with ❤️ by{' '}
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Abhishek Jain
              </span>
            </p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}
