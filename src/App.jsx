import  { useState } from "react";
import "./styles/global.css";

import Login from "./features/Login/pages/Login.jsx";
import ForgotPassword from "./features/Login/pages/ForgotPassword.jsx";
import OtpVerification from "./features/Login/pages/OtpVerification.jsx";
import UpdatePassword from "./features/Login/pages/UpdatePassword.jsx";
import Success from "./features/Login/pages/Success.jsx";

export default function App() {
  const [screen, setScreen] = useState("login");
  const [resetEmail, setResetEmail] = useState("");

  return (
    <>
      {screen === "login" &&
        <Login onForgot={() => setScreen("forgot")} onSuccess={() => alert("Welcome back!")} />
      }
      {screen === "forgot" &&
        <ForgotPassword onBack={() => setScreen("login")} onSent={(e) => { setResetEmail(e); setScreen("otp"); }} />
      }
      {screen === "otp" &&
        <OtpVerification email={resetEmail} onBack={() => setScreen("forgot")} onVerified={() => setScreen("updatepw")} />
      }
      {screen === "updatepw" &&
        <UpdatePassword onDone={() => setScreen("success")} onCancel={() => setScreen("login")} />
      }
      {screen === "success" &&
        <Success onLogin={() => setScreen("login")} />
      }
    </>
  );
}