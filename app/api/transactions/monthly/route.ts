import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { MonthlyData } from '@/lib/types';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('finance-tracker');
        const collection = db.collection('transactions');

        // Get transactions from the last 12 months
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
        twelveMonthsAgo.setDate(1);
        twelveMonthsAgo.setHours(0, 0, 0, 0);

        const pipeline = [
            {
                $match: {
                    date: { $gte: twelveMonthsAgo.toISOString().split('T')[0] }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: { $dateFromString: { dateString: '$date' } } },
                        month: { $month: { $dateFromString: { dateString: '$date' } } }
                    },
                    expenses: {
                        $sum: {
                            $cond: [
                                { $eq: ['$type', 'expense'] },
                                '$amount',
                                0
                            ]
                        }
                    },
                    income: {
                        $sum: {
                            $cond: [
                                { $eq: ['$type', 'income'] },
                                '$amount',
                                0
                            ]
                        }
                    }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ];

        const results = await collection.aggregate(pipeline).toArray();

        const monthlyData: MonthlyData[] = results.map((result) => {
            const monthNames = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];

            return {
                month: `${monthNames[result._id.month - 1]} ${result._id.year}`,
                expenses: result.expenses,
                income: result.income
            };
        });

        return NextResponse.json(monthlyData);
    } catch (error) {
        console.error('Error fetching monthly data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch monthly data' },
            { status: 500 }
        );
    }
} 