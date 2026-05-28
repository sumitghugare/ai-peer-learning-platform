# 🎓 AI Peer Learning Platform

<div align="center">

![Platform Banner](https://img.shields.io/badge/AI%20Peer%20Learning-Platform-blueviolet?style=for-the-badge&logo=graduation-cap)

**A community-driven Q&A platform powered by AI — Ask smarter, Learn together.**

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Reference](#-api-reference)
- [AI / NLP Features](#-ai--nlp-features)
- [Environment Variables](#-environment-variables)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**AI Peer Learning Platform** is a full-stack web application that enables students and learners to ask questions, receive community answers, and benefit from AI-driven duplicate detection — making learning more efficient and collaborative.

Inspired by platforms like Stack Overflow, this project goes a step further by integrating **sentence-transformer embeddings** and **cosine similarity** to intelligently detect duplicate questions before they are posted, reducing noise and improving the quality of the knowledge base.

> 💡 *"Learn Together. Solve Doubts Faster."*

---

## 📸 Screenshots

### 🏠 Home Page
> Browse the latest community questions with a clean dark-themed interface and quick search.

![Home Page](screenshot/Home%20Page.png)

---

### 🔍 Search & Tag Filtering
> Filter questions in real-time by keyword or tag to find answers instantly.

![Search and Tag Filtering](screenshot/Search%20and%20Tag%20Filtering.png)

---

### 🤖 AI Duplicate Detection
> Before submitting, the AI warns you if a similar question already exists — with a similarity score.

![AI Duplicate Detection](screenshot/AI%20Duplicate%20Detection.png)

---

### ⭐ AI Recommended Answers
> The top-voted, most helpful answer is highlighted with an **AI Recommended** badge.

![AI Recommended Answers](screenshot/AI%20Recommended%20Answers.png)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure signup & login with bcrypt password hashing and JWT tokens |
| ❓ **Ask Questions** | Post questions with title, body, and tags |
| 💬 **Answer Questions** | Community members can answer any posted question |
| 👍 **Voting System** | Upvote/downvote answers; toggle or switch votes |
| 🔍 **Search & Filter** | Search questions by keyword or filter by tag |
| 🤖 **AI Duplicate Detection** | Sentence-level semantic similarity check before question submission |
| ⭐ **AI Recommended Badge** | Top-voted answer is highlighted as AI Recommended |
| 🏅 **Reputation System** | Users build reputation through community engagement |
| 📱 **Responsive UI** | Dark-themed, modern interface built with Tailwind CSS |

---

## 🛠 Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Framework | [FastAPI](https://fastapi.tiangolo.com/) |
| Database | SQLite via [SQLAlchemy](https://www.sqlalchemy.org/) ORM |
| Authentication | JWT (`python-jose`) + bcrypt (`passlib`) |
| NLP / AI | `sentence-transformers` (`all-MiniLM-L6-v2`) + `scikit-learn` |

### Frontend
| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | React 19 Hooks |

---

## 📁 Project Structure

```
ai-peer-learning-platform/
│
├── screenshot/
│   ├── Home Page.png
│   ├── Search and Tag Filtering.png
│   ├── AI Duplicate Detection.png
│   └── AI Recommended Answers.png
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py          # App configuration
│   │   │   └── security.py        # JWT creation, password hashing
│   │   ├── dependencies/
│   │   │   └── auth.py            # Auth dependency (get_current_user)
│   │   ├── models/
│   │   │   ├── user.py            # User SQLAlchemy model
│   │   │   ├── question.py        # Question model (with embedding field)
│   │   │   ├── answer.py          # Answer model
│   │   │   └── vote.py            # Vote model
│   │   ├── nlp/
│   │   │   ├── duplicate_detector.py  # Cosine similarity duplicate finder
│   │   │   └── embedding.py           # Sentence embedding generator
│   │   ├── routes/
│   │   │   ├── auth.py            # /auth/signup, /auth/login
│   │   │   ├── question.py        # CRUD + search + duplicate check
│   │   │   ├── answer.py          # Post & retrieve answers
│   │   │   └── vote.py            # Vote & get vote count
│   │   ├── schemas/               # Pydantic request/response schemas
│   │   ├── database.py            # DB engine & session setup
│   │   └── main.py                # App entry point, CORS, router registration
│   ├── nlp_demo.py                # Standalone NLP demo script
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx               # Home / Feed page
│   │   ├── login/page.tsx         # Login page
│   │   ├── signup/page.tsx        # Signup page
│   │   ├── ask/page.tsx           # Ask a Question page
│   │   └── question/[id]/page.tsx # Question detail + answers
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── AnswerCard.tsx
│   │   ├── AuthInput.tsx
│   │   └── UserBadge.tsx
│   ├── services/
│   │   └── api.ts                 # Centralized API service layer
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Python** `3.10+`
- **Node.js** `18+` and **npm**
- **Git**

---

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/sumitghugare/ai-peer-learning-platform.git
cd ai-peer-learning-platform/backend

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the FastAPI server
uvicorn app.main:app --reload --port 8000
```

The backend will be running at: **http://localhost:8000**

Interactive API docs available at: **http://localhost:8000/docs**

---

### Frontend Setup

```bash
# Navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be running at: **http://localhost:3000**

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/signup` | Register a new user | ❌ |
| `POST` | `/auth/login` | Login and receive JWT token | ❌ |

### Questions

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/questions/` | Get all questions | ❌ |
| `POST` | `/questions/` | Create a new question | ✅ |
| `GET` | `/questions/search?q=&tag=` | Search questions by keyword/tag | ❌ |
| `GET` | `/questions/check-duplicate` | Check for semantically similar questions | ❌ |
| `GET` | `/questions/{id}` | Get a single question | ❌ |

### Answers

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/answers/` | Post an answer | ✅ |
| `GET` | `/answers/{question_id}` | Get answers for a question | ❌ |

### Votes

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/votes/` | Upvote or downvote an answer | ✅ |
| `GET` | `/votes/answer/{answer_id}` | Get vote score for an answer | ❌ |

---

## 🤖 AI / NLP Features

This platform uses **Sentence Transformers** to add AI-powered features:

### Duplicate Question Detection

Before a question is submitted, the backend:

1. Generates a **384-dimensional sentence embedding** for the new question using `all-MiniLM-L6-v2`
2. Computes **cosine similarity** against embeddings of all existing questions
3. Returns the **top 3 most similar questions** if similarity ≥ `0.65`

This prevents redundant questions and helps users find existing answers faster.

```python
# Example response from /questions/check-duplicate
[
  { "id": 12, "title": "How does backpropagation work?", "similarity": 0.91 },
  { "id": 7,  "title": "Explain gradient descent", "similarity": 0.74 }
]
```

### AI Recommended Badge

The answer with the highest vote score on a question is automatically highlighted with a green **🟢 AI Recommended** badge, making it easy for learners to identify the best answer at a glance.

### Embedding Storage

Each question's embedding is serialized to JSON and stored in the `embedding` column of the `questions` table, enabling fast similarity lookups without re-computing embeddings at query time.

---

## 🔐 Environment Variables

Create a `.env` file in `/backend/app/core/` or update `security.py` with your own values:

```env
SECRET_KEY=your_super_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

> ⚠️ **Important:** Never commit your real `SECRET_KEY` to version control. Rotate it before deploying to production.

---

## 🗺 Roadmap

- [x] User Authentication (Signup / Login / JWT)
- [x] Question CRUD with tag support
- [x] Answer posting and retrieval
- [x] Voting system (upvote / downvote / toggle)
- [x] Keyword + tag-based search
- [x] AI duplicate question detection
- [x] Semantic question embeddings stored in DB
- [x] AI Recommended answer badge
- [ ] User profile pages with reputation display
- [ ] Notifications system
- [ ] Question bookmarking
- [ ] Markdown support in questions and answers
- [ ] Admin moderation panel
- [ ] Containerization (Docker + Docker Compose)
- [ ] Deployment to cloud (Render / Vercel)

---

## 🤝 Contributing

Contributions are welcome! To get started:

```bash
# Fork the repo and create your feature branch
git checkout -b feature/your-feature-name

# Commit your changes
git commit -m "feat: add your feature description"

# Push to your fork and open a Pull Request
git push origin feature/your-feature-name
```

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by **sumitghugare**

⭐ Star this repo if you found it helpful!

</div>
