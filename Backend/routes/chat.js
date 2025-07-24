import express from "express";
import Thread from "../models/Thread.js";
import getGeminiResponse from "../utils/getGeminiResponse.js";
import { ensureAuthenticated } from "./auth.js";

const router = express.Router();


router.get(
  "/thread",
  ensureAuthenticated,
  async (req, res) => {
    try {
      const threads = await Thread
        .find({ author: req.user.id })
        .sort({ updatedAt: -1 });
      return res.json(threads);
    } catch (err) {
      console.error("Error in GET /api/thread:", err);
      return res.status(500).json({
        error: "Failed to fetch threads",
        details: err.message
      });
    }
  }
);

// Fetch messages for a given thread
router.get(
  "/thread/:threadId",
  ensureAuthenticated,
  async (req, res) => {
    try {
      const thread = await Thread.findOne({
        threadId: req.params.threadId,
        author: req.user.id
      });
      if (!thread) {
        return res.status(404).json({ error: "Thread not found" });
      }
      return res.json(thread.messages);
    } catch (err) {
      console.error("Error in GET /api/thread/:threadId:", err);
      return res.status(500).json({
        error: "Failed to fetch chat",
        details: err.message
      });
    }
  }
);

// Delete a thread
router.delete(
  "/thread/:threadId",
  ensureAuthenticated,
  async (req, res) => {
    try {
      const deleted = await Thread.findOneAndDelete({
        threadId: req.params.threadId,
        author: req.user.id
      });
      if (!deleted) {
        return res.status(404).json({ error: "Thread not found" });
      }
      return res.json({ success: "Thread deleted successfully" });
    } catch (err) {
      console.error("Error in DELETE /api/thread/:threadId:", err);
      return res.status(500).json({
        error: "Failed to delete thread",
        details: err.message
      });
    }
  }
);

// Post a new message and stream back the AI reply
router.post(
  "/chat",
  ensureAuthenticated,
  async (req, res) => {
    const { threadId, message } = req.body;
    if (!threadId || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // find-or-create thread
      let thread = await Thread.findOne({
        threadId,
        author: req.user.id
      });
      if (!thread) {
        thread = new Thread({
          threadId,
          title:
            message.length > 50
              ? message.slice(0, 50) + "…"
              : message,
          messages: [{ role: "user", content: message }],
          author: req.user.id
        });
      } else {
        thread.messages.push({ role: "user", content: message });
      }

      // get AI reply
      const assistantReply = await getGeminiResponse(message);
      if (!assistantReply) {
        return res.status(502).json({
          error: "AI did not return a valid reply"
        });
      }

      thread.messages.push({
        role: "assistant",
        content: assistantReply
      });
      thread.updatedAt = new Date();
      await thread.save();

      return res.json({ reply: assistantReply });
    } catch (err) {
      console.error("Error in POST /api/chat:", err);
      return res.status(500).json({
        error: "Internal Server Error",
        details: err.message
      });
    }
  }
);

export default router;
