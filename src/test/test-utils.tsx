import type { ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router";

import { ChakraProvider } from "@chakra-ui/react";
import {
  QueryClient,
  type QueryClientConfig,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  type RenderHookOptions,
  type RenderHookResult,
  type RenderOptions,
  render,
  renderHook,
} from "@testing-library/react";

import { AuthContext, type AuthContextType } from "@/entities";
import { system } from "@/shared";

type ProviderOptions = {
  authValue?: Partial<AuthContextType>;
  initialEntries?: string[];
  queryClient?: QueryClient;
  queryClientConfig?: QueryClientConfig;
};

const defaultAuthValue: AuthContextType = {
  isAuthenticated: false,
  isLoading: false,
  login: () => Promise.resolve(),
  logout: () => undefined,
  checkAuth: () => undefined,
};

export const createTestQueryClient = (config?: QueryClientConfig) => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 0,
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
    ...config,
  });
};

export const createTestWrapper = ({
  authValue,
  initialEntries = ["/"],
  queryClient,
  queryClientConfig,
}: ProviderOptions = {}) => {
  const client = queryClient ?? createTestQueryClient(queryClientConfig);
  const mergedAuthValue = {
    ...defaultAuthValue,
    ...authValue,
  };

  return ({ children }: { children: ReactNode }) => {
    return (
      <HelmetProvider>
        <QueryClientProvider client={client}>
          <AuthContext value={mergedAuthValue}>
            <ChakraProvider value={system}>
              <MemoryRouter initialEntries={initialEntries}>
                {children}
              </MemoryRouter>
            </ChakraProvider>
          </AuthContext>
        </QueryClientProvider>
      </HelmetProvider>
    );
  };
};

type ExtendedRenderOptions = Omit<RenderOptions, "wrapper"> & ProviderOptions;

export const renderWithProviders = (
  ui: ReactNode,
  {
    authValue,
    initialEntries,
    queryClient,
    queryClientConfig,
    ...options
  }: ExtendedRenderOptions = {},
) => {
  return render(ui, {
    wrapper: createTestWrapper({
      authValue,
      initialEntries,
      queryClient,
      queryClientConfig,
    }),
    ...options,
  });
};

type ExtendedRenderHookOptions<Props> = Omit<
  RenderHookOptions<Props>,
  "wrapper"
> &
  ProviderOptions;

export const renderHookWithProviders = <Result, Props>(
  renderCallback: (initialProps: Props) => Result,
  {
    authValue,
    initialEntries,
    queryClient,
    queryClientConfig,
    ...options
  }: ExtendedRenderHookOptions<Props> = {},
): RenderHookResult<Result, Props> => {
  return renderHook(renderCallback, {
    wrapper: createTestWrapper({
      authValue,
      initialEntries,
      queryClient,
      queryClientConfig,
    }),
    ...options,
  });
};
