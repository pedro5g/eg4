import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import {
  BuildingIcon,
  CheckCircle2Icon,
  CircleOffIcon,
  GripVerticalIcon,
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
import React, { useId, useMemo, useState } from "react";

const _ids = [
  "2107bce9-001c-4bde-992e-72a30b636168",
  "0546a566-805f-4f52-8806-253156fac243",
  "b0e70dab-8427-4dfd-866b-30820e7a25e6",
  "65ef417a-444d-42fa-8689-dbb23af01d7f",
];

function DraggableCard({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string | number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      data-dragging={isDragging}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80">
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 cursor-grab aria-pressed:cursor-grabbing">
        <GripVerticalIcon className="size-4 text-muted-foreground" />
      </div>
      {children}
    </div>
  );
}

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
  const [items, setItems] = useState<UniqueIdentifier[]>(_ids);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((currentItems) => {
        const oldIndex = currentItems.indexOf(active.id);
        const newIndex = currentItems.indexOf(over.id);

        return arrayMove(currentItems, oldIndex, newIndex);
      });
    }
  }

  const cardData = useMemo(() => {
    return [
      {
        id: _ids[0],
        content: (
          <Card className="h-full bg-gradient-to-br from-blue-50 dark:from-blue-800 dark:to-slate-800 border-blue-100 dark:border-blue-900">
            <CardHeader className="pb-2">
              <CardDescription className="dark:text-zinc-200">
                Total de Clientes
              </CardDescription>
              <CardTitle className="text-2xl font-bold">
                {totalClients}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center">
                <BuildingIcon className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-muted-foreground dark:text-zinc-200">
                  Todos os clientes registrados
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center text-sm text-blue-600 dark:text-zinc-200">
                <TrendingUpIcon className="h-4 w-4 mr-1" />
                <span>{percentChange.toFixed(2)}% crescimento neste mês</span>
              </div>
            </CardFooter>
          </Card>
        ),
      },
      {
        id: _ids[1],
        content: (
          <Card className="h-full bg-gradient-to-br from-green-50 dark:from-emerald-700 dark:to-green-900 to-white border-green-100 dark:border-green-900">
            <CardHeader className="pb-2">
              <CardDescription className="dark:text-zinc-200">
                Clientes Ativos
              </CardDescription>
              <CardTitle className="text-2xl font-bold">
                {statusCounts.ACTIVE}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center">
                <CheckCircle2Icon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-muted-foreground dark:text-zinc-200">
                  Clientes ativos atualmente
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground dark:text-zinc-200">
                {((statusCounts.ACTIVE / totalClients) * 100).toFixed(1)}% do
                total
              </div>
            </CardFooter>
          </Card>
        ),
      },
      {
        id: _ids[2],
        content: (
          <Card className="h-full bg-gradient-to-br from-amber-50 dark:from-yellow-600 dark:to-amber-900 to-white border-amber-100 dark:border-amber-800">
            <CardHeader className="pb-2">
              <CardDescription className="dark:text-zinc-200">
                Clientes inativos
              </CardDescription>
              <CardTitle className="text-2xl font-bold ">
                {statusCounts.INACTIVE}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center">
                <PauseCircleIcon className="h-4 w-4 text-amber-500 mr-1" />
                <span className="text-sm text-muted-foreground dark:text-zinc-200">
                  Temporariamente inativo
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground dark:text-zinc-200">
                {((statusCounts.INACTIVE / totalClients) * 100).toFixed(1)}% do
                total
              </div>
            </CardFooter>
          </Card>
        ),
      },
      {
        id: _ids[3],
        content: (
          <Card className="h-full bg-gradient-to-br from-blue-50 dark:from-sky-600 to-white dark:to-blue-950 border-blue-100 dark:border-blue-950">
            <CardHeader className="pb-2">
              <CardDescription className="dark:text-zinc-200">
                Novidades deste mês
              </CardDescription>
              <CardTitle className="text-2xl font-bold">
                {newClientsThisMonth}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center">
                <CircleOffIcon className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-muted-foreground dark:text-zinc-200">
                  Clientes recentes
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-blue-600 dark:text-zinc-200">
                {newClientsThisMonth > 0
                  ? `+${newClientsThisMonth} do mês passado`
                  : "Nenhuma alteração em relação ao mês passado"}
              </div>
            </CardFooter>
          </Card>
        ),
      },
    ];
  }, [totalClients, statusCounts, newClientsThisMonth, percentChange]);

  const cardMap = Object.fromEntries(cardData.map((card) => [card.id, card]));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      id={useId()}>
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="grid gap-4 md:grid-cols-2 grid-rows-1 lg:grid-cols-4">
          {items.map((id) => (
            <DraggableCard key={id} id={id}>
              {cardMap[id].content}
            </DraggableCard>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
