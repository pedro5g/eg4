import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  quantity: {
    label: "Quantidade",
    color: "hsl(var(--color-blue-600))",
  },
} satisfies ChartConfig;

interface TopStatesChartProps {
  statesCounts: Record<string, number>;
}

export const TopStatesChart = ({ statesCounts }: TopStatesChartProps) => {
  const chartData = Object.entries(statesCounts).map(([state, quantity]) => {
    return { state, quantity };
  });

  const biggestResult = chartData.reduce((acc, curr) => {
    if (acc.quantity < curr.quantity) {
      return (acc = curr);
    }
    return acc;
  }, chartData[0]);

  const totalOthers = chartData.reduce((sum, s) => {
    if (s.state !== biggestResult.state) {
      return sum + s.quantity;
    }
    return sum + 0;
  }, 0);

  const avgOthers = totalOthers / chartData.length - 1;

  const growthRate = ((biggestResult.quantity - avgOthers) / avgOthers) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estados com mais clientes</CardTitle>
        <CardDescription>
          estados onde temos mais clientes registrados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="quantity" hide />
            <YAxis
              dataKey="state"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />

            <Bar dataKey="quantity" fill="var(--color-blue-500)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Em {biggestResult.state} temos {growthRate.toFixed(2)}% mais clientes
          do quem em relação a mádia de outros estados
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Nossos 6 melhores estados compradores
        </div>
      </CardFooter>
    </Card>
  );
};
