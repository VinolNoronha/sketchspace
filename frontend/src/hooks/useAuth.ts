"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import keycloak from "@/services/keycloak";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const authenticated = await keycloak.init({
        onLoad: "check-sso",
        pkceMethod: "S256",
      });

      if (!authenticated) {
        router.replace("/login");
        return;
      }

      setLoading(false);
    };

    initAuth();
  }, [router]);

  return { loading, keycloak };
}
