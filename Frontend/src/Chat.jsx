import "./Chat.css";
import { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (reply === null) { setLatestReply(null); return; }
        if (!prevChats?.length) return;

        const text = reply.text ?? reply;
        const words = text.split(" ");
        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(words.slice(0, idx + 1).join(" "));
            idx++;
            if (idx >= words.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);
    }, [prevChats, reply]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [prevChats, latestReply]);

    if (newChat && !prevChats?.length) {
        return (
            <div className="chat-empty">
                <div className="empty-mark">cogniG</div>
                <div className="empty-tagline">start a new conversation</div>
            </div>
        );
    }

    return (
        <div className="chats">
            {prevChats?.slice(0, -1).map((chat, idx) => (
                <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
                    {chat.role === "user"
                        ? <div className="userMessage">
                            {chat.image && (
                                <img src={chat.image} alt="uploaded" className="chat-image-preview" />
                            )}
                            <p>{chat.content}</p>
                        </div>
                        : <div><ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown></div>
                    }
                </div>
            ))}

            {prevChats?.length > 0 && (
                <div className="gptDiv">
                    <div>
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                            {latestReply === null ? prevChats[prevChats.length - 1].content : latestReply}
                        </ReactMarkdown>
                    </div>
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    );
}

export default Chat;