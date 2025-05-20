import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn, getInitials } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { CircleAlert, Loader2, SearchIcon, UserIcon } from "lucide-react";
import { Dispatch, useEffect, useState } from "react";
import { Client } from "@/api/types";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ApiClientsCursorPagination } from "@/api/endpoints";
import { CommandLoading } from "cmdk";
import { useDebounceCallback } from "@/hooks/use-debounce";

interface SelectClientProps<T extends FieldValues> {
  name: Path<T>;
  selectedClient: Client | null;
  setSelectedClient: Dispatch<React.SetStateAction<Client | null>>;
}

export const SelectClient = <T extends FieldValues>({
  name,
  selectedClient,
  setSelectedClient,
}: SelectClientProps<T>) => {
  const [clientSearchOpen, setClientSearchOpen] = useState(false);
  const [clientName, setClientName] = useState("");

  const { control } = useFormContext<T>();

  const { ref, inView } = useInView();

  const { data, isLoading, hasNextPage, fetchNextPage, isSuccess } =
    useInfiniteQuery({
      queryFn: ({ pageParam }) =>
        ApiClientsCursorPagination({
          take: 10,
          lastCursor: pageParam === "" && clientName ? "" : pageParam,
          name: clientName,
        }),
      queryKey: ["clients", clientName],
      getNextPageParam: ({ meta: { lastCursor } }) => {
        return lastCursor ? lastCursor : "";
      },
      initialPageParam: "",
    });

  const handlerClientName = useDebounceCallback((value: string) => {
    setClientName(value);
  }, 300);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, value, name, ref: formRef },
        fieldState: { invalid, error },
      }) => {
        return (
          <div className="space-y-1">
            <Popover open={clientSearchOpen} onOpenChange={setClientSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  ref={formRef}
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full h-auto text-zinc-500 justify-between px-3 py-3 rounded-sm focus-visible:border-blue-400 focus-visible:ring-0 border-2 border-zinc-500/40 hover:text-zinc-500 cursor-pointer",
                    !value && "text-muted-foreground",
                    invalid && "border-red-500 [&>div>svg]:stroke-red-500"
                  )}>
                  {value ? (
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-blue-500" />
                      {selectedClient?.name}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <SearchIcon className="h-4 w-4 text-zinc-500" />
                      <span>Pesquisar por cliente</span>
                    </div>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    name={name}
                    defaultValue={clientName}
                    onValueChange={(search) => handlerClientName(search)}
                    placeholder="Pesquisar cliente..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>Nenhum cliente encontrado</CommandEmpty>
                    <CommandGroup>
                      {isSuccess &&
                        data.pages.map((page) =>
                          page?.clients.map((client, index) => {
                            if (page.clients.length === index + 1) {
                              return (
                                <CommandItem
                                  ref={ref}
                                  key={client.id}
                                  value={client.id}
                                  onSelect={() => {
                                    onChange(client.id);
                                    setSelectedClient(client);
                                    setClientSearchOpen(false);
                                  }}
                                  className="flex items-center gap-2 py-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-blue-100 text-blue-700">
                                      {getInitials(client.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col max-w-[120px]">
                                    <span className="font-medium">
                                      {client.name}
                                    </span>
                                    {client.email && (
                                      <span className="text-xs text-muted-foreground truncate ">
                                        {client.email}
                                      </span>
                                    )}
                                  </div>
                                  {client.type && (
                                    <Badge
                                      variant="outline"
                                      className="ml-auto">
                                      {
                                        {
                                          J: "Pessoa Jurídica",
                                          F: "Pessoa Física",
                                        }[client.type as string]
                                      }
                                    </Badge>
                                  )}
                                </CommandItem>
                              );
                            } else {
                              return (
                                <>
                                  <CommandItem
                                    key={client.id}
                                    value={client.id}
                                    onSelect={() => {
                                      onChange(client.id);
                                      setSelectedClient(client);
                                      setClientSearchOpen(false);
                                    }}
                                    className="flex items-center gap-2 py-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="bg-blue-100 text-blue-700">
                                        {getInitials(client.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col max-w-[120px]">
                                      <span className="font-medium">
                                        {client.name}
                                      </span>
                                      {client.email && (
                                        <span className="text-xs text-muted-foreground truncate">
                                          {client.email}
                                        </span>
                                      )}
                                    </div>
                                    {client.type && (
                                      <Badge
                                        variant="outline"
                                        className="ml-auto">
                                        {
                                          {
                                            J: "Pessoa Jurídica",
                                            F: "Pessoa Física",
                                          }[client.type as string]
                                        }
                                      </Badge>
                                    )}
                                  </CommandItem>
                                  {index === page.clients.length - 1 && (
                                    <CommandLoading>
                                      <div className="w-full flex items-center justify-center py-5">
                                        <Loader2 className="size-4 animate-spin text-zinc-600" />
                                      </div>
                                    </CommandLoading>
                                  )}
                                </>
                              );
                            }
                          })
                        )}
                    </CommandGroup>
                    {isLoading && (
                      <CommandLoading>
                        <div className="w-full flex items-center justify-center py-5">
                          <Loader2 className="size-4 animate-spin text-zinc-600" />
                        </div>
                      </CommandLoading>
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
