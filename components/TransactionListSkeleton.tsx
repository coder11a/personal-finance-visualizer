import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export function TransactionListSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-40" />
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-1">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-5 w-16 rounded-full" />
                                    </div>
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-5 w-20" />
                                    <div className="flex gap-1">
                                        <Skeleton className="h-8 w-8 rounded" />
                                        <Skeleton className="h-8 w-8 rounded" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
} 