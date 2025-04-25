import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react";
import { HelmetProvider } from "react-helmet-async";
import { useState } from "react";

export const Providers = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              if (failureCount < 2 && error?.message === "Network Error") {
                return true;
              }
              return false;
            },
            retryDelay: 0,
          },
        },
      })
  );

  return (
    <HelmetProvider>
      <QueryClientProvider client={client}>
        <NuqsAdapter>
          {children}
          <Toaster />
        </NuqsAdapter>
      </QueryClientProvider>
    </HelmetProvider>
  );
};
