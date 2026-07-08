import { CardListSkeleton } from "@/components/shared/card-list-skeleton";

export default function QuizzesLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="h-8 w-32 bg-muted rounded animate-pulse" />
        <div className="h-4 w-64 bg-muted rounded animate-pulse" />
      </div>
      <CardListSkeleton />
    </div>
  );
}