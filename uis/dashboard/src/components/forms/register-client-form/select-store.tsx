import * as React from "react";
import { Check, ChevronsUpDown, CircleAlert, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { RegisterStoreModel } from "@/components/modals/register-store-model";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { useGetStores } from "@/hooks/use-get-stores";

interface SelectStoreProps<T extends FieldValues> {
  name: Path<T>;
}

export const SelectStore = <T extends FieldValues>({
  name,
}: SelectStoreProps<T>) => {
  const [open, setOpen] = React.useState(false);
  const { control } = useFormContext<T>();
  const { data, isLoading } = useGetStores();

  const stores = data?.stores;

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, name, value, ref },
        fieldState: { invalid, error },
      }) => {
        return (
          <div className="w-full space-y-1">
            <Popover open={open} onOpenChange={setOpen}>
              <div className="relative">
                <PopoverTrigger
                  ref={ref}
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    `inline-flex justify-between px-3 pb-2.5 pt-3 w-full text-sm text-zinc-500 bg-transparent 
                    duration-300 transform rounded-sm border-2 border-zinc-500/40 appearance-none focus-visible:ring-0
                    data-[state=open]:border-blue-400 data-[state=open]:[&>label]:text-blue-400 disabled:opacity-100 
                    focus:border-blue-400 cursor-pointer dark:text-zinc-300 dark:border-zinc-100/40 dark:data-[state=open]:border-blue-400`,
                    invalid &&
                      "border-red-500 [&>svg]:stroke-red-500 dark:border-red-500"
                  )}>
                  {(stores || []).find((store) => store.code === value)?.name ||
                    "''"}
                  <ChevronsUpDown className="opacity-50" />

                  <label
                    data-error={invalid}
                    className={cn(
                      `absolute text-base text-zinc-500 duration-300 transform dark:bg-background 
                    scale-100 z-10 origin-[0] bg-white px-2 -translate-y-1/2 top-1/2 start-2`,
                      value && "-translate-y-3 top-0 scale-75"
                    )}>
                    Selecione uma Loja*
                  </label>
                </PopoverTrigger>
              </div>

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
                        {(stores || []).map((store) => (
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
