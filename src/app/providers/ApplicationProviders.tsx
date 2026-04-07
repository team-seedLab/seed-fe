import { HelmetProvider } from "react-helmet-async";

import { Toaster } from "@/shared";

import { AuthProvider, QueryProvider, ThemeProvider } from "./components";

type Props = {
  children: React.ReactNode;
};

export const ApplicationProviders = ({ children }: Props) => {
  return (
    <HelmetProvider>
      <QueryProvider>
        <AuthProvider>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </QueryProvider>
    </HelmetProvider>
  );
};
