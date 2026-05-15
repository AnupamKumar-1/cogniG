import "./Sidebar.css";
import logo from "./assets/blacklogo.svg";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Sidebar() {
  const {
    allThreads, setAllThreads,
    currThreadId, user,
    setNewChat, setPrompt, setReply,
    setCurrThreadId, setPrevChats
  } = useContext(MyContext);

  const getAllThreads = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/thread`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) return;
      const threads = await response.json();
      setAllThreads(threads.map(t => ({ threadId: t.threadId, title: t.title })));
    } catch (err) {
      console.error("Network error loading threads:", err);
    }
  };

  useEffect(() => { getAllThreads(); }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    const token = localStorage.getItem("jwt");
    if (!token) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/thread/${newThreadId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) return;
      const messages = await response.json();
      setPrevChats(messages);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.error("Network error loading chat:", err);
    }
  };

  const deleteThread = async (threadId) => {
    const token = localStorage.getItem("jwt");
    if (!token) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/thread/${threadId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) return;
      setAllThreads(prev => prev.filter(t => t.threadId !== threadId));
      if (threadId === currThreadId) createNewChat();
    } catch (err) {
      console.error("Network error deleting thread:", err);
    }
  };

  return (
    <section className="sidebar">
      <div className="sidebar-header">
        <div className="brand">
          <img src={logo} alt="cogniG logo" className="brand-logo" />
          <span className="brand-name">cogni<span>G</span></span>
        </div>
        <button className="new-chat-btn" onClick={createNewChat} title="New chat">
          <i className="fa-solid fa-pen-to-square"></i>
        </button>
      </div>

      <div className="history-section">
        {allThreads?.length > 0 && (
          <>
            <div className="history-label">Recents</div>
            <ul className="history-list">
              {allThreads.map((thread, idx) => (
                <li
                  key={idx}
                  onClick={() => changeThread(thread.threadId)}
                  className={thread.threadId === currThreadId ? "highlighted" : ""}
                >
                  {thread.title}
                  <i
                    className="fa-solid fa-trash delete-btn"
                    onClick={(e) => { e.stopPropagation(); deleteThread(thread.threadId); }}
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="footer-user">
          <div className="footer-avatar">
            <i className="fa-solid fa-user"></i>
          </div>
          <span className="footer-name">{user?.username || 'Guest'}</span>
        </div>
      </div>
    </section>
  );
}

export default Sidebar;