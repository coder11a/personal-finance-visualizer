import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const month = searchParams.get('month'); // Format: "YYYY-MM"

        const client = await clientPromise;
        const db = client.db('finance-tracker');
        const collection = db.collection('transactions');

        // Build date filter
        const dateFilter = month ? {
            date: {
                $gte: `${month}-01`,
                $lte: `${month}-31`
            }
        } : {};

        // Get all expenses for the period
        const expenses = await collection.find({
            type: 'expense',
            ...dateFilter
        }).toArray();

        if (expenses.length === 0) {
            return NextResponse.json([]);
        }

        // Calculate insights
        const insights = [];

        // 1. Highest spending category
        const categorySpending = new Map();
        expenses.forEach(expense => {
            const category = expense.category || 'Uncategorized';
            categorySpending.set(category, (categorySpending.get(category) || 0) + expense.amount);
        });

        let highestCategory = '';
        let highestAmount = 0;
        categorySpending.forEach((amount, category) => {
            if (amount > highestAmount) {
                highestAmount = amount;
                highestCategory = category;
            }
        });

        if (highestCategory) {
            insights.push({
                type: 'highest',
                title: 'Highest Spending Category',
                description: `You spent the most on ${highestCategory}`,
                value: `₹${highestAmount.toFixed(2)}`,
                icon: '📈',
                color: '#EF4444'
            });
        }

        // 2. Average daily spending
        const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const daysInPeriod = month ? 30 : 30; // Simplified calculation
        const avgDailySpending = totalSpending / daysInPeriod;

        insights.push({
            type: 'trend',
            title: 'Average Daily Spending',
            description: 'Your daily spending average',
            value: `₹${avgDailySpending.toFixed(2)}`,
            icon: '📊',
            color: '#3B82F6'
        });

        // 3. Total transactions count
        insights.push({
            type: 'category',
            title: 'Total Transactions',
            description: 'Number of expense transactions',
            value: expenses.length.toString(),
            icon: '🛒',
            color: '#10B981'
        });

        // 4. Most expensive single transaction
        const mostExpensive = expenses.reduce((max, expense) =>
            expense.amount > max.amount ? expense : max, expenses[0]);

        if (mostExpensive) {
            insights.push({
                type: 'highest',
                title: 'Most Expensive Transaction',
                description: mostExpensive.description,
                value: `₹${mostExpensive.amount.toFixed(2)}`,
                icon: '💸',
                color: '#F59E0B'
            });
        }

        // 5. Spending trend (compare with previous month if available)
        if (month) {
            const currentMonth = month;
            const [year, monthNum] = currentMonth.split('-');
            const prevMonth = monthNum === '01'
                ? `${parseInt(year) - 1}-12`
                : `${year}-${(parseInt(monthNum) - 1).toString().padStart(2, '0')}`;

            const prevMonthExpenses = await collection.find({
                type: 'expense',
                date: {
                    $gte: `${prevMonth}-01`,
                    $lte: `${prevMonth}-31`
                }
            }).toArray();

            const prevMonthTotal = prevMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            const change = totalSpending - prevMonthTotal;
            const changePercent = prevMonthTotal > 0 ? (change / prevMonthTotal) * 100 : 0;

            insights.push({
                type: 'trend',
                title: 'Month-over-Month Change',
                description: change >= 0 ? 'Spending increased' : 'Spending decreased',
                value: `${change >= 0 ? '+' : ''}${changePercent.toFixed(1)}%`,
                icon: change >= 0 ? '📈' : '📉',
                color: change >= 0 ? '#EF4444' : '#10B981'
            });
        }

        return NextResponse.json(insights);
    } catch (error) {
        console.error('Error generating insights:', error);
        return NextResponse.json(
            { error: 'Failed to generate insights' },
            { status: 500 }
        );
    }
} 