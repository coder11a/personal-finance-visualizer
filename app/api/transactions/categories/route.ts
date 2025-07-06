import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type'); // 'income' or 'expense'

        const client = await clientPromise;
        const db = client.db('finance-tracker');
        const collection = db.collection('transactions');

        // Build aggregation pipeline
        const pipeline: object[] = [
            { $match: { type: type || 'expense' } }
        ];

        if (type) {
            pipeline[0] = { $match: { type } };
        }

        pipeline.push(
            {
                $group: {
                    _id: '$category',
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    category: { $ifNull: ['$_id', 'Uncategorized'] },
                    amount: '$totalAmount',
                    count: '$count'
                }
            },
            { $sort: { amount: -1 } }
        );

        const categoryData = await collection.aggregate(pipeline).toArray();

        // Calculate total for percentage calculation
        const total = categoryData.reduce((sum, item) => sum + item.amount, 0);

        // Add percentage and colors
        const colors = [
            '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
            '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
            '#14B8A6', '#F43F5E'
        ];

        const result = categoryData.map((item, index) => ({
            category: item.category,
            amount: item.amount,
            percentage: total > 0 ? Math.round((item.amount / total) * 100) : 0,
            count: item.count,
            color: colors[index % colors.length]
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching category data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch category data' },
            { status: 500 }
        );
    }
} 