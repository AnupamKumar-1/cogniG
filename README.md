## cogniG

A full‑stack chat application built with the MERN stack and powered by Google’s Gemini AI. cogniG provides a real‑time chat interface with streaming AI responses and persistent conversation history.

🔗 [Live Demo](http://cognig.onrender.com)

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
  B->>G: send prompt
  G-->>B: stream response
  B->>M: save messages
  B-->>F: stream chunks
  F-->>U: display messages
```

*Detailed sequence of user interaction and streaming.*

---

## Getting Started

1. **Clone repo**

   ```bash
   git clone https://github.com/your-org/cogniG.git
   cd cogniG
   ```

2. **Install & run**

   * **Backend**

     ```bash
     cd backend
     npm install
     npm run dev
     ```
   * **Frontend**

     ```bash
     cd frontend
     npm install
     npm start
     ```

---

## License

MIT
