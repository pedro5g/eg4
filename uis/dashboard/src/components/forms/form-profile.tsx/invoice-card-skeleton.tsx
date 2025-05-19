import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export const InvoiceCardSkeleton = () => {
  return (
    <div className="flex-col space-y-2 px-3 items-center space-x-4 border bg-blue-100 rounded-md animate-pulse py-2">
      <div className="flex items-center justify-center space-x-4">
        <Skeleton className="size-8 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-[100px]" />
          <Skeleton className="h-3 w-[50px]" />
        </div>
        <div className="ml-auto mb-auto">
          <Skeleton className=" h-3 w-[50px]" />
        </div>
      </div>
      <Separator className="my-2" />
      <Skeleton className="h-1 w-[250px]" />
      <Skeleton className="h-1 w-[250px]" />
    </div>
  );
};
