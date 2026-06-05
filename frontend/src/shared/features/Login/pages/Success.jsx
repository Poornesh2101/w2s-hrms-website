import "react";
import Layout from "../components/Layout.jsx";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Success({ onLogin }) {
  return (
    <Layout charProps={{}}>
      <div style={{ textAlign: "center" }}>
        
        {/* Container with blend mode to remove any white artifacts on the asset itself */}
        <div style={{ 
          width: 140, 
          height: 140, 
          margin: "0 auto 10px", 
          background: "transparent", 
          mixBlendMode: "multiply" /* Key trick to force transparent backgrounds from Lottie files with white squares */
        }}>
          <DotLottieReact
            src="public/Success_Check.lottie"
            autoplay={true}
            loop={false}
            speed={1}
            backgroundColor="transparent" /* Force transparent background in the player itself */
            style={{ 
                width: '100%', 
                height: '100%', 
                background: "transparent" 
            }}
          />
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1a1a2e", marginBottom: 10 }}>
          Access Restored!
        </h1>
        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6, marginBottom: 32 }}>
          Your password has been successfully updated. You may now log in.
        </p>
        
        <button className="a-btn" onClick={onLogin}>Proceed to Login</button>
      </div>
    </Layout>
  );
}