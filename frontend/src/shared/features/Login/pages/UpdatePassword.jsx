import { useState } from "react";
import Layout from "../components/Layout.jsx";
import { resetPassword } from "../api.js";
// Added PasswordIcon to the imports
import { ViewIcon, ViewOffIcon, CheckmarkCircle01Icon, SquareLock02Icon } from "hugeicons-react";

export default function UpdatePassword({ email, otp, onDone, onCancel }) {
  const [pw, setPw]           = useState("");
  const [pw2, setPw2]         = useState("");
  const [show, setShow]       = useState(false);
  const [show2, setShow2]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const rules = [
    { label: "At least 8 characters", ok: pw.length >= 8 },
    { label: "One uppercase letter",  ok: /[A-Z]/.test(pw) },
    { label: "One number",            ok: /\d/.test(pw) },
  ];

  const submit = async (e) => {
    e.preventDefault();
    if (!pw || !pw2) { setError("Both fields are required."); return; }
    if (!rules.every(r => r.ok)) { setError("Password doesn't meet requirements."); return; }
    if (pw !== pw2) { setError("Passwords do not match."); return; }
    if (!email || !otp) { setError("Missing email or verification code."); return; }

    setError(""); setLoading(true);

    try {
      await resetPassword({ email, otp, newPassword: pw });
      onDone();
    } catch (err) {
      setError(err.message || "Unable to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout charProps={{ password: pw, showPassword: show || show2 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1a1a2e" }}>Set new password</h1>
        <p style={{ fontSize: 14, color: "#adb5bd", marginTop: 6 }}>
          Choose a strong password for your account.
        </p>
      </div>

      <form onSubmit={submit} noValidate>
        {/* Wrapped in form group */}
        <div className="a-form-group">
          <label className="a-label">New password</label>
          {/* Using the input wrapper and adding the PasswordIcon */}
          <div className="a-input-wrapper">
            <SquareLock02Icon size={20} className="a-input-icon" />
            <input className={`a-input ${error && !pw ? "error-ring" : ""}`} type={show ? "text" : "password"}
              placeholder="••••••••" value={pw} onChange={e => setPw(e.target.value)}
              style={{ paddingRight: 44 }} />
            <button type="button" className="toggle-pw" onClick={() => setShow(v => !v)}>
              {show ? <ViewIcon size={18} /> : <ViewOffIcon size={18} />}
            </button>
          </div>
        </div>

        {/* Strength indicators */}
        {pw.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            {rules.map(r => (
              <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                <div style={{
                  width: 14, height: 14, borderRadius: "50%",
                  background: r.ok ? "#22c55e" : "#dde1e7",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {r.ok && <CheckmarkCircle01Icon size={10} color="white" variant="solid" />}
                </div>
                <span style={{ fontSize: 12, color: r.ok ? "#22c55e" : "#adb5bd" }}>{r.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Wrapped in form group */}
        <div className="a-form-group" style={{ marginBottom: 20 }}>
          <label className="a-label">Confirm password</label>
          {/* Using the input wrapper and adding the PasswordIcon */}
          <div className="a-input-wrapper">
            <SquareLock02Icon size={20} className="a-input-icon" />
            <input className={`a-input ${pw2 && pw !== pw2 ? " error-ring" : ""}`}
              type={show2 ? "text" : "password"}
              placeholder="••••••••" value={pw2} onChange={e => setPw2(e.target.value)}
              style={{ paddingRight: 44 }} />
            <button type="button" className="toggle-pw" onClick={() => setShow2(v => !v)}>
              {show2 ? <ViewIcon size={18} /> : <ViewOffIcon size={18} />}
            </button>
          </div>
          {/* Placed error message immediately under the final input */}
          {error && <div className="a-err">{error}</div>}
        </div>

        <button className="a-btn" type="submit" disabled={loading}>
          {loading ? "Updating…" : "Update Password"}
        </button>
        <button type="button" className="a-btn-cancel" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
      </form>
    </Layout>
  );
}