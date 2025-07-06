import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Transaction } from '@/lib/types';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('finance-tracker');
        const collection = db.collection('transactions');

        const transactions = await collection
            .find({})
            .sort({ date: -1 })
            .toArray();

        return NextResponse.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch transactions' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { amount, description, date, type, category } = body;

        // Basic validation
        if (!amount || !description || !date || !type) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (type !== 'income' && type !== 'expense') {
            return NextResponse.json(
                { error: 'Type must be either income or expense' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('finance-tracker');
        const collection = db.collection('transactions');

        const transaction: Omit<Transaction, '_id'> = {
            amount: parseFloat(amount),
            description,
            date,
            type,
            category,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await collection.insertOne(transaction);

        return NextResponse.json(
            { ...transaction, _id: result.insertedId },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating transaction:', error);
        return NextResponse.json(
            { error: 'Failed to create transaction' },
            { status: 500 }
        );
    }
} 