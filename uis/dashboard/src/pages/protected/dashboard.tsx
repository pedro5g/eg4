import { ApiGetSummary } from "@/api/endpoints";
import { StatusChart } from "@/components/dashboard/status-chart";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { TopStatesChart } from "@/components/dashboard/top-states-chart";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { useQuery } from "@tanstack/react-query";

export function Dashboard() {
  const { data, isLoading } = useQuery({
    queryFn: () => ApiGetSummary(),
    queryKey: ["summary"],
  });

  if (isLoading || !data) return <p>Carregando ...</p>;

  const { summary } = data.data;

  return (
    <div className="w-full space-y-6">
      <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Dashboard</h1>
        </div>
      </header>
      <main className="flex-1 space-y-4 mb-2">
        <SummaryCards
          totalClients={summary.totalClients}
          newClientsThisMonth={summary.newClientsThisMonth}
          statusCounts={summary.statusCounts}
          percentChange={summary.percentChange}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TopStatesChart statesCounts={summary.statesCounts} />
          <StatusChart
            statusCounts={summary.statusCounts}
            totalClientes={summary.totalClients}
          />
        </div>
      </main>
    </div>
  );
}
