
## cogniG

A full‑stack chat application built with the MERN stack and powered by Google’s Gemini AI. cogniG provides a real‑time chat interface with streaming AI responses and persistent conversation history.

🔗 [Live Demo](https://cognig.onrender.com)

---

## Tech Stack

| Layer    | Technology         |
| -------- | ------------------ |
| Frontend | React              |
| Backend  | Node.js, Express   |
| Database | MongoDB            |
| AI       | Google Gemini API  |
| Auth     | GitHub OAuth       |

---

## Architecture

```mermaid
flowchart LR
  subgraph Auth["Authentication"]
    U[User Browser] -->|Login w/ GitHub| GH[GitHub OAuth]
    GH -->|OAuth Callback| B[Express Backend]
    B -->|Issue JWT| U
  end

  U -->|HTTP POST /api/chat with JWT| F[React Frontend]
  F -->|HTTP POST /api/chat| B[Express Backend]
  B -->|Gemini SDK| G[Google Gemini API]
  G -->|Response Stream| B
  B -->|CRUD| D[MongoDB]
  D --> B
  B -->|Stream| F
  F --> U
```

*High‑level data and request flow.*

---

## Control Flow

```mermaid
sequenceDiagram
  participant U as User
  participant GH as GitHub
  participant F as Frontend
  participant B as Backend
  participant G as Gemini
  participant M as MongoDB

  U->>GH: Login via GitHub
  GH-->>B: OAuth code
  B->>GH: Exchange code for access token
  B-->>U: Issue JWT
  U->>F: Attach JWT
  F->>B: POST /api/chat {prompt} + JWT
  B->>G: send prompt
  G-->>B: stream response chunks
  B->>M: save message
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

```

