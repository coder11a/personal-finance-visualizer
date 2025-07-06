'use client';


import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MonthlyData } from '@/lib/types';

interface MonthlyChartProps {
    data: MonthlyData[];
    isLoading?: boolean;
}

export function MonthlyChart({ data, isLoading = false }: MonthlyChartProps) {
    if (isLoading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Loading chart...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
            </div>
        );
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const CustomTooltip = ({ active, payload, label }: {
        active?: boolean;
        payload?: Array<{ value: number; dataKey: string }>;
        label?: string;
    }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border rounded-lg p-3 shadow-lg">
                    <p className="font-medium">{label}</p>
                    <p className="text-red-600">
                        Expenses: {formatCurrency(payload[0].value)}
                    </p>
                    <p className="text-green-600">
                        Income: {formatCurrency(payload[1].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold mb-6">Monthly Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis
                        tickFormatter={formatCurrency}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                        dataKey="expenses"
                        fill="#ef4444"
                        radius={[4, 4, 0, 0]}
                        name="Expenses"
                    />
                    <Bar
                        dataKey="income"
                        fill="#22c55e"
                        radius={[4, 4, 0, 0]}
                        name="Income"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
} 