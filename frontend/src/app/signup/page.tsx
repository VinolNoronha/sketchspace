"use client";

import Link from "next/link";

export default function SignupPage() {
  const handleSignup = () => {
    window.location.href = `http://localhost:8080/realms/whiteboard-realm/protocol/openid-connect/registrations?client_id=whiteboard-client&response_type=code&redirect_uri=http://localhost:3000/login`;
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
            <h2 className="fw-bold mb-2">Create Account</h2>
            <p className="text-secondary mb-0">
              Start collaborating in real-time.
            </p>
          </div>

          <button
            onClick={handleSignup}
            className="btn w-100 text-white fw-medium"
            style={{
              background: "#2563EB",
              border: "none",
              height: "46px",
              borderRadius: "8px",
            }}
          >
            Continue with Keycloak
          </button>

          <p className="text-center mt-4 mb-0 text-secondary">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-decoration-none fw-semibold"
              style={{ color: "#2563EB" }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
