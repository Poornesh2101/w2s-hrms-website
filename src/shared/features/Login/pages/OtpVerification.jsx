import  { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout.jsx";
import { ArrowLeft01Icon } from "hugeicons-react";

const OTP_LENGTH = 4; // Changed to 4 digits
const MOCK_OTP = "1234"; // 4 digit mock

export default function OtpVerification({ email, onBack, onVerified }) {
  const [otp, setOtp]         = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [resent, setResent]   = useState(false);
  const [timer, setTimer]     = useState(60);
  const inputs = useRef([]);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < OTP_LENGTH - 1) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (pasted.length === OTP_LENGTH) {
      setOtp(pasted.split(""));
      inputs.current[OTP_LENGTH - 1]?.focus();
    }
    e.preventDefault();
  };

  const submit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < OTP_LENGTH) { setError("Please enter all 4 digits."); return; }

    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 500));

    if (code === MOCK_OTP) onVerified();
    else setError("Invalid authorization code. Please check your email.");
    setLoading(false);
  };

  const resend = async () => {
    setOtp(Array(OTP_LENGTH).fill("")); setError("");
    setResent(true); setTimer(60);
    await new Promise(r => setTimeout(r, 800));
    setResent(false);
  };

  return (
    <Layout charProps={{}}>
      <button onClick={onBack} style={{
        display: "flex", alignItems: "center", gap: 6, background: "none",
        border: "none", cursor: "pointer", color: "#888", fontSize: 13,
        fontFamily: "inherit", fontWeight: 600, marginBottom: 28, padding: 0,
      }}>
        <ArrowLeft01Icon size={15} /> Back
      </button>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1a1a2e" }}>Verify Identity</h1>
        <p style={{ fontSize: 14, color: "#555", marginTop: 6, lineHeight: 1.5 }}>
          We sent a 4-digit security code to <strong style={{ color: "#1a1a2e" }}>{email}</strong>.
        </p>
      </div>

      <form onSubmit={submit} noValidate>
        <div className="otp-row" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i} ref={el => (inputs.current[i] = el)}
              className={`otp-cell ${error ? "error-ring" : ""}`}
              type="text" inputMode="numeric" maxLength={1}
              value={digit} onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
            />
          ))}
        </div>

        <div style={{ minHeight: "24px", marginBottom: "14px" }}>
          {error && <div className="a-err">{error}</div>}
          {resent && <div className="a-ok">New code dispatched to your email!</div>}
        </div>

        <button className="a-btn" type="submit" disabled={loading || otp.join("").length < OTP_LENGTH}>
          {loading ? "Verifying…" : "Verify Code"}
        </button>
      </form>

      <p style={{ textAlign: "center", fontSize: 13, color: "#555", marginTop: 20 }}>
        Didn't receive the email?{" "}
        {timer > 0 ? <span style={{ color: "#888" }}>Resend in {timer}s</span> : <span className="a-link" onClick={resend}>Request new code</span>}
      </p>
    </Layout>
  );
}