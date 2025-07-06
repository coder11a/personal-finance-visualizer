import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const updateData = {
            amount: parseFloat(amount),
            description,
            date,
            type,
            category,
            updatedAt: new Date(),
        };

        const resolvedParams = await params;
        const result = await collection.updateOne(
            { _id: new ObjectId(resolvedParams.id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: 'Transaction not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating transaction:', error);
        return NextResponse.json(
            { error: 'Failed to update transaction' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const client = await clientPromise;
        const db = client.db('finance-tracker');
        const collection = db.collection('transactions');

        const resolvedParams = await params;
        const result = await collection.deleteOne({
            _id: new ObjectId(resolvedParams.id),
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: 'Transaction not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        return NextResponse.json(
            { error: 'Failed to delete transaction' },
            { status: 500 }
        );
    }
} 