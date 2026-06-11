import Link from "next/link";

export default function SignupPage() {
  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
      }}
    >
      <div
        className="card border-0 shadow-sm"
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "16px",
        }}
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

          <form>
            <div className="mb-3">
              <label className="form-label">Full Name</label>

              <input
                type="text"
                className="form-control"
                placeholder="John Doe"
                style={{ height: "46px" }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address</label>

              <input
                type="email"
                className="form-control"
                placeholder="name@example.com"
                style={{ height: "46px" }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>

              <input
                type="password"
                className="form-control"
                placeholder="Create password"
                style={{ height: "46px" }}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Confirm Password</label>

              <input
                type="password"
                className="form-control"
                placeholder="Confirm password"
                style={{ height: "46px" }}
              />
            </div>

            <button
              type="submit"
              className="btn w-100 text-white fw-medium"
              style={{
                background: "#2563EB",
                border: "none",
                height: "46px",
                borderRadius: "8px",
              }}
            >
              Create Account
            </button>
          </form>

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
