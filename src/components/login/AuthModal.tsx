
import { useState } from "react";
import "./AuthModal.css";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        {mode === "login" ? (
          <LoginForm
            onSwitch={() => setMode("register")}
            onSuccess={onClose}
          />
        ) : (
          <RegisterForm
            onSwitch={() => setMode("login")}
            onSuccess={onClose}
          />
        )}
      </div>
    </div>
  );
}
