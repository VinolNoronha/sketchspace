import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg bg-white sticky-top"
        style={{ borderBottom: "1px solid #E5E7EB" }}
      >
        <div className="container">
          <Link
            href="/"
            className="navbar-brand fw-bold d-flex align-items-center gap-2"
          >
            <span
              style={{
                width: 34,
                height: 34,
                background: "#2563EB",
                borderRadius: 10,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 16,
              }}
            >
              ✏️
            </span>
            Sketchspace
          </Link>

          <div className="ms-auto d-flex gap-2">
            <Link href="/login" className="btn btn-outline-primary px-3">
              Sign In
            </Link>

            <Link
              href="/signup"
              className="btn text-white px-3"
              style={{
                background: "#2563EB",
                borderRadius: 8,
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-white py-5">
        <div className="container text-center py-5">
          <span
            className="d-inline-block px-3 py-2 rounded-pill mb-4"
            style={{
              background: "#EFF6FF",
              color: "#2563EB",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            ⚡ Real-Time Collaborative Whiteboard
          </span>

          <h1
            className="fw-bold mx-auto mb-4"
            style={{
              maxWidth: 750,
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              lineHeight: 1.15,
              color: "#111827",
            }}
          >
            Collaborate on ideas{" "}
            <span style={{ color: "#2563EB" }}>instantly</span>
          </h1>

          <p
            className="text-secondary mx-auto mb-5"
            style={{
              maxWidth: 650,
              fontSize: 18,
              lineHeight: 1.8,
            }}
          >
            Create whiteboard sessions, draw together in real-time, track
            collaborators live, and export your work whenever you're ready.
          </p>

          {/* Whiteboard Preview */}
          <div
            className="mx-auto shadow-sm"
            style={{
              maxWidth: 950,
              borderRadius: 18,
              border: "1px solid #E5E7EB",
              overflow: "hidden",
              background: "white",
            }}
          >
            {/* Toolbar */}
            <div
              className="d-flex align-items-center px-3"
              style={{
                height: 60,
                background: "#F8FAFC",
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "#EF4444",
                  marginRight: 8,
                }}
              />
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "#F59E0B",
                  marginRight: 8,
                }}
              />
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "#10B981",
                }}
              />

              <div className="ms-auto d-flex gap-2">
                <button className="btn btn-sm btn-outline-secondary">
                  Undo
                </button>
                <button className="btn btn-sm btn-outline-secondary">
                  Redo
                </button>
                <button className="btn btn-sm btn-primary">Save</button>
              </div>
            </div>

            {/* Mock Whiteboard */}
            <div
              style={{
                height: 380,
                background: "#FFFFFF",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 70,
                  left: 100,
                  width: 220,
                  height: 4,
                  background: "#2563EB",
                  transform: "rotate(12deg)",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  top: 130,
                  left: 420,
                  width: 150,
                  height: 150,
                  border: "3px solid #2563EB",
                  borderRadius: "50%",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: 90,
                  left: 220,
                  width: 180,
                  height: 4,
                  background: "#3B82F6",
                  transform: "rotate(-8deg)",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  top: 50,
                  right: 80,
                  background: "#EFF6FF",
                  color: "#2563EB",
                  padding: "10px 16px",
                  borderRadius: 10,
                  fontWeight: 600,
                }}
              >
                User A Drawing...
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: 50,
                  right: 120,
                  background: "#DBEAFE",
                  color: "#1D4ED8",
                  padding: "10px 16px",
                  borderRadius: 10,
                  fontWeight: 600,
                }}
              >
                User B Connected
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h5>🎨 Drawing Tools</h5>
                  <p className="text-secondary mb-0">
                    Draw using multiple colors and adjustable brush sizes.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h5>⚡ Real-Time Sync</h5>
                  <p className="text-secondary mb-0">
                    Collaborate instantly with connected users through
                    WebSockets.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h5>🔒 Secure Access</h5>
                  <p className="text-secondary mb-0">
                    User authentication powered by Keycloak.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
