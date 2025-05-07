import { useDebounceCallback } from "@/hooks/use-debounce";
import { useTableClientsQuery } from "@/hooks/use-table-clients-query";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

export const SearchClient = () => {
  const { q, setQuery, setPagination } = useTableClientsQuery();

  const onChange = useDebounceCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      if (!value) {
        setPagination({});
        setQuery(null);
      } else {
        setPagination({});
        setQuery(value);
      }
    },
    800
  );

  return (
    <div className="focus-within:[&>svg]:text-blue-300 relative max-w-1/5 w-full">
      <Input
        onChange={onChange}
        defaultValue={q}
        className="border-zinc-400 transition-all border-2 focus-visible:border-blue-300 focus-visible:ring-0
       selection:bg-blue-200 selection:text-zinc-800"
        placeholder="Pesquisar por clientes..."
      />
      <Search
        className="absolute top-1/2 -translate-y-1/2 right-4 text-zinc-400"
        size={16}
      />
    </div>
  );
};
