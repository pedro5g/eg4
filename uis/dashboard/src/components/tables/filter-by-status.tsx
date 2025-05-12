import { useState } from "react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Check, PlusCircle } from "lucide-react";
import { Separator } from "../ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { useTableClientsQuery } from "@/hooks/use-table-clients-query";
import { Status } from "@/api/types";
import { STATUS_OPTIONS } from "@/constants/status-options";

export const FilterByStatus = () => {
  const { s, setStatus } = useTableClientsQuery();
  const selectedValueSet = new Set(s);

  const [open, setOpen] = useState(false);

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 py-5 border-2 border-zinc-400 rounded-sm text-muted-foreground w-full lg:w-auto max-lg:justify-start 
           data-[state=open]:border-blue-300 ">
          <PlusCircle />
          Filtrar por status
          {selectedValueSet.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-0 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden">
                {selectedValueSet.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValueSet.size > 3 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal">
                    {selectedValueSet.size}
                  </Badge>
                ) : (
                  STATUS_OPTIONS.filter((option) =>
                    selectedValueSet.has(option.value as Status)
                  ).map((option) => (
                    <Badge
                      variant="secondary"
                      key={option.value}
                      className="rounded-sm px-1 font-normal">
                      {option.title}
                    </Badge>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Filtrar por status" />
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado</CommandEmpty>
            <CommandGroup>
              {STATUS_OPTIONS.map((option) => {
                const isSelected = selectedValueSet.has(option.value as Status);
                return (
                  <CommandItem
                    className="cursor-pointer"
                    key={option.value}
                    onSelect={() => {
                      const updatedValues = isSelected
                        ? (s || []).filter((val) => val !== option.value)
                        : [...(s || []), option.value];
                      setStatus(updatedValues as Status[]);
                    }}>
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-blue-400 border-blue-400"
                          : "opacity-50 [&_svg]:invisible"
                      )}>
                      <Check className=" text-zinc-50" />
                    </div>

                    <span>{option.title}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValueSet.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup className="sticky bottom-0 align-bottom bg-white">
                  <CommandItem
                    onSelect={() => setStatus([])}
                    className="justify-center text-center">
                    Remover filtros
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
