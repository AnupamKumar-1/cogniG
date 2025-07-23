import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);

    const response = await fetch("https://cognig-backend.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message: prompt, threadId: currThreadId })
    });

    const clone = response.clone();
    let data;
    try {
      data = await response.json();
    } catch (parseErr) {
      console.error("Failed to parse JSON:", parseErr);
      const text = await clone.text();
      console.error("Raw response:", text);
      setLoading(false);
      return;
    }

    if (!response.ok) {
      console.error("Server error:", data);
      setLoading(false);
      return;
    }

    setReply(data.reply);
    setLoading(false);
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats(prev => [
        ...prev,
        { role: "user", content: prompt },
        { role: "assistant", content: reply }
      ]);
      setPrompt("");
    }
  }, [reply]);

  const handleProfileClick = () => setIsOpen(open => !open);

  async function handleLogout() {
    try {
      const res = await fetch("https://cognig-backend.onrender.com/auth/logout", {
        method: "GET",
        credentials: "include"
      });
      if (res.ok) window.location.href = "/";
      else console.error("Logout failed:", await res.text());
    } catch (err) {
      console.error("Network error on logout:", err);
    }
  }

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>cogniG <i className="fa-solid fa-chevron-down"></i></span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon"><i className="fa-solid fa-user"></i></span>
        </div>
      </div>

      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
          <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
          <div className="dropDownItem" onClick={handleLogout}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
          </div>
        </div>
      )}

      <Chat />

      <ScaleLoader color="#fff" loading={loading} />

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && getReply()}
          />
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          cogniG can make mistakes. Check important info. See Cookie Preferences.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
