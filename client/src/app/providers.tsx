"use client";

import { useEffect } from "react";
import StoreProvider from "@/state/redux";
import { Authenticator } from "@aws-amplify/ui-react";
import Auth from "./(auth)/authProvider";

/**
 * Dev-only diagnostics for unhandled promise rejections.
 *
 * The Next.js dev overlay renders a rejection with `String(reason)`. When
 * something rejects with a plain object instead of an Error, that prints as the
 * useless "[object Object]" with a call stack containing only Next internals.
 * This logs the real reason so the culprit is identifiable.
 */
const useRejectionDiagnostics = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;

      /* eslint-disable no-console */
      console.error(
        "%c[unhandledrejection]",
        "background:#b91c1c;color:#fff;padding:2px 6px;border-radius:3px",
        {
          type: Object.prototype.toString.call(reason),
          isError: reason instanceof Error,
          keys:
            reason && typeof reason === "object" ? Object.keys(reason) : null,
          reason,
        }
      );

      try {
        console.error(
          "[unhandledrejection] serialized:",
          JSON.stringify(reason, null, 2)
        );
      } catch {
        console.error("[unhandledrejection] reason is not JSON-serializable");
      }
      /* eslint-enable no-console */
    };

    window.addEventListener("unhandledrejection", onRejection);
    return () => window.removeEventListener("unhandledrejection", onRejection);
  }, []);
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  useRejectionDiagnostics();

  return (
    <StoreProvider>
      <Authenticator.Provider>
        <Auth>{children}</Auth>
      </Authenticator.Provider>
    </StoreProvider>
  );
};

export default Providers;
