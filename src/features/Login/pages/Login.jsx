import  { useState } from "react";
import Layout from "../components/Layout";
import { ViewIcon, ViewOffIcon, Mail02Icon, SquareLock02Icon } from "hugeicons-react";
import Toast from "../components/Toast";

export default function Login({ onForgot, onSuccess }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [typing, setTyping]     = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your registered work email and password.");
      return;
    }
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 400));

    // Updated mock for professional HRMS testing
    if (email === "hr@hrms.com" && password === "HrmsPassword") onSuccess();
    else setError("Invalid credentials. Please try again or contact IT.");
    setLoading(false);
  };

  return (
    <>
      {/* 2. RENDER THE TOAST IF THERE IS AN ERROR */}
      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setError("")}
        />
      )}

      <Layout charProps={{ isTyping: typing, password, showPassword: show }}>
        <div style={{ marginBottom: 30 }}>
          <h1 style={{ fontSize: 27, fontWeight: 700, color: "#1a1a2e" }}>Welcome Back</h1>
          <p style={{ fontSize: 14, color: "#555", marginTop: 6 }}>
            Sign in to access your employee workspace.
          </p>
        </div>

        <form onSubmit={submit} noValidate>
          <div className="a-form-group">
            <label className="a-label">Work Email</label>
            <div className="a-input-wrapper">
              <Mail02Icon size={20} className="a-input-icon" />
              <input className={`a-input ${error ? "error-ring" : ""}`} type="email" placeholder="name@company.com"
                value={email} onChange={e => setEmail(e.target.value)}
                onFocus={() => setTyping(true)} onBlur={() => setTyping(false)} autoComplete="off" />
            </div>
          </div>

          <div className="a-form-group">
            <label className="a-label">Password</label>
            <div className="a-input-wrapper" style={{ position: "relative" }}>
              <SquareLock02Icon size={20} className="a-input-icon" />
              <input className={`a-input ${error ? "error-ring" : ""}`} type={show ? "text" : "password"}
                placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                style={{ paddingRight: 44 }} />
              <button type="button" className="toggle-pw" onClick={() => setShow(v => !v)}>
                {show ? <ViewOffIcon size={18} /> : <ViewIcon size={18} />}
              </button>
            </div>

          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
            <span className="a-link-red" style={{ fontSize: 13 }} onClick={onForgot}>Forgot password?</span>
          </div>

          <button className="a-btn" type="submit" disabled={loading}>
            {loading ? "Authenticating…" : "Login"}
          </button>
        </form>
      </Layout>
    </>
  );
}