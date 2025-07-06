import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Budget } from '@/lib/types';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const month = searchParams.get('month'); // Format: "YYYY-MM"

        const client = await clientPromise;
        const db = client.db('finance-tracker');
        const collection = db.collection('budgets');

        const query = month ? { month } : {};
        const budgets = await collection
            .find(query)
            .sort({ month: -1, category: 1 })
            .toArray();

        return NextResponse.json(budgets);
    } catch (error) {
        console.error('Error fetching budgets:', error);
        return NextResponse.json(
            { error: 'Failed to fetch budgets' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { month, category, amount } = body;

        // Basic validation
        if (!month || !category || !amount) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (parseFloat(amount) <= 0) {
            return NextResponse.json(
                { error: 'Amount must be greater than 0' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('finance-tracker');
        const collection = db.collection('budgets');

        // Check if budget already exists for this month and category
        const existingBudget = await collection.findOne({ month, category });
        if (existingBudget) {
            return NextResponse.json(
                { error: 'Budget already exists for this month and category' },
                { status: 409 }
            );
        }

        const budget: Omit<Budget, '_id'> = {
            month,
            category,
            amount: parseFloat(amount),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await collection.insertOne(budget);

        return NextResponse.json(
            { ...budget, _id: result.insertedId },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating budget:', error);
        return NextResponse.json(
            { error: 'Failed to create budget' },
            { status: 500 }
        );
    }
} 