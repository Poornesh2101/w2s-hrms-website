import "react";
import CharacterScene from "./CharacterScene.jsx";
import "../style/login.css"; 

export default function Layout({ children, charProps = {} }) {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", 
      justifyContent: "center", padding: 16,
      background: "linear-gradient(to bottom, #DBDBDB 60%, #B8C1DC 100%)"
    }}>
      <div style={{
        display: "flex", width: "100%", maxWidth: 1060, minHeight: 620,
        background: "rgba(255, 255, 255, 0.25)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        borderRadius: 28, overflow: "hidden",
        boxShadow: "0 24px 60px rgba(0,0,0,0.08)",
      }}>
        <div className="char-panel">
          <div className="dot-grid" />
          <div style={{ position: "absolute", top: 32, left: 36, zIndex: 10 }}>
            <img src="/logo.svg" alt="Logo" style={{ height: 100 }}
                 onError={e => { e.target.style.display = "none"; }} />
          </div>
          <div style={{ position: "relative", zIndex: 5 }}>
            <CharacterScene {...charProps} />
          </div>
        </div>

        {/* Right — form */}
        <div className="form-panel">
          <div style={{ width: "100%", maxWidth: 355 }}>
            
            {/* [NEW] Mobile-only Logo: Centered at the top */}
            <div className="mobile-logo-wrap">
              <img src="/logo.svg" alt="Logo" style={{ height: 100 }}
                   onError={e => { e.target.style.display = "none"; }} />
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}