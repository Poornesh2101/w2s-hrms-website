import  { useState, useEffect, useRef } from "react";

function useBlink() {
  const [b, setB] = useState(false);
  useEffect(() => {
    let t;
    const go = () => {
      t = setTimeout(() => {
        setB(true);
        setTimeout(() => { setB(false); go(); }, 150);
      }, Math.random() * 4000 + 3000);
    };
    go();
    return () => clearTimeout(t);
  }, []);
  return b;
}

function EyeBall({ size = 18, pupilSize = 7, maxDist = 5, blink = false, fx, fy }) {
  const [p, setP] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (!ref.current || fx !== undefined) return;
      const r = ref.current.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.min(Math.sqrt(dx * dx + dy * dy), maxDist);
      const a = Math.atan2(dy, dx);
      setP({ x: Math.cos(a) * d, y: Math.sin(a) * d });
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, [fx, maxDist]);

  const x = fx !== undefined ? fx : p.x;
  const y = fy !== undefined ? fy : p.y;
  return (
    <div ref={ref} style={{
      width: size, height: blink ? 2 : size, borderRadius: "50%",
      backgroundColor: "white", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "height 0.12s ease",
    }}>
      {!blink && (
        <div style={{
          width: pupilSize, height: pupilSize, borderRadius: "50%",
          backgroundColor: "#2D2D2D",
          transform: `translate(${x}px, ${y}px)`,
          transition: "transform 0.1s ease-out",
        }} />
      )}
    </div>
  );
}

function Pupil({ size = 11, maxDist = 5, fx, fy }) {
  const [p, setP] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (!ref.current || fx !== undefined) return;
      const r = ref.current.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.min(Math.sqrt(dx * dx + dy * dy), maxDist);
      const a = Math.atan2(dy, dx);
      setP({ x: Math.cos(a) * d, y: Math.sin(a) * d });
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, [fx, maxDist]);

  const x = fx !== undefined ? fx : p.x;
  const y = fy !== undefined ? fy : p.y;
  return (
    <div ref={ref} style={{
      width: size, height: size, borderRadius: "50%", backgroundColor: "#2D2D2D",
      transform: `translate(${x}px, ${y}px)`, transition: "transform 0.1s ease-out",
    }} />
  );
}

/* ─────────────────────────────────────────
   CHARACTER SCENE COMPONENT
───────────────────────────────────────── */
export default function CharacterScene({ isTyping, password = "", showPassword = false }) {
  const purpleRef = useRef(null);
  const blackRef  = useRef(null);
  const yellowRef = useRef(null);
  const orangeRef = useRef(null);

  const [transforms, setTransforms] = useState({
    pp: { fx: 0, fy: 0, skew: 0 },
    bp: { fx: 0, fy: 0, skew: 0 },
    yp: { fx: 0, fy: 0, skew: 0 },
    op: { fx: 0, fy: 0, skew: 0 }
  });

  const [looking, setLooking] = useState(false);
  const [peeking, setPeeking] = useState(false);

  const purpleBlink = useBlink();
  const blackBlink  = useBlink();

  useEffect(() => {
    const h = (e) => {
      const calc = (ref) => {
        if (!ref.current) return { fx: 0, fy: 0, skew: 0 };
        const r = ref.current.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 3);
        return {
          fx: Math.max(-15, Math.min(15, dx / 20)),
          fy: Math.max(-10, Math.min(10, dy / 30)),
          skew: Math.max(-6, Math.min(6, -dx / 120)),
        };
      };

      setTransforms({
        pp: calc(purpleRef),
        bp: calc(blackRef),
        yp: calc(yellowRef),
        op: calc(orangeRef),
      });
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  useEffect(() => {
    let t1, t2;
    if (isTyping) {
      t1 = setTimeout(() => setLooking(true), 0);
      t2 = setTimeout(() => setLooking(false), 800);
    } else {
      t1 = setTimeout(() => setLooking(false), 0);
    }
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isTyping]);

  useEffect(() => {
    let t1, t2;
    let active = true;

    if (password && showPassword) {
      const go = () => {
        t1 = setTimeout(() => {
          if (!active) return;
          setPeeking(true);
          t2 = setTimeout(() => {
            if (!active) return;
            setPeeking(false);
            go();
          }, 800);
        }, Math.random() * 3000 + 2000);
      };
      go();
    } else {
      t1 = setTimeout(() => setPeeking(false), 0);
    }

    return () => {
      active = false;
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [password, showPassword]);

  const { pp, bp, yp, op } = transforms;
  const hiding  = password.length > 0 && !showPassword;
  const showing = password.length > 0 && showPassword;

  const tr = (deg, tx = 0) => `skewX(${deg}deg)${tx ? ` translateX(${tx}px)` : ""}`;

  return (
    <div style={{ position: "relative", width: 440, height: 320 }}>
      {/* Purple — back */}
      <div ref={purpleRef} style={{
        position: "absolute", bottom: 0, left: 45, width: 155,
        height: isTyping || hiding ? 370 : 320,
        backgroundColor: "#6C3FF5", borderRadius: "10px 10px 0 0", zIndex: 1,
        transform: showing ? tr(0) : (isTyping || hiding) ? tr((pp.skew || 0) - 12, 28) : tr(pp.skew || 0),
        transformOrigin: "bottom center", transition: "all 0.7s ease-in-out",
      }}>
        <div style={{
          position: "absolute", display: "flex", gap: 26,
          left: showing ? 18 : looking ? 48 : `${42 + pp.fx}px`,
          top:  showing ? 28 : looking ? 52 : `${34 + pp.fy}px`,
          transition: "all 0.7s ease-in-out",
        }}>
          <EyeBall blink={purpleBlink} fx={showing ? (peeking ? 4 : -4) : looking ? 3 : undefined} fy={showing ? (peeking ? 5 : -4) : looking ? 4 : undefined} />
          <EyeBall blink={purpleBlink} fx={showing ? (peeking ? 4 : -4) : looking ? 3 : undefined} fy={showing ? (peeking ? 5 : -4) : looking ? 4 : undefined} />
        </div>
      </div>

      {/* Black — middle */}
      <div ref={blackRef} style={{
        position: "absolute", bottom: 0, left: 186, width: 108, height: 255,
        backgroundColor: "#2D2D2D", borderRadius: "8px 8px 0 0", zIndex: 2,
        transform: showing ? tr(0) : looking
          ? tr((bp.skew || 0) * 1.5 + 10, 16)
          : (isTyping || hiding) ? tr((bp.skew || 0) * 1.5) : tr(bp.skew || 0),
        transformOrigin: "bottom center", transition: "all 0.7s ease-in-out",
      }}>
        <div style={{
          position: "absolute", display: "flex", gap: 20,
          left: showing ? 8 : looking ? 26 : `${20 + bp.fx}px`,
          top:  showing ? 22 : looking ? 9  : `${26 + bp.fy}px`,
          transition: "all 0.7s ease-in-out",
        }}>
          <EyeBall size={15} pupilSize={6} maxDist={4} blink={blackBlink}
            fx={showing ? -4 : looking ? 0  : undefined}
            fy={showing ? -4 : looking ? -4 : undefined} />
          <EyeBall size={15} pupilSize={6} maxDist={4} blink={blackBlink}
            fx={showing ? -4 : looking ? 0  : undefined}
            fy={showing ? -4 : looking ? -4 : undefined} />
        </div>
      </div>

      {/* Orange — front left semicircle */}
      <div ref={orangeRef} style={{
        position: "absolute", bottom: 0, left: -5, width: 210, height: 168,
        backgroundColor: "#FF9B6B", borderRadius: "105px 105px 0 0", zIndex: 3,
        transform: showing ? tr(0) : tr(op.skew || 0),
        transformOrigin: "bottom center", transition: "all 0.7s ease-in-out",
      }}>
        <div style={{
          position: "absolute", display: "flex", gap: 26,
          left: showing ? 44 : `${72 + (op.fx || 0)}px`,
          top:  showing ? 76 : `${80 + (op.fy || 0)}px`,
          transition: "all 0.2s ease-out",
        }}>
          <Pupil fx={showing ? -5 : undefined} fy={showing ? -4 : undefined} />
          <Pupil fx={showing ? -5 : undefined} fy={showing ? -4 : undefined} />
        </div>
      </div>

      {/* Yellow — front right capsule */}
      <div ref={yellowRef} style={{
        position: "absolute", bottom: 0, left: 278, width: 126, height: 192,
        backgroundColor: "#E8D754", borderRadius: "63px 63px 0 0", zIndex: 4,
        transform: showing ? tr(0) : tr(yp.skew || 0),
        transformOrigin: "bottom center", transition: "all 0.7s ease-in-out",
      }}>
        <div style={{
          position: "absolute", display: "flex", gap: 20,
          left: showing ? 14 : `${44 + (yp.fx || 0)}px`,
          top:  showing ? 28 : `${34 + (yp.fy || 0)}px`,
          transition: "all 0.2s ease-out",
        }}>
          <Pupil fx={showing ? -5 : undefined} fy={showing ? -4 : undefined} />
          <Pupil fx={showing ? -5 : undefined} fy={showing ? -4 : undefined} />
        </div>
        {/* Mouth */}
        <div style={{
          position: "absolute", width: 66, height: 4,
          backgroundColor: "#2D2D2D", borderRadius: 99,
          left: showing ? 8 : `${32 + (yp.fx || 0)}px`,
          top:  showing ? 76 : `${76 + (yp.fy || 0)}px`,
          transition: "all 0.2s ease-out",
        }} />
      </div>
    </div>
  );
}