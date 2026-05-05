import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StorageMeterProps {
  storageUsed: number;
  storageLimit: number;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(1)} GB`;
}

export default function StorageMeter({
  storageUsed,
  storageLimit,
}: StorageMeterProps) {
  const percentage = Math.round((storageUsed / storageLimit) * 100);
  const isWarning = percentage >= 80;
  const isFull = percentage >= 100;

  return (
    <div className="bg-white p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-slate-700 text-sm">Storage</span>
        <span
          className={cn(
            "font-medium text-xs",
            isFull
              ? "text-red-600"
              : isWarning
                ? "text-amber-600"
                : "text-slate-500",
          )}
        >
          {formatBytes(storageUsed)} / {formatBytes(storageLimit)}
        </span>
      </div>
      <Progress
        value={percentage}
        className={cn(
          "h-2",
          isFull
            ? "[&>div]:bg-red-500"
            : isWarning
              ? "[&>div]:bg-amber-500"
              : "[&>div]:bg-slate-900",
        )}
      />
      {isFull && (
        <p className="mt-2 text-red-600 text-xs">
          Storage full. Delete files to upload more.
        </p>
      )}
      {isWarning && !isFull && (
        <p className="mt-2 text-amber-600 text-xs">
          Running low on storage. Consider deleting unused files.
        </p>
      )}
    </div>
  );
}
