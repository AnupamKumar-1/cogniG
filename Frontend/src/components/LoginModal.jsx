
import React from "react";
import "./LoginModal.css";

export default function LoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Login to Start Exploring</h2>
        <a
          href="https://cognig-backend.onrender.com/auth/github"
          className="btn btn-github"
        >
          <img
            src="/vite.svg"
            alt="GitHub logo"
            className="github-logo"
          />
          Login with GitHub
        </a>
        <button
          className="modal-close"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
}
