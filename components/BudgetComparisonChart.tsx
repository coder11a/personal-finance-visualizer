'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BudgetComparison } from '@/lib/types';

interface BudgetComparisonChartProps {
    data: BudgetComparison[];
    isLoading: boolean;
    month: string;
}

export function BudgetComparisonChart({ data, isLoading, month }: BudgetComparisonChartProps) {
    if (isLoading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Budget vs Actual</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Budget vs Actual</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-64 text-slate-500">
                        <div className="text-center">
                            <p>No budget data available for {month}</p>
                            <p className="text-sm">Set budgets to see comparison</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const formatMonth = (monthString: string) => {
        const [year, month] = monthString.split('-');
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">
                    Budget vs Actual - {formatMonth(month)}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.map((item) => (
                        <div key={item.category} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                    {item.category}
                                </span>
                                <div className="text-right">
                                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        ₹{item.actual.toFixed(2)} / ₹{item.budget.toFixed(2)}
                                    </div>
                                    <div className={`text-xs ${item.percentage > 100
                                            ? 'text-red-600 dark:text-red-400'
                                            : item.percentage > 80
                                                ? 'text-yellow-600 dark:text-yellow-400'
                                                : 'text-green-600 dark:text-green-400'
                                        }`}>
                                        {item.percentage}% used
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all duration-300 ${item.percentage > 100
                                            ? 'bg-red-500'
                                            : item.percentage > 80
                                                ? 'bg-yellow-500'
                                                : 'bg-green-500'
                                        }`}
                                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                                />
                            </div>

                            {/* Budget Status */}
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>Budget: ₹{item.budget.toFixed(2)}</span>
                                <span className={`font-medium ${item.remaining >= 0
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    {item.remaining >= 0 ? 'Remaining: ' : 'Over budget: '}
                                    ₹{Math.abs(item.remaining).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                                ₹{data.reduce((sum, item) => sum + item.budget, 0).toFixed(2)}
                            </div>
                            <div className="text-xs text-slate-500">Total Budget</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                                ₹{data.reduce((sum, item) => sum + item.actual, 0).toFixed(2)}
                            </div>
                            <div className="text-xs text-slate-500">Total Spent</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 