import "./Sidebar.css";
import logo from "../assets/blacklogo.svg";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats
  } = useContext(MyContext);

  const getAllThreads = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      console.error("No JWT found, please log in again.");
      return;
    }

    try {
      const response = await fetch(
        "https://cognig-backend.onrender.com/api/thread",
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      if (!response.ok) {
        const err = await response.json();
        console.error("Failed to load threads:", err);
        return;
      }
      const threads = await response.json();
      setAllThreads(
        threads.map(t => ({ threadId: t.threadId, title: t.title }))
      );
    } catch (err) {
      console.error("Network error loading threads:", err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

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
    if (!token) {
      console.error("No JWT found, please log in again.");
      return;
    }

    try {
      const response = await fetch(
        `https://cognig-backend.onrender.com/api/thread/${newThreadId}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      if (!response.ok) {
        const err = await response.json();
        console.error("Failed to load chat:", err);
        return;
      }
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
    if (!token) {
      console.error("No JWT found, please log in again.");
      return;
    }

    try {
      const response = await fetch(
        `https://cognig-backend.onrender.com/api/thread/${threadId}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      if (!response.ok) {
        const err = await response.json();
        console.error("Failed to delete thread:", err);
        return;
      }
      await response.json();
      setAllThreads(prev => prev.filter(t => t.threadId !== threadId));
      if (threadId === currThreadId) createNewChat();
    } catch (err) {
      console.error("Network error deleting thread:", err);
    }
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
       <img src={logo} alt="cogniG logo" className="logo" />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li
            key={idx}
            onClick={() => changeThread(thread.threadId)}
            className={
              thread.threadId === currThreadId ? "highlighted" : ""
            }
          >
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>Anupam Kr &hearts;</p>
      </div>
    </section>
  );
}

export default Sidebar;
