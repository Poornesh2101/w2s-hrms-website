import { useState } from "react";
import "./styles/global.css";
import Login from "./shared/features/Login/pages/Login.jsx";
import ForgotPassword from "./shared/features/Login/pages/ForgotPassword.jsx";
import OtpVerification from "./shared/features/Login/pages/OtpVerification.jsx";
import UpdatePassword from "./shared/features/Login/pages/UpdatePassword.jsx";
import Success from "./shared/features/Login/pages/Success.jsx";
import Sidebar from "./shared/components/Sidebar/Sidebar.jsx";

const MainLayout = ({ children }) => (
    <div style={{
        display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden',
        background: 'linear-gradient(to bottom, #DBDBDB 60%, #B8C1DC 100%)'
    }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
            {children}
        </main>
    </div>
);

export default function App() {
    const [view, setView] = useState("login");
    const [email, setEmail] = useState("");

    return (
        <div className="app-container">
            {view === "login" && (
                <Login onSuccess={() => setView("dashboard")} onForgot={() => setView("forgot")} />
            )}
            {view === "forgot" && (
                <ForgotPassword onBack={() => setView("login")}
                    onSent={mail => { setEmail(mail); setView("otp"); }} />
            )}
            {view === "otp" && (
                <OtpVerification email={email} onBack={() => setView("forgot")}
                    onVerified={() => setView("update-pw")} />
            )}
            {view === "update-pw" && (
                <UpdatePassword onDone={() => setView("success")} onCancel={() => setView("login")} />
            )}
            {view === "success" && (
                <Success onLogin={() => setView("login")} />
            )}
            {view === "dashboard" && (
                <MainLayout>
                    {/* Your dashboard content goes here */}
                </MainLayout>
            )}
        </div>
    );
}