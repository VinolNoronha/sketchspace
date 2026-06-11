"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type {
  WhiteboardCanvasHandle,
  RemoteStroke,
} from "@/components/WhiteboardCanvas";
import { getUserColor } from "@/components/CursorLayer";

interface RemoteCursor {
  x: number;
  y: number;
  name: string;
  color: string;
}

interface UseWebSocketOptions {
  sessionId: string;
  userId: string;
  userName: string;
  canvasRef: React.RefObject<WhiteboardCanvasHandle | null>;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  remoteCursors: Record<string, RemoteCursor>;
  sendStroke: (stroke: RemoteStroke) => void;
  sendCursor: (position: { x: number; y: number }) => void;
  sendUndo: (stroke: RemoteStroke) => void;
  sendRedo: (stroke: RemoteStroke) => void;
}

export function useWebSocket({
  sessionId,
  userId,
  userName,
  canvasRef,
}: UseWebSocketOptions): UseWebSocketReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [remoteCursors, setRemoteCursors] = useState<
    Record<string, RemoteCursor>
  >({});

  // Throttle cursor sends — no need to send every single mousemove
  const lastCursorSend = useRef(0);

  useEffect(() => {
    // TODO: swap localhost for your Docker service name / env var
    const url = `ws://localhost:8000/ws/${sessionId}?userId=${userId}&userName=${encodeURIComponent(userName)}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onclose = () => {
      setIsConnected(false);
      // Remove all cursors when disconnected
      setRemoteCursors({});
    };

    ws.onerror = () => {
      setIsConnected(false);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string);

        switch (msg.type) {
          case "stroke":
            canvasRef.current?.addRemoteStroke(msg.payload as RemoteStroke);
            break;

          case "undo":
            console.log("[onmessage undo] received:", msg.payload); // ← add
            canvasRef.current?.removeRemoteStroke(msg.payload.pathData);
            break;

          case "redo":
            canvasRef.current?.addRemoteStroke(msg.payload);
            break;

          case "cursor":
            setRemoteCursors((prev) => ({
              ...prev,
              [msg.userId]: {
                x: msg.payload.x,
                y: msg.payload.y,
                name: msg.userName ?? msg.userId,
                color: getUserColor(msg.userId),
              },
            }));
            break;

          case "user_left":
            // Remove cursor when someone disconnects
            setRemoteCursors((prev) => {
              const next = { ...prev };
              delete next[msg.userId];
              return next;
            });
            break;

          // Future: "undo", "clear", "chat" etc.
          default:
            break;
        }
      } catch {
        // malformed message, ignore
      }
    };

    return () => {
      ws.close();
    };
  }, [sessionId, userId, userName, canvasRef]);

  const sendStroke = useCallback(
    (stroke: RemoteStroke) => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) return;
      wsRef.current.send(
        JSON.stringify({ type: "stroke", userId, payload: stroke }),
      );
    },
    [userId],
  );

  const sendCursor = useCallback(
    (position: { x: number; y: number }) => {
      // Throttle to ~30fps
      const now = Date.now();
      if (now - lastCursorSend.current < 33) return;
      lastCursorSend.current = now;

      if (wsRef.current?.readyState !== WebSocket.OPEN) return;
      wsRef.current.send(
        JSON.stringify({ type: "cursor", userId, userName, payload: position }),
      );
    },
    [userId, userName],
  );

  // const sendUndo = useCallback(
  //   (stroke: RemoteStroke) => {
  //     if (wsRef.current?.readyState !== WebSocket.OPEN) return;
  //     wsRef.current.send(
  //       JSON.stringify({ type: "undo", userId, payload: stroke }),
  //     );
  //   },
  //   [userId],
  // );
  const sendUndo = useCallback(
    (stroke: RemoteStroke) => {
      console.log("[sendUndo] called with:", stroke); // ← add
      if (wsRef.current?.readyState !== WebSocket.OPEN) return;
      wsRef.current.send(
        JSON.stringify({ type: "undo", userId, payload: stroke }),
      );
    },
    [userId],
  );

  const sendRedo = useCallback(
    (stroke: RemoteStroke) => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) return;
      wsRef.current.send(
        JSON.stringify({ type: "redo", userId, payload: stroke }),
      );
    },
    [userId],
  );

  return {
    isConnected,
    remoteCursors,
    sendStroke,
    sendCursor,
    sendUndo,
    sendRedo,
  };
}
