import  { useEffect, useState } from "react";
import { Cancel01Icon, Alert01Icon, CheckmarkCircle01Icon } from "hugeicons-react";
import "../style/toast.css";

export default function Toast({ message, type = "error", onClose, duration = 4000 }) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Start the timer to auto-close
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(onClose, 300); // Wait 300ms for slide-out animation to finish
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`toast-container ${isClosing ? "toast-slide-out" : "toast-slide-in"}`}>
      <div className="toast-content">
        {type === "error" 
          ? <Alert01Icon color="#e74c3c" variant="solid" /> 
          : <CheckmarkCircle01Icon color="#22c55e" variant="solid" />
        }
        <span className="toast-message">{message}</span>
        
        <button type="button" className="toast-close" onClick={handleClose}>
          <Cancel01Icon size={18} />
        </button>
      </div>
      
      {/* The slider timer at the bottom */}
      <div className="toast-progress">
        <div
          className={`toast-progress-bar ${type}`}
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
}