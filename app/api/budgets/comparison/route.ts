import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const month = searchParams.get('month'); // Format: "YYYY-MM"

        if (!month) {
            return NextResponse.json(
                { error: 'Month parameter is required' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('finance-tracker');

        // Get budgets for the month
        const budgetsCollection = db.collection('budgets');
        const budgets = await budgetsCollection.find({ month }).toArray();

        if (budgets.length === 0) {
            return NextResponse.json([]);
        }

        // Get actual spending for the month
        const transactionsCollection = db.collection('transactions');
        const startDate = `${month}-01`;
        const endDate = `${month}-31`;

        const actualSpending = await transactionsCollection.aggregate([
            {
                $match: {
                    type: 'expense',
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$category',
                    totalAmount: { $sum: '$amount' }
                }
            },
            {
                $project: {
                    category: { $ifNull: ['$_id', 'Uncategorized'] },
                    amount: '$totalAmount'
                }
            }
        ]).toArray();

        // Create a map of actual spending by category
        const actualMap = new Map();
        actualSpending.forEach(item => {
            actualMap.set(item.category, item.amount);
        });

        // Colors for different categories
        const colors = [
            '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
            '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
            '#14B8A6', '#F43F5E'
        ];

        // Combine budget and actual data
        const comparison = budgets.map((budget, index) => {
            const actual = actualMap.get(budget.category) || 0;
            const remaining = budget.amount - actual;
            const percentage = budget.amount > 0 ? Math.round((actual / budget.amount) * 100) : 0;

            return {
                category: budget.category,
                budget: budget.amount,
                actual,
                remaining,
                percentage,
                color: colors[index % colors.length]
            };
        });

        return NextResponse.json(comparison);
    } catch (error) {
        console.error('Error fetching budget comparison:', error);
        return NextResponse.json(
            { error: 'Failed to fetch budget comparison' },
            { status: 500 }
        );
    }
} 