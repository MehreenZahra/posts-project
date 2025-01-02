
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-6">
      <div className="min-h-screen bg-background">
        <div className="space-y-6">
          <div className="animate-pulse space-y-6">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
