"use client";

import Link from "next/link";

interface NavbarProps {
  sessionId: string;
  isConnected: boolean;
}

export default function Navbar({ sessionId, isConnected }: NavbarProps) {
  return (
    <nav
      className="d-flex align-items-center justify-content-between px-4"
      style={{
        height: "64px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #E5E7EB",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}
    >
      {/* Left — brand */}
      <div className="d-flex align-items-center gap-3">
        <span
          style={{
            fontWeight: 700,
            fontSize: "16px",
            color: "#111827",
            letterSpacing: "-0.3px",
          }}
        >
          Whiteboard
        </span>
        <span
          style={{
            fontSize: "13px",
            color: "#6B7280",
            fontFamily: "monospace",
          }}
        >
          #{sessionId.slice(0, 8)}
        </span>
      </div>

      {/* Right — status + leave */}
      <div className="d-flex align-items-center gap-3">
        {/* Live indicator */}
        <div className="d-flex align-items-center gap-2">
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: isConnected ? "#22C55E" : "#EF4444",
              display: "inline-block",
            }}
          />
          <span style={{ fontSize: "13px", color: "#6B7280" }}>
            {isConnected ? "Live" : "Reconnecting..."}
          </span>
        </div>

        <Link
          href="/dashboard"
          className="btn btn-sm"
          style={{
            border: "1px solid #E5E7EB",
            color: "#374151",
            fontSize: "13px",
            borderRadius: "8px",
            padding: "5px 14px",
            backgroundColor: "#ffffff",
            textDecoration: "none",
          }}
        >
          Leave
        </Link>
      </div>
    </nav>
  );
}
