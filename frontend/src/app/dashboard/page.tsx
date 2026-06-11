"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import keycloak from "@/services/keycloak";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState("");
  const [error, setError] = useState("");
  const [username, setUsername] = useState<string>(
    keycloak.tokenParsed?.preferred_username ?? "User",
  );
  const [authChecked, setAuthChecked] = useState(false);
  //route protection
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const authenticated = await keycloak.init({
  //       onLoad: "check-sso",
  //       pkceMethod: "S256",
  //     });

  //     if (!authenticated) {
  //       router.push("/login");
  //     }
  //   };

  //   checkAuth();
  // }, [router]);
  useEffect(() => {
    if (!keycloak.authenticated) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const init = async () => {
      // If already initialized (came from login page via router.push)
      if (keycloak.authenticated) {
        setAuthChecked(true);
        return;
      }

      // Fresh load — need to init (e.g. user typed URL directly)
      try {
        const authenticated = await keycloak.init({
          onLoad: "check-sso",
          pkceMethod: "S256",
          silentCheckSsoRedirectUri:
            window.location.origin + "/silent-check-sso.html",
        });

        if (!authenticated) {
          router.push("/login");
        } else {
          setAuthChecked(true);
        }
      } catch {
        if (keycloak.authenticated) {
          setAuthChecked(true);
        } else {
          router.push("/login");
        }
      }
    };

    init();
  }, [router]);

  const createSession = () => {
    const newSessionId = crypto.randomUUID().slice(0, 8);
    router.push(`/board/${newSessionId}`);
  };

  const joinSession = () => {
    if (!sessionId.trim()) {
      setError("Please enter a session ID.");
      return;
    }
    setError("");
    router.push(`/board/${sessionId.trim()}`);
  };

  const handleLogout = async () => {
    await keycloak.logout({
      redirectUri: "http://localhost:3000",
    });
  };

  if (!authChecked) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      {/* Navbar */}
      <nav
        className="bg-white sticky-top"
        style={{ borderBottom: "1px solid #E5E7EB", padding: "14px 0" }}
      >
        <div className="container d-flex align-items-center">
          <Link
            href="/"
            className="d-flex align-items-center gap-2 text-decoration-none"
          >
            <span
              style={{
                width: 28,
                height: 28,
                background: "#2563EB",
                borderRadius: 7,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              ✏️
            </span>
            <span style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>
              Sketchspace
            </span>
          </Link>
          <div className="ms-auto d-flex align-items-center gap-3">
            <span style={{ fontSize: 13, color: "#6B7280" }}>
              {" "}
              Hey, {username || "User"} 👋
            </span>
            <button
              onClick={handleLogout}
              style={{
                fontSize: 13,
                color: "#6B7280",
                background: "none",
                border: "1px solid #E5E7EB",
                borderRadius: 7,
                padding: "6px 14px",
                cursor: "pointer",
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-5" style={{ maxWidth: 780 }}>
        {/* Page header */}
        <div className="mb-5">
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#111827",
              marginBottom: 6,
              letterSpacing: "-0.01em",
            }}
          >
            Dashboard
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
            Start a new session or join an existing one.
          </p>
        </div>

        {/* Action cards */}
        <div className="row g-3">
          {/* Create */}
          <div className="col-12 col-md-6">
            <div
              className="bg-white h-100 p-4 rounded-3"
              style={{ border: "1px solid #E5E7EB" }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  background: "#EFF6FF",
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  marginBottom: 16,
                }}
              >
                🖊️
              </div>
              <h2
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#111827",
                  marginBottom: 6,
                }}
              >
                New whiteboard
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "#6B7280",
                  marginBottom: 20,
                  lineHeight: 1.6,
                }}
              >
                Start a fresh session and invite others to collaborate in real
                time.
              </p>
              <button
                onClick={createSession}
                className="text-white"
                style={{
                  background: "#2563EB",
                  border: "none",
                  borderRadius: 8,
                  padding: "9px 20px",
                  fontWeight: 500,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Create session
              </button>
            </div>
          </div>

          {/* Join */}
          <div className="col-12 col-md-6">
            <div
              className="bg-white h-100 p-4 rounded-3"
              style={{ border: "1px solid #E5E7EB" }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  background: "#EFF6FF",
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  marginBottom: 16,
                }}
              >
                🔗
              </div>
              <h2
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#111827",
                  marginBottom: 6,
                }}
              >
                Join a session
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "#6B7280",
                  marginBottom: 16,
                  lineHeight: 1.6,
                }}
              >
                Have a session ID? Enter it below to jump straight in.
              </p>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. a3f2b1c4"
                  value={sessionId}
                  onChange={(e) => {
                    setSessionId(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && joinSession()}
                  style={{
                    flex: 1,
                    fontSize: 13,
                    border: error ? "1px solid #EF4444" : "1px solid #E5E7EB",
                    borderRadius: 8,
                    padding: "9px 12px",
                    color: "#111827",
                    outline: "none",
                    background: "white",
                  }}
                />
                <button
                  onClick={joinSession}
                  style={{
                    background: "#2563EB",
                    border: "none",
                    borderRadius: 8,
                    padding: "9px 16px",
                    fontWeight: 500,
                    fontSize: 13,
                    color: "white",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Join
                </button>
              </div>
              {error && (
                <p
                  style={{
                    fontSize: 12,
                    color: "#EF4444",
                    marginTop: 6,
                    marginBottom: 0,
                  }}
                >
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
