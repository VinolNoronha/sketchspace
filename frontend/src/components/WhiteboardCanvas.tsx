"use client";

import {
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Canvas, PencilBrush, Path } from "fabric";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface RemoteStroke {
  pathData: string;
  color: string;
  width: number;
  userId?: string;
}

export interface WhiteboardCanvasHandle {
  undo: () => void;
  redo: () => void;
  clear: () => void;
  exportAsPng: () => void;
  exportAsPdf: () => void;
  addRemoteStroke: (stroke: RemoteStroke) => void;
  removeRemoteStroke: (pathData: string) => void;
}

interface WhiteboardCanvasProps {
  brushColor: string;
  brushSize: number;
  isErasing?: boolean;
  onStrokeComplete?: (stroke: RemoteStroke) => void;
  onCursorMove?: (position: { x: number; y: number }) => void;
  onUndo?: (stroke: RemoteStroke) => void;
  onRedo?: (stroke: RemoteStroke) => void;
}

interface FabricPathWithId extends Path {
  _pathDataString?: string;
}

// ── Component ──────────────────────────────────────────────────────────────────

const WhiteboardCanvas = forwardRef<
  WhiteboardCanvasHandle,
  WhiteboardCanvasProps
>(function WhiteboardCanvas(
  {
    brushColor,
    brushSize,
    isErasing = false,
    onStrokeComplete,
    onCursorMove,
    onUndo,
    onRedo,
  },
  ref,
) {
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Per-stroke undo/redo — no more full canvas snapshots
  const myStrokes = useRef<FabricPathWithId[]>([]);
  const redoStrokes = useRef<FabricPathWithId[]>([]);

  const isMutatingRef = useRef(false);

  // Keep latest callbacks in refs — avoids stale closures inside canvas events
  const onStrokeCompleteRef = useRef(onStrokeComplete);
  const onCursorMoveRef = useRef(onCursorMove);
  const onUndoRef = useRef(onUndo);
  const onRedoRef = useRef(onRedo);

  useEffect(() => {
    onStrokeCompleteRef.current = onStrokeComplete;
  }, [onStrokeComplete]);
  useEffect(() => {
    onCursorMoveRef.current = onCursorMove;
  }, [onCursorMove]);
  useEffect(() => {
    onUndoRef.current = onUndo;
  }, [onUndo]);
  useEffect(() => {
    onRedoRef.current = onRedo;
  }, [onRedo]);

  // ── Clear helper (only thing that still needs a snapshot) ────────────────────

  const clearCanvas = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    myStrokes.current = [];
    redoStrokes.current = [];
    canvas.clear();
    canvas.backgroundColor = "#ffffff";
    canvas.renderAll();
  }, []);

  // ── Imperative handle ────────────────────────────────────────────────────────

  useImperativeHandle(
    ref,
    () => ({
      // undo() {
      //   const canvas = fabricRef.current;
      //   if (!canvas || myStrokes.current.length === 0) return;

      //   const lastStroke = myStrokes.current.pop()!;
      //   redoStrokes.current.push(lastStroke);

      //   canvas.remove(lastStroke);
      //   canvas.renderAll();

      //   // Notify other tabs
      //   onUndoRef.current?.({
      //     pathData: lastStroke._pathDataString!,
      //     color: lastStroke.stroke as string,
      //     width: lastStroke.strokeWidth as number,
      //   });
      // },

      undo() {
        const canvas = fabricRef.current;
        if (!canvas || myStrokes.current.length === 0) return;

        const lastStroke = myStrokes.current.pop()!;
        console.log("[undo] lastStroke:", lastStroke);
        console.log("[undo] _pathDataString:", lastStroke._pathDataString);
        console.log("[undo] myStrokes array was:", myStrokes.current.length);
        redoStrokes.current.push(lastStroke);
        canvas.remove(lastStroke);
        canvas.renderAll();

        console.log("[undo] sending pathData:", lastStroke._pathDataString); // ← add
        onUndoRef.current?.({
          pathData: lastStroke._pathDataString!,
          color: lastStroke.stroke as string,
          width: lastStroke.strokeWidth as number,
        });
      },

      redo() {
        const canvas = fabricRef.current;
        if (!canvas || redoStrokes.current.length === 0) return;

        const stroke = redoStrokes.current.pop()!;
        myStrokes.current.push(stroke);

        canvas.add(stroke);
        canvas.renderAll();

        // Notify other tabs
        onRedoRef.current?.({
          pathData: stroke._pathDataString!,
          color: stroke.stroke as string,
          width: stroke.strokeWidth as number,
        });
      },

      clear() {
        clearCanvas();
      },

      exportAsPng() {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const dataUrl = canvas.toDataURL({ format: "png", multiplier: 2 });
        triggerDownload(dataUrl, `whiteboard-${Date.now()}.png`);
      },

      async exportAsPdf() {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const { jsPDF } = await import("jspdf");
        const dataUrl = canvas.toDataURL({ format: "png", multiplier: 2 });
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [canvas.width!, canvas.height!],
        });
        pdf.addImage(dataUrl, "PNG", 0, 0, canvas.width!, canvas.height!);
        pdf.save(`whiteboard-${Date.now()}.pdf`);
      },

      addRemoteStroke(stroke: RemoteStroke) {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const path = new Path(stroke.pathData, {
          stroke: stroke.color,
          strokeWidth: stroke.width,
          fill: "",
          selectable: false,
          evented: false,
        }) as FabricPathWithId;
        path._pathDataString = stroke.pathData;
        canvas.add(path);
        canvas.renderAll();
      },

      removeRemoteStroke(pathData: string) {
        const canvas = fabricRef.current;
        if (!canvas) return;
        console.log("[removeRemoteStroke] looking for:", pathData);
        console.log(
          "[removeRemoteStroke] all objects:",
          canvas
            .getObjects()
            .map((o) => (o as FabricPathWithId)._pathDataString),
        );
        const obj = canvas
          .getObjects()
          .find((o) => (o as FabricPathWithId)._pathDataString === pathData);
        console.log("[removeRemoteStroke] found:", obj);
        if (obj) {
          canvas.remove(obj);
          canvas.renderAll();
        }
      },
    }),
    [clearCanvas],
  );

  // ── Canvas init ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!canvasElRef.current || !containerRef.current) return;

    const container = containerRef.current;

    const canvas = new Canvas(canvasElRef.current, {
      isDrawingMode: true,
      width: container.clientWidth,
      height: container.clientHeight,
      backgroundColor: "#ffffff",
    });

    const brush = new PencilBrush(canvas);
    brush.color = brushColor;
    brush.width = brushSize;
    canvas.freeDrawingBrush = brush;

    fabricRef.current = canvas;

    canvas.on("path:created", (e) => {
      const path = e.path as FabricPathWithId;
      console.log("[path:created] raw path.path:", path.path); // ← add

      path._pathDataString = JSON.stringify(path.path);
      console.log(
        "[path:created] _pathDataString set to:",
        path._pathDataString,
      ); // ← add

      myStrokes.current.push(path);
      redoStrokes.current = [];

      onStrokeCompleteRef.current?.({
        pathData: path._pathDataString!,
        color: path.stroke as string,
        width: path.strokeWidth as number,
      });
    });

    canvas.on("mouse:move", (e) => {
      onCursorMoveRef.current?.({
        x: e.scenePoint.x,
        y: e.scenePoint.y,
      });
    });

    const ro = new ResizeObserver(() => {
      if (!containerRef.current) return;
      canvas.setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    });
    ro.observe(container);

    const onKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      )
        return;

      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      const handle =
        typeof ref === "function"
          ? null
          : (ref as React.RefObject<WhiteboardCanvasHandle | null>)?.current;

      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handle?.undo();
      }
      if (e.key === "z" && e.shiftKey) {
        e.preventDefault();
        handle?.redo();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      canvas.dispose();
      ro.disconnect();
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Brush sync ───────────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas?.freeDrawingBrush) return;

    if (isErasing) {
      canvas.freeDrawingBrush.color = "#ffffff";
      canvas.freeDrawingBrush.width = brushSize * 3;
    } else {
      canvas.freeDrawingBrush.color = brushColor;
      canvas.freeDrawingBrush.width = brushSize;
    }
  }, [brushColor, brushSize, isErasing]);

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasElRef}
        style={{
          display: "block",
          cursor: isErasing ? "cell" : "crosshair",
          touchAction: "none",
        }}
      />
    </div>
  );
});

export default WhiteboardCanvas;

// ── Helpers ───────────────────────────────────────────────────────────────────

function triggerDownload(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
