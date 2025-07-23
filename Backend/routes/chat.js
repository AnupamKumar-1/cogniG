import express from "express";
import Thread from "../models/Thread.js";
import getGeminiResponse from "../utils/getGeminiResponse.js";
import { ensureAuthenticated } from "./auth.js";

const router = express.Router();


router.get("/thread", ensureAuthenticated, async (req, res) => {
  try {
    const threads = await Thread.find({ author: req.user._id }).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});


router.get("/thread/:threadId", ensureAuthenticated, async (req, res) => {
  try {
    const thread = await Thread.findOne({ threadId: req.params.threadId, author: req.user._id });
    if (!thread) return res.status(404).json({ error: "Thread not found" });
    res.json(thread.messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});


router.delete("/thread/:threadId", ensureAuthenticated, async (req, res) => {
  try {
    const deleted = await Thread.findOneAndDelete({ threadId: req.params.threadId, author: req.user._id });
    if (!deleted) return res.status(404).json({ error: "Thread not found" });
    res.json({ success: "Thread deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete thread" });
  }
});


router.post("/chat", ensureAuthenticated, async (req, res) => {
  const { threadId, message } = req.body;
  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId, author: req.user._id });
    if (!thread) {
      thread = new Thread({
        threadId,
        title: message.length > 50 ? message.slice(0, 50) + "…" : message,
        messages: [{ role: "user", content: message }],
        author: req.user._id,
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getGeminiResponse(message);
    if (!assistantReply) {
      return res.status(500).json({ error: "AI did not return a valid reply" });
    }

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();
    await thread.save();

    res.json({ reply: assistantReply });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
