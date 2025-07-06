'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SpendingInsight } from '@/lib/types';

interface SpendingInsightsProps {
    insights: SpendingInsight[];
    isLoading: boolean;
}

export function SpendingInsights({ insights, isLoading }: SpendingInsightsProps) {
    if (isLoading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Spending Insights</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!insights || insights.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Spending Insights</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-slate-500">
                        <p>No insights available yet</p>
                        <p className="text-sm">Add more transactions to see insights</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Spending Insights</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {insights.map((insight, index) => (
                        <div
                            key={index}
                            className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                            style={{ borderLeftColor: insight.color, borderLeftWidth: '4px' }}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="text-2xl">{insight.icon}</div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-slate-700 dark:text-slate-300">
                                        {insight.value}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm mb-1">
                                    {insight.title}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {insight.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 