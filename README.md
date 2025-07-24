[![Build Status](https://github.com/your-org/cogniG/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/cogniG/actions)
[![npm version](https://img.shields.io/npm/v/cognig.svg)](https://www.npmjs.com/package/cognig)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![GitHub OAuth](https://img.shields.io/badge/Auth-GitHub_OAuth-181717?logo=github&logoColor=white)](https://docs.github.com/en/developers/apps/building-oauth-apps)

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

## Data Model

```js
// Message document
{
  _id,
  sessionId: String,
  role: 'user' | 'assistant',
  text: String,
  timestamp: Date
}
```

---

## Getting Started

1. **Clone repo**

   ```bash
   git clone https://github.com/your-org/cogniG.git
   cd cogniG
   ```

2. **Set up env**

   ```bash
   cp .env.example .env
   # fill in MONGODB_URI and GEMINI_API_KEY
   ```

3. **Install & run**

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
