import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const client = await clientPromise;
        const db = client.db('finance-tracker');
        const collection = db.collection('budgets');

        // Convert string ID to ObjectId for MongoDB
        const { ObjectId } = await import('mongodb');
        const objectId = new ObjectId(id);
        const result = await collection.deleteOne({ _id: objectId });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: 'Budget not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Budget deleted successfully' });
    } catch (error) {
        console.error('Error deleting budget:', error);
        return NextResponse.json(
            { error: 'Failed to delete budget' },
            { status: 500 }
        );
    }
} 