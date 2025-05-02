import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";

const status = ["ACTIVE", "INACTIVE", "BLOCKED", "PENDING"] as const;
type Status = (typeof status)[number];
export const useTableClientsQuery = () => {
  const [tableClientsQuery, setTableClientsQuery] = useQueryStates({
    q: parseAsString.withOptions({ clearOnDefault: true }),
    s: parseAsArrayOf(
      parseAsStringLiteral(status).withOptions({ clearOnDefault: true })
    ),
  });

  const [pagination, setPagination] = useQueryStates({
    pageIndex: parseAsInteger.withDefault(0),
    pageSize: parseAsInteger.withDefault(10),
  });

  const setStatus = (s: Status[]) => {
    setTableClientsQuery((prev) => {
      return { ...prev, s: s.length ? s : null };
    });
  };

  const setQuery = (q: string | null) => {
    setTableClientsQuery((prev) => {
      return { ...prev, q };
    });
  };

  return {
    setStatus,
    setQuery,
    setPagination,
    pagination,
    q: tableClientsQuery.q || undefined,
    s: tableClientsQuery.s || undefined,
  };
};
