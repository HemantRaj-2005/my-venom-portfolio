"use client";

import React, { Suspense } from "react";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <SessionProvider>{children}</SessionProvider>
    </Suspense>
  );
}
