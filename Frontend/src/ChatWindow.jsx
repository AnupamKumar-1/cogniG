import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import { ScaleLoader } from "react-spinners";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function ChatWindow() {
  const {
    prompt, setPrompt,
    reply, setReply,
    currThreadId,
    setPrevChats, setNewChat
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage({ base64: reader.result.split(",")[1], mimeType: file.type });
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    fileInputRef.current.value = "";
  };

  const getReply = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setNewChat(false);
    const token = localStorage.getItem('jwt');
    if (!token) { setLoading(false); return; }

    const currentImagePreview = imagePreview;

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          message: prompt,
          threadId: currThreadId,
          imageBase64: image?.base64 || null,
          imageMimeType: image?.mimeType || null,
        })
      });

      const clone = response.clone();
      let data;
      try {
        data = await response.json();
      } catch {
        const text = await clone.text();
        console.error("Raw response:", text);
        setLoading(false);
        return;
      }

      if (!response.ok) { setLoading(false); return; }
      setReply({ text: data.reply, image: currentImagePreview });
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Network error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats(prev => [
        ...prev,
        { role: "user", content: prompt, image: reply.image },
        { role: "assistant", content: reply.text }
      ]);
      setPrompt("");
      setReply(null);
    }
  }, [reply]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    window.location.href = '/';
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <div className="navbar-model">
          <span>cogniG</span>
          <i className="fa-solid fa-chevron-down"></i>
        </div>
        <div className="navbar-actions">
          <div className="user-btn" onClick={() => setIsOpen(o => !o)}>
            <i className="fa-solid fa-user"></i>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i className="fa-solid fa-gear"></i> Settings
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan
          </div>
          <div className="dropdown-divider" />
          <div className="dropDownItem danger" onClick={handleLogout}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
          </div>
        </div>
      )}

      <div className="chat-body">
        <Chat />
      </div>

      <div className="loader-wrap">
        <ScaleLoader loading={loading} color="var(--accent)" height={14} width={2} radius={2} margin={2} />
      </div>

      <div className="chat-footer">
        <div className="input-wrap">
          {imagePreview && (
            <div className="image-preview-wrap">
              <img src={imagePreview} alt="preview" className="image-preview" />
              <button className="remove-image-btn" onClick={removeImage}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}
          <input
            className="chat-input"
            placeholder="Ask anything..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && getReply()}
          />
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          <button
            className="attach-btn"
            onClick={() => fileInputRef.current.click()}
            disabled={loading}
          >
            <i className="fa-solid fa-paperclip"></i>
          </button>
          <button
            className="send-btn"
            onClick={getReply}
            disabled={loading || !prompt.trim()}
          >
            <i className="fa-solid fa-arrow-up"></i>
          </button>
        </div>
        <p className="footer-hint">cogniG can make mistakes — verify important information.</p>
      </div>
    </div>
  );
}

export default ChatWindow;