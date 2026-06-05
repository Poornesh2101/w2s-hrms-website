import  { useState } from "react";
import Layout from "../components/Layout.jsx";
import { forgotPassword } from "../api.js";
import { ArrowLeft01Icon, Mail02Icon } from "hugeicons-react";

export default function ForgotPassword({ onBack, onSent }) {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [typing, setTyping]   = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    
    // Custom Validation
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid work email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await forgotPassword(email);
      onSent(email);
    } catch (err) {
      setError(err.message || "Unable to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout charProps={{ isTyping: typing }}>
      <button onClick={onBack} style={{
        display: "flex", alignItems: "center", gap: 6, background: "none",
        border: "none", cursor: "pointer", color: "#888", fontSize: 13,
        fontFamily: "inherit", fontWeight: 600, marginBottom: 28, padding: 0,
      }}>
        <ArrowLeft01Icon size={15} /> Back to Login
      </button>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1a1a2e" }}>Recover Password</h1>
        <p style={{ fontSize: 14, color: "#555", marginTop: 6, lineHeight: 1.5 }}>
          Enter your registered work email. We'll send a 4-digit authorization code to reset your password.
        </p>
      </div>

      <form onSubmit={submit} noValidate>
        {/* [MODIFIED] Wrapped in form group for structure */}
        <div className="a-form-group">
          <label className="a-label">Registered Email</label>
          <div className="a-input-wrapper">
            <Mail02Icon size={20} className="a-input-icon" />
            <input className={`a-input ${error ? "error-ring" : ""}`} type="email" placeholder="Enter your Email"
              value={email} onChange={e => setEmail(e.target.value)}
              onFocus={() => setTyping(true)} onBlur={() => setTyping(false)}
              autoComplete="off" />
          </div>
          {/* [MODIFIED] Plain text error message immediately below the box */}
          {error && <div className="a-err">{error}</div>}
        </div>

        <button className="a-btn" type="submit" disabled={loading}>
          {loading ? "Requesting Code…" : "Send   Code"}
        </button>
      </form>
    </Layout>
  );
}