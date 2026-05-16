# Spatial LLM Canvas — CLAUDE.md

## What This Project Is

A spatial conversation UI where each LLM exchange lives as a node on an infinite canvas (built with ReactFlow). Users can branch off from any point in a conversation to create a new node, preventing the "lost in a long thread" problem common to linear chat interfaces.

**Status: Early POC.** The canvas UI is functional; the backend is wired up but not yet connected to the frontend.

## Repository Layout

```
Spatial_LLM_Canvas/
├── backend/     FastAPI + Google Gemini — REST API for LLM responses
└── frontend/    React + TypeScript + Vite + ReactFlow — canvas UI
```

## Core Concepts

- **Node**: A conversation card on the canvas. Holds `userPrompt` and (future) `response`.
- **Edge**: A directed connection between two nodes, showing conversation lineage.
- **Canvas**: The infinite ReactFlow workspace where nodes are positioned and navigated.
- **Branching**: Selecting text in a response to spawn a new child node (planned, not yet implemented).

## Current Integration Gap

The frontend (`InputPanel`) creates nodes locally but does NOT call the backend. The backend (`POST /chat/generate`) works independently. Wiring these together is the primary next task.

## Key Files

| Path | Role |
|---|---|
| `backend/main.py` | FastAPI app entry, CORS setup |
| `backend/routers/chatRouter/chatRouter.py` | `POST /chat/generate`, `GET /chat/models` |
| `backend/routers/services/GeminiLLMService.py` | Gemini API wrapper |
| `backend/routers/models/ChatModel.py` | Pydantic request/response models |
| `frontend/src/Components/Canvas/Canvas.tsx` | ReactFlow canvas root |
| `frontend/src/Components/DialogNode/DialogNode.tsx` | Conversation card UI |
| `frontend/src/Components/InputPanel/InputPanel.tsx` | User input form |
| `frontend/src/CustomHooks/useNodeManipulation.ts` | Node creation & camera focus |
| `frontend/src/CustomHooks/useReactFlowChanges.ts` | ReactFlow state management |
| `frontend/src/Models/Node.ts` | Node data class |
| `frontend/src/Models/Edge.ts` | Edge data class |

## Running Locally

See `backend/README.md` and `frontend/README.md` for setup steps.

Backend: `http://localhost:8000`
Frontend: `http://localhost:5173`
