import React from "react";
import "./LoginModal.css";

export default function LoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="modal-logo">cogni<span>G</span></div>
        <div className="modal-sub">sign in to continue</div>

        <a
          href="https://cognig-backend.onrender.com/auth/github"
          className="btn-github"
        >
          <i className="fa-brands fa-github github-icon"></i>
          Continue with GitHub
        </a>

        <p className="modal-terms">by continuing you agree to our terms of service</p>
      </div>
    </div>
  );
}