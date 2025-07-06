'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryData } from '@/lib/types';

interface CategoryPieChartProps {
    data: CategoryData[];
    isLoading: boolean;
    title: string;
    type: 'income' | 'expense';
}

export function CategoryPieChart({ data, isLoading, title, type }: CategoryPieChartProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    if (isLoading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">{title}</CardTitle>
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
                    <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-64 text-slate-500">
                        <p>No {type} data available</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const total = data.reduce((sum, item) => sum + item.amount, 0);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pie Chart */}
                    <div className="relative w-48 h-48 mx-auto">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            {data.map((item, index) => {
                                const percentage = item.percentage;
                                const circumference = 2 * Math.PI * 45; // radius = 45
                                const strokeDasharray = (percentage / 100) * circumference;
                                const strokeDashoffset = 0;

                                // Calculate the start angle for each segment
                                let startAngle = 0;
                                for (let i = 0; i < index; i++) {
                                    startAngle += (data[i].percentage / 100) * 360;
                                }

                                const x1 = 50 + 45 * Math.cos((startAngle * Math.PI) / 180);
                                const y1 = 50 + 45 * Math.sin((startAngle * Math.PI) / 180);
                                const x2 = 50 + 45 * Math.cos(((startAngle + (percentage * 360) / 100) * Math.PI) / 180);
                                const y2 = 50 + 45 * Math.sin(((startAngle + (percentage * 360) / 100) * Math.PI) / 180);

                                const largeArcFlag = percentage > 50 ? 1 : 0;

                                const pathData = [
                                    `M 50 50`,
                                    `L ${x1} ${y1}`,
                                    `A 45 45 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                                    'Z'
                                ].join(' ');

                                return (
                                    <path
                                        key={item.category}
                                        d={pathData}
                                        fill={item.color}
                                        className="transition-all duration-200 hover:opacity-80 cursor-pointer"
                                        onClick={() => setSelectedCategory(selectedCategory === item.category ? null : item.category)}
                                    />
                                );
                            })}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                                    ₹{total.toFixed(2)}
                                </div>
                                <div className="text-sm text-slate-500">Total</div>
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="space-y-3">
                        <h4 className="font-medium text-slate-700 dark:text-slate-300">Categories</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {data.map((item) => (
                                <div
                                    key={item.category}
                                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedCategory === item.category
                                            ? 'bg-slate-100 dark:bg-slate-700'
                                            : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                    onClick={() => setSelectedCategory(selectedCategory === item.category ? null : item.category)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {item.category}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            ₹{item.amount.toFixed(2)}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {item.percentage}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 