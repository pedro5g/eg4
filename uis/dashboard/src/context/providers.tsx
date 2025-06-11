import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react";
import { HelmetProvider } from "react-helmet-async";
import { useState } from "react";
import { ThemeProvider } from "./theme-provider";

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
            staleTime: 1000 * 60 * 5,
            refetchOnMount: false,
            refetchOnReconnect: false,
          },
        },
      })
  );

  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <QueryClientProvider client={client}>
          <NuqsAdapter>
            {children}
            <Toaster richColors />
          </NuqsAdapter>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};
