// /Frontend/src/App.jsx
import './App.css';
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';
import { MyContext } from './MyContext.jsx';
import LoginModal from './components/LoginModal.jsx';
import { useState, useEffect } from 'react';
import { v1 as uuidv1 } from 'uuid';

function App() {
  // chat state
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  // auth state
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // on mount, verify session
  useEffect(() => {
    fetch('/auth/me', {
    credentials: 'include',
    cache: 'no-store',
  })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        } else {
          setShowModal(true);
        }
      })
      .catch(() => setShowModal(true));
  }, []);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  };

  // if not authenticated, show login modal
  if (!user) {
    return (
      <LoginModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    );
  }

  // authenticated: show chat UI
  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

export default App;