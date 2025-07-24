## cogniG

A full‑stack chat application built with the MERN stack and powered by Google’s Gemini AI. cogniG provides a real‑time chat interface with streaming AI responses and persistent conversation history.

---

## Tech Stack

| Layer    | Technology        |
| -------- | ----------------- |
| Frontend | React             |
| Backend  | Node.js, Express  |
| Database | MongoDB           |
| AI       | Google Gemini API |

---

## Architecture

```mermaid
flowchart LR
  A[React Frontend] -->|HTTP POST /api/chat| B[Express Backend]
  B -->|Gemini SDK| C[Google Gemini API]
  C -->|Response Stream| B
  B -->|CRUD| D[MongoDB]
  D --> B
  B -->|Stream| A
```

*High‑level data and request flow.*

---

## Control Flow

```mermaid
sequenceDiagram
  participant U as User
  participant F as Frontend
  participant B as Backend
  participant G as Gemini
  participant M as MongoDB

  U->>F: enter prompt
  F->>B: POST /api/chat {prompt, sessionId}
  B->>G: send prompt to Gemini
  G-->>B: stream response chunks
  B->>M: save message to MongoDB
  B-->>F: stream chunks to frontend
  F-->>U: display messages in UI
```
