import { Skeleton } from "@/components/ui/skeleton"; // adjust this path to your Skeleton component
import { Card, CardContent } from "@/components/ui/card";

export function CardSkeleton() {
    return (
        <div className="group my-4 cursor-pointer max-w-2xl mx-auto">
            <Card className="h-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-16 w-20 rounded-md" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32 rounded" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border border-blue-100 dark:border-blue-800/30">
                            <Skeleton className="h-4 w-20 mb-2" />
                            <Skeleton className="h-5 w-40" />
                        </div>

                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
