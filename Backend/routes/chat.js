import express from "express";
import Thread from "../models/Thread.js";
import getGeminiResponse from "../utils/getGeminiResponse.js";
import { ensureAuthenticated } from "./auth.js";

const router = express.Router();

router.use(ensureAuthenticated);

router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

router.get("/thread/:threadId", async (req, res) => {
  try {
    const thread = await Thread.findOne({ threadId: req.params.threadId, userId: req.user._id });
    if (!thread) return res.status(404).json({ error: "Thread not found" });
    res.json(thread.messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

router.delete("/thread/:threadId", async (req, res) => {
  try {
    const deleted = await Thread.findOneAndDelete({ threadId: req.params.threadId, userId: req.user._id });
    if (!deleted) return res.status(404).json({ error: "Thread not found or not yours" });
    res.json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;
  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId, userId: req.user._id });
    if (!thread) {
      thread = new Thread({
        userId: req.user._id,
        threadId,
        title: message.length > 50 ? message.slice(0, 50) + "…" : message,
        messages: [{ role: "user", content: message }]
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
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
