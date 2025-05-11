import { ApiGetSummary } from "@/api/endpoints";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { useQuery } from "@tanstack/react-query";

export function Dashboard() {
  const { data, isLoading } = useQuery({
    queryFn: () => ApiGetSummary(),
    queryKey: ["summary"],
  });

  if (isLoading || !data) return <p>Carregando ...</p>;

  const { summary } = data.data;

  return (
    <div className="w-full">
      <SummaryCards
        totalClients={summary.totalClients}
        newClientsThisMonth={summary.newClientsThisMonth}
        statusCounts={summary.statusCounts}
        percentChange={summary.percentChange}
      />
    </div>
  );
}
