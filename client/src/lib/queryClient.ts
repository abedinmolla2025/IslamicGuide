import {
  QueryClient,
  DefaultOptions,
} from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function apiRequest<T>(
  method: string,
  url: string,
  data?: unknown
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

const defaultOptions: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
  },
};

export const queryClient = new QueryClient({ defaultOptions });
