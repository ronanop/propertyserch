"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { AppShell } from "@/components/app-shell";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
