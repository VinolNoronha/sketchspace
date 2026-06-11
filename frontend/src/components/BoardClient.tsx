"use client";

import { useRef, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Toolbar from "@/components/Toolbar";
import WhiteboardCanvas, {
  type WhiteboardCanvasHandle,
} from "@/components/WhiteboardCanvas";
import CursorLayer from "@/components/CursorLayer";
import { useWebSocket } from "@/hooks/useWebSocket";
import keycloak from "@/services/keycloak";

interface BoardClientProps {
  sessionId: string;
}

export default function BoardClient({ sessionId }: BoardClientProps) {
  const canvasRef = useRef<WhiteboardCanvasHandle | null>(null);

  const [brushColor, setBrushColor] = useState("#111827");
  const [brushSize, setBrushSize] = useState(4);
  const [isErasing, setIsErasing] = useState(false);

  // Replace mock user with Keycloak token values
  const [userId, setUserId] = useState<string>(
    keycloak.tokenParsed?.sub ?? "user-001",
  );
  const [userName, setUserName] = useState<string>(
    keycloak.tokenParsed?.preferred_username ?? "User",
  );

  const {
    isConnected,
    remoteCursors,
    sendStroke,
    sendCursor,
    sendUndo,
    sendRedo,
  } = useWebSocket({
    sessionId,
    userId,
    userName,
    canvasRef,
  });

  return (
    // Full viewport, light grey background from design system
    <div
      style={{
        backgroundColor: "#F9FAFB",
        height: "100vh",
        overflow: "hidden", // prevent page scroll — canvas scrolls itself
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Fixed top navbar ─────────────────────────────────────────────────── */}
      <Navbar sessionId={sessionId} isConnected={isConnected} />

      {/* ── Below navbar ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flex: 1,
          marginTop: "64px", // navbar height
          overflow: "hidden",
        }}
      >
        {/* ── Fixed left toolbar ─────────────────────────────────────────────── */}
        <Toolbar
          brushColor={brushColor}
          setBrushColor={(c) => {
            setBrushColor(c);
            setIsErasing(false);
          }}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          isErasing={isErasing}
          setIsErasing={setIsErasing}
          onUndo={() => canvasRef.current?.undo()}
          onRedo={() => canvasRef.current?.redo()}
          onClear={() => canvasRef.current?.clear()}
          onExportPng={() => canvasRef.current?.exportAsPng()}
          onExportPdf={() => canvasRef.current?.exportAsPdf()}
        />

        {/* ── Canvas area — fills remaining space ────────────────────────────── */}
        <div
          style={{
            position: "relative",
            flex: 1, // takes all width not used by toolbar
            height: "100%",
            overflow: "hidden",
          }}
        >
          <WhiteboardCanvas
            ref={canvasRef}
            brushColor={brushColor}
            brushSize={brushSize}
            isErasing={isErasing}
            onStrokeComplete={sendStroke}
            onCursorMove={sendCursor}
            onUndo={sendUndo}
            onRedo={sendRedo}
          />

          {/* Sits exactly on top of canvas, pointer-events:none inside */}
          <CursorLayer cursors={remoteCursors} />
        </div>
      </div>
    </div>
  );
}
