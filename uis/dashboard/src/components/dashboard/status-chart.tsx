import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Status } from "@/api/types";
import { STATUS_MAP } from "@/constants";

const chartConfig = {
  ACTIVE: {
    label: "Ativos",
    color: "hsl(var(--color-green-500))",
  },
  INACTIVE: {
    label: "Inativos",
    color: "hsl(var(--color-blue-500))",
  },
  BLOCKED: {
    label: "Bloqueados",
    color: "hsl(var(--color-red-500))",
  },
  PENDING: {
    label: "Pendentes",
    color: "hsl(var(--color-muted-foreground))",
  },
} satisfies ChartConfig;

const FILL_COLOR_MAP = {
  ACTIVE: "var(--color-green-400)",
  INACTIVE: "var(--color-blue-400)",
  BLOCKED: "var(--color-red-400)",
  PENDING: "var(--color-muted-foreground)",
};

interface StatusChartProps {
  statusCounts: Record<Status, number>;
  totalClientes: number;
}

export const StatusChart = ({
  statusCounts,
  totalClientes,
}: StatusChartProps) => {
  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    fill: FILL_COLOR_MAP[status as Status],
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Status do cliente</CardTitle>
        <CardDescription>Distribuição por status</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto max-h-[300px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={86}
              innerRadius={64}
              strokeWidth={2}
              label={({ payload, ...props }) => {
                const RADIAN = Math.PI / 180;
                const radius =
                  22 +
                  props.innerRadius +
                  (props.outerRadius - props.innerRadius);
                const x =
                  props.cx + radius * Math.cos(-props.midAngle * RADIAN);
                const y =
                  props.cy + radius * Math.sin(-props.midAngle * RADIAN);

                return (
                  <text
                    x={x}
                    y={y}
                    className="fill-muted-foreground text-xs"
                    textAnchor={x > props.cx ? "start" : "end"}
                    dominantBaseline="central">
                    {STATUS_MAP[payload.status].concat("s")} ({payload.count})
                  </text>
                );
              }}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle">
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold">
                          {totalClientes}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground">
                          Total de clientes
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
