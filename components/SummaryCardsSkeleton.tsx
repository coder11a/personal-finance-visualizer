import { Skeleton } from '@/components/ui/skeleton';

export function SummaryCardsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="w-10 h-10 rounded-full" />
                    </div>
                    <Skeleton className="h-8 w-32" />
                </div>
            ))}
        </div>
    );
} 