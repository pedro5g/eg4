import {
  BuildingIcon,
  CheckCircle2Icon,
  CircleOffIcon,
  PauseCircleIcon,
  TrendingUpIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Status } from "@/api/types";

interface SummaryCardsProps {
  totalClients: number;
  statusCounts: Record<Status, number>;
  newClientsThisMonth: number;
  percentChange: number;
}

export const SummaryCards = ({
  totalClients,
  statusCounts,
  newClientsThisMonth,
  percentChange,
}: SummaryCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
        <CardHeader className="pb-2">
          <CardDescription>Total de Clientes</CardDescription>
          <CardTitle className="text-2xl font-bold">{totalClients}</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center">
            <BuildingIcon className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-sm text-muted-foreground">
              Todos os clientes registrados
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center text-sm text-blue-600">
            <TrendingUpIcon className="h-4 w-4 mr-1" />
            <span>{percentChange}% crescimento neste mês</span>
          </div>
        </CardFooter>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
        <CardHeader className="pb-2">
          <CardDescription>Clientes Ativos</CardDescription>
          <CardTitle className="text-2xl font-bold">
            {statusCounts.ACTIVE}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center">
            <CheckCircle2Icon className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-muted-foreground">
              Clientes ativos atualmente
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            {((statusCounts.ACTIVE / totalClients) * 100).toFixed(1)}% do total
          </div>
        </CardFooter>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
        <CardHeader className="pb-2">
          <CardDescription>Clientes inativos</CardDescription>
          <CardTitle className="text-2xl font-bold">
            {statusCounts.INACTIVE}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center">
            <PauseCircleIcon className="h-4 w-4 text-amber-500 mr-1" />
            <span className="text-sm text-muted-foreground">
              Temporariamente inativo
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            {((statusCounts.INACTIVE / totalClients) * 100).toFixed(1)}% do
            total
          </div>
        </CardFooter>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
        <CardHeader className="pb-2">
          <CardDescription>Novidades deste mês</CardDescription>
          <CardTitle className="text-2xl font-bold">
            {newClientsThisMonth}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center">
            <CircleOffIcon className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-sm text-muted-foreground">
              Clientes adicionados recentemente
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-blue-600">
            {newClientsThisMonth > 0
              ? `+${newClientsThisMonth} from last month`
              : "No change from last month"}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
