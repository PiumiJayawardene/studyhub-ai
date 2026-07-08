# StudyHub AI

An AI-powered study companion designed to help students organize their learning, create smart study materials, and interact with their notes using Retrieval-Augmented Generation (RAG).

**Live Demo:** https://studyhub-ai-omega.vercel.app

---

## Overview

StudyHub AI is a modern web application that combines note management, AI-assisted learning, spaced repetition, quizzes, assignment tracking, document management, analytics, and intelligent chat into a single platform.

Instead of switching between multiple study tools, students can manage their entire learning workflow in one place while leveraging AI to improve understanding and retention.

---

## Features

### Authentication

- Secure email/password authentication
- Protected dashboard
- User-specific data isolation

### Dashboard

- Learning progress overview
- Assignment statistics
- Flashcard review summary
- Recent activity
- Study analytics

### Subject Management

- Create, edit and delete subjects
- Custom subject colors
- Custom subject icons

### Smart Notes

- Rich text editor
- Automatic saving
- Subject organization
- AI-powered note indexing

### Flashcards

- Manual flashcard creation
- AI-generated flashcards from notes
- Review mode
- Progress tracking

### Quizzes

- AI-generated quizzes
- Multiple-choice questions
- Instant scoring
- Review answers

### Assignments

- Deadline management
- Priority levels
- Status tracking
- Progress updates

### AI Chat

- Ask questions about your notes
- Retrieval-Augmented Generation (RAG)
- Context-aware responses
- Semantic search using embeddings

### Document Upload

Supports:

- DOCX
- TXT

Uploaded documents are automatically processed, indexed, and become searchable through AI Chat.

### Analytics

- Study statistics
- Assignment progress
- Flashcard completion
- Quiz performance
- Learning insights

### Modern User Experience

- Responsive layout
- Light/Dark mode
- Smooth page transitions
- Accessible components
- Keyboard navigation support

---

# Tech Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- TipTap Editor
- Recharts

## Backend

- Next.js Server Actions
- Supabase

## Database

- PostgreSQL
- pgvector

## Authentication

- Supabase Auth

## AI

- Groq LLM
- Voyage AI Embeddings
- Retrieval-Augmented Generation (RAG)

## Storage

- Supabase Storage

## Deployment

- Vercel

---

# Architecture

```
                User
                  │
                  ▼
        Next.js Application
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
 Supabase Database     AI Services
        │              ┌──────────────┐
        │              │ Groq LLM      │
        │              │ Voyage AI     │
        │              └──────────────┘
        │
        ▼
 Semantic Search (pgvector)
        │
        ▼
 Context Retrieval
        │
        ▼
 AI Response
```

---

# AI Workflow

1. User creates or uploads study material.
2. Text is extracted and cleaned.
3. Content is split into semantic chunks.
4. Voyage AI generates vector embeddings.
5. Embeddings are stored in pgvector.
6. User asks a question.
7. Semantic search retrieves relevant chunks.
8. Context is sent to Groq.
9. AI generates an informed response.

---

# Project Structure

```
src
│
├── app
├── components
│   ├── assignments
│   ├── analytics
│   ├── documents
│   ├── flashcards
│   ├── notes
│   ├── quizzes
│   ├── shared
│   └── ui
│
├── lib
│   ├── actions
│   ├── rag
│   ├── documents
│   ├── supabase
│   └── utils
│
├── config
├── hooks
├── types
└── styles
```

---

# Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/studyhub-ai.git
```

Navigate into the project

```bash
cd studyhub-ai
```

Install dependencies

```bash
npm install
```

Create an environment file

```
.env.local
```

Add the following variables

```env
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

NEXT_PUBLIC_SITE_URL=

GROQ_API_KEY=

VOYAGE_API_KEY=
```

Run the development server

```bash
npm run dev
```

Production build

```bash
npm run build
```

---

# Screenshots

> Add screenshots here after capturing the application.

- Dashboard
- Notes
- AI Chat
- Flashcards
- Quizzes
- Assignments
- Analytics
- Documents

---

# Challenges Solved

- Built a Retrieval-Augmented Generation (RAG) pipeline.
- Integrated semantic search using vector embeddings.
- Designed AI-powered study workflows.
- Implemented automatic note indexing.
- Developed responsive and accessible UI components.
- Optimized document processing and search.

---

# Future Improvements

- PDF OCR support
- AI-generated study plans
- Calendar synchronization
- Collaborative workspaces
- Mobile application
- Offline support
- Voice-based AI assistant
- Personalized learning recommendations

---
