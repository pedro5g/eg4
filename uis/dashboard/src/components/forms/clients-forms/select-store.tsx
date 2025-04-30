"use client";

import * as React from "react";
import { Check, ChevronsUpDown, CircleAlert, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { ApiListStores } from "@/api/endpoints";
import { RegisterStoreModel } from "@/components/modals/register-store-model";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

interface SelectStoreProps<T extends FieldValues> {
  name: Path<T>;
}

export const SelectStore = <T extends FieldValues>({
  name,
}: SelectStoreProps<T>) => {
  const [open, setOpen] = React.useState(false);
  const { control } = useFormContext<T>();
  const { data, isLoading } = useQuery({
    queryFn: ApiListStores,
    queryKey: ["store-list"],
    initialData: {
      stores: [],
    },
  });

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, name, value },
        fieldState: { invalid, error },
      }) => {
        return (
          <div className="w-full space-y-1">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full shadow-none justify-between text-zinc-500 border-2 border-zinc-500/40 rounded-md px-3 pb-2.5 pt-4 h-auto cursor-pointer",
                    invalid && "border-red-500 [&>svg]:stroke-red-500"
                  )}>
                  {value
                    ? data.stores.find((store) => store.code === value)?.name
                    : "Selecione uma Loja*"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-full p-0">
                <Command>
                  <CommandInput
                    name={name}
                    placeholder="Pesquise por uma loja"
                    className="h-9"
                  />
                  <RegisterStoreModel />
                  <CommandList>
                    <CommandSeparator />
                    <CommandEmpty>Nenhuma loja encontrada</CommandEmpty>
                    {isLoading ? (
                      <div className="w-full">
                        <Loader2
                          className="text-zinc-400 animate-spin"
                          size={16}
                        />
                      </div>
                    ) : (
                      <CommandGroup>
                        {data.stores.map((store) => (
                          <CommandItem
                            key={store.code}
                            className="flex flex-col items-start cursor-pointer h-11"
                            value={store.code}
                            onSelect={(currentValue) => {
                              onChange(
                                currentValue === value ? "" : currentValue
                              );
                              setOpen(false);
                            }}>
                            {store.name}
                            {store.address && (
                              <span className="text-xs text-zinc-600 leading-0 capitalize">
                                {store.address}
                              </span>
                            )}
                            <Check
                              className={cn(
                                "ml-auto",
                                value === store.name
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {invalid && error?.message && (
              <p className="text-sm text-red-500 font-normal inline-flex items-center gap-1">
                <CircleAlert size={20} />
                <span className="max-w-full truncate">{error.message}</span>
              </p>
            )}
          </div>
        );
      }}
    />
  );
};
