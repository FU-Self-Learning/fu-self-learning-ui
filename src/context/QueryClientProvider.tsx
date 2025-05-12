"use client"

import {
  QueryClient,
  QueryClientProvider as QueryClientProviderTanstack,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

interface QueryClientProviderProps {
  children: React.ReactNode;
}

const QueryClientProvider: React.FC<QueryClientProviderProps> = ({
  children,
}) => {
  return (
    <QueryClientProviderTanstack client={queryClient}>
      {children}
    </QueryClientProviderTanstack>
  );
};

export default QueryClientProvider;
