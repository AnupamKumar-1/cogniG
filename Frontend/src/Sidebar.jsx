import "./Sidebar.css";
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
    try {
      const response = await fetch("https://cognig-backend.onrender.com/api/thread", {
        credentials: "include"
      });
      const res = await response.json();
      setAllThreads(res.map(t => ({ threadId: t.threadId, title: t.title })));
    } catch (err) {
      console.error(err);
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

  const changeThread = async newThreadId => {
    setCurrThreadId(newThreadId);
    try {
      const response = await fetch(
        `https://cognig-backend.onrender.com/api/thread/${newThreadId}`,
        { credentials: "include" }
      );
      const res = await response.json();
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteThread = async threadId => {
    try {
      const response = await fetch(
        `https://cognig-backend.onrender.com/api/thread/${threadId}`,
        { method: "DELETE", credentials: "include" }
      );
      const res = await response.json();
      setAllThreads(prev => prev.filter(t => t.threadId !== threadId));
      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img src="/assets/blacklogo.svg" alt="gpt logo" className="logo" />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li
            key={idx}
            onClick={() => changeThread(thread.threadId)}
            className={thread.threadId === currThreadId ? "highlighted" : ""}
          >
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={e => {
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
