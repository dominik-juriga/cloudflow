"use client";
import React from "react";
import { NodeStoreProvider } from "./NodeStoreProvider";
import { QueryClient, QueryClientContext } from "@tanstack/react-query";

const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientContext.Provider value={queryClient}>
      <NodeStoreProvider>{children}</NodeStoreProvider>
    </QueryClientContext.Provider>
  );
};

export default ClientProviders;
