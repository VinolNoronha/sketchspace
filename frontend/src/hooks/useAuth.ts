"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import keycloak, { initKeycloak } from "@/services/keycloak";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      console.log(
        "useAuth: before init, keycloak.authenticated =",
        keycloak.authenticated,
      );
      const authenticated = await initKeycloak();
      console.log("useAuth: after init, authenticated =", authenticated);
      if (!authenticated) {
        router.replace("/login");
        return;
      }
      setLoading(false);
    };

    check();
  }, [router]);

  return { loading, keycloak };
}

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import keycloak from "@/services/keycloak";

// export function useAuth() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const initAuth = async () => {
//       const authenticated = await keycloak.init({
//         onLoad: "check-sso",
//         pkceMethod: "S256",
//       });

//       if (!authenticated) {
//         router.replace("/login");
//         return;
//       }

//       setLoading(false);
//     };

//     initAuth();
//   }, [router]);

//   return { loading, keycloak };
// }
