"use client";

interface RemoteCursor {
  x: number;
  y: number;
  name: string;
  color: string;
}

interface CursorLayerProps {
  cursors: Record<string, RemoteCursor>;
}

// Each user gets a deterministic color from their userId
export function getUserColor(userId: string): string {
  const colors = [
    "#2563EB",
    "#7C3AED",
    "#DB2777",
    "#D97706",
    "#059669",
    "#DC2626",
    "#0891B2",
    "#65A30D",
  ];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function CursorLayer({ cursors }: CursorLayerProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none", // never blocks drawing
        zIndex: 10,
      }}
    >
      {Object.entries(cursors).map(([userId, cursor]) => (
        <div
          key={userId}
          style={{
            position: "absolute",
            left: cursor.x,
            top: cursor.y,
            transform: "translate(-2px, -2px)",
            pointerEvents: "none",
          }}
        >
          {/* Cursor dot */}
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: cursor.color,
              border: "2px solid #ffffff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
            }}
          />
          {/* Name label */}
          <div
            style={{
              marginTop: "4px",
              backgroundColor: cursor.color,
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: 500,
              padding: "2px 7px",
              borderRadius: "6px",
              whiteSpace: "nowrap",
              boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
            }}
          >
            {cursor.name}
          </div>
        </div>
      ))}
    </div>
  );
}
