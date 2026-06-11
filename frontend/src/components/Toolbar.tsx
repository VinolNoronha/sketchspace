"use client";

interface ToolbarProps {
  brushColor: string;
  setBrushColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  isErasing: boolean;
  setIsErasing: (v: boolean) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onExportPng: () => void;
  onExportPdf: () => void;
}

const PRESET_COLORS = [
  "#111827",
  "#2563EB",
  "#7C3AED",
  "#DB2777",
  "#D97706",
  "#059669",
  "#DC2626",
];

const BRUSH_SIZES = [2, 4, 8, 14];

export default function Toolbar({
  brushColor,
  setBrushColor,
  brushSize,
  setBrushSize,
  isErasing,
  setIsErasing,
  onUndo,
  onRedo,
  onClear,
  onExportPng,
  onExportPdf,
}: ToolbarProps) {
  return (
    <div
      className="d-flex flex-column align-items-center gap-3 py-3"
      style={{
        position: "fixed",
        top: "64px", // below navbar
        left: 0,
        width: "64px",
        height: "calc(100vh - 64px)",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #E5E7EB",
        zIndex: 90,
        overflowY: "auto",
      }}
    >
      {/* Undo */}
      <ToolBtn title="Undo (⌘Z)" onClick={onUndo}>
        <UndoIcon />
      </ToolBtn>

      {/* Redo */}
      <ToolBtn title="Redo (⌘⇧Z)" onClick={onRedo}>
        <RedoIcon />
      </ToolBtn>

      <Divider />

      {/* Color presets */}
      {PRESET_COLORS.map((c) => (
        <button
          key={c}
          title={c}
          onClick={() => {
            setBrushColor(c);
            setIsErasing(false);
          }}
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            backgroundColor: c,
            border:
              !isErasing && brushColor === c
                ? "3px solid #2563EB"
                : "2px solid #E5E7EB",
            cursor: "pointer",
            padding: 0,
            flexShrink: 0,
          }}
        />
      ))}

      {/* Custom color */}
      <div style={{ position: "relative" }} title="Custom color">
        <div
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            background:
              "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)",
            border: "2px solid #E5E7EB",
            cursor: "pointer",
          }}
        />
        <input
          type="color"
          value={brushColor}
          onChange={(e) => {
            setBrushColor(e.target.value);
            setIsErasing(false);
          }}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            cursor: "pointer",
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      <Divider />

      {/* Brush sizes */}
      {BRUSH_SIZES.map((s) => (
        <button
          key={s}
          title={`Size ${s}`}
          onClick={() => {
            setBrushSize(s);
            setIsErasing(false);
          }}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            border:
              !isErasing && brushSize === s
                ? "2px solid #2563EB"
                : "1px solid #E5E7EB",
            backgroundColor: !isErasing && brushSize === s ? "#EFF6FF" : "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: `${Math.min(s + 4, 20)}px`,
              height: `${Math.min(s + 4, 20)}px`,
              borderRadius: "50%",
              backgroundColor: "#374151",
            }}
          />
        </button>
      ))}

      <Divider />

      {/* Eraser */}
      <ToolBtn
        title="Eraser"
        onClick={() => setIsErasing(!isErasing)}
        active={isErasing}
      >
        <EraserIcon />
      </ToolBtn>

      {/* Clear */}
      <ToolBtn title="Clear canvas" onClick={onClear}>
        <TrashIcon />
      </ToolBtn>

      <Divider />

      {/* Export PNG */}
      <ToolBtn title="Export PNG" onClick={onExportPng}>
        <ImageIcon />
      </ToolBtn>

      {/* Export PDF */}
      <ToolBtn title="Export PDF" onClick={onExportPdf}>
        <PdfIcon />
      </ToolBtn>
    </div>
  );
}

// ── Small reusable pieces ──────────────────────────────────────────────────────

function Divider() {
  return (
    <div
      style={{
        width: "32px",
        height: "1px",
        backgroundColor: "#E5E7EB",
        flexShrink: 0,
      }}
    />
  );
}

function ToolBtn({
  children,
  onClick,
  title,
  active = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
  active?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "8px",
        border: active ? "2px solid #2563EB" : "1px solid #E5E7EB",
        backgroundColor: active ? "#EFF6FF" : "#ffffff",
        color: active ? "#2563EB" : "#374151",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

// ── Icons (inline SVG, no extra dep) ──────────────────────────────────────────

function UndoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7v6h6" />
      <path d="M3 13C5 7 10 4 16 6a9 9 0 0 1 5 8" />
    </svg>
  );
}

function RedoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 7v6h-6" />
      <path d="M21 13C19 7 14 4 8 6a9 9 0 0 0-5 8" />
    </svg>
  );
}

function EraserIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 20H7L3 16l10-10 7 7-3 3" />
      <path d="M6.5 17.5l4-4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  );
}
