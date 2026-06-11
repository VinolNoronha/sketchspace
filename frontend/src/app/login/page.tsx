"use client";
import Link from "next/link";
import keycloak from "@/services/keycloak";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  // useEffect(() => {
  //   const init = async () => {
  //     const authenticated = await keycloak.init({
  //       onLoad: "check-sso",
  //       pkceMethod: "S256",
  //     });

  //     console.log("authenticated:", authenticated);

  //     if (authenticated) {
  //       window.location.href = "/dashboard";
  //     }
  //   };

  //   init();
  // }, []);
  useEffect(() => {
    const init = async () => {
      try {
        const authenticated = await keycloak.init({
          onLoad: "check-sso",
          pkceMethod: "S256",
          silentCheckSsoRedirectUri:
            window.location.origin + "/silent-check-sso.html",
        });

        if (authenticated) {
          router.push("/dashboard");
        }
      } catch (e) {
        // already initialized — check if authenticated
        if (keycloak.authenticated) {
          window.location.href = "/dashboard";
        }
      }
    };

    init();
  }, []);

  const handleLogin = async () => {
    await keycloak.login({
      redirectUri: "http://localhost:3000/login",
    });
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", background: "#F8FAFC" }}
    >
      <div
        className="card border-0 shadow-sm"
        style={{ width: "100%", maxWidth: "420px", borderRadius: "16px" }}
      >
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div
              className="mx-auto mb-3 d-flex align-items-center justify-content-center"
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "#2563EB",
                color: "white",
                fontSize: "18px",
              }}
            >
              ✏️
            </div>
            <h2 className="fw-bold mb-2">Sign In</h2>
            <p className="text-secondary mb-0">
              Access your collaborative workspace.
            </p>
          </div>

          <button
            type="button"
            className="btn w-100 text-white fw-medium"
            style={{
              background: "#2563EB",
              border: "none",
              height: "46px",
              borderRadius: "8px",
            }}
            onClick={handleLogin}
          >
            Continue with Keycloak
          </button>

          <p className="text-center mt-4 mb-0 text-secondary">
            Don4 t have an account?{" "}
            <Link
              href="/signup"
              className="text-decoration-none fw-semibold"
              style={{ color: "#2563EB" }}
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
