# Spatial LLM Canvas — Frontend

React + TypeScript canvas UI where LLM conversations are displayed as nodes on an infinite, navigable graph. Built with ReactFlow.

## Prerequisites

- Node.js 18+
- npm

## Setup & Run

```bash
cd frontend
npm install
npm run dev
```

App opens at `http://localhost:5173`.

The frontend expects the backend at `http://localhost:8000`. See `../backend/README.md` to run it.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## How It Works

1. User types a message in the input bar at the bottom of the canvas.
2. A new conversation node (`DialogNode`) is created and positioned below the previous one.
3. An edge is drawn connecting the previous node to the new one.
4. The canvas camera animates to focus on the newly created node.

**Note:** In the current POC, nodes are created locally. The backend API is not yet called — responses display Lorem ipsum placeholder text.

## Project Structure

```
frontend/src/
├── main.tsx                         # React app mount point
├── App.tsx                          # Root component
├── Models/
│   ├── Node.ts                      # Node data class
│   └── Edge.ts                      # Edge data class
├── CustomHooks/
│   ├── useReactFlowChanges.ts       # ReactFlow state and change handlers
│   └── useNodeManipulation.ts       # Node creation and camera focus logic
└── Components/
    ├── Canvas/
    │   └── Canvas.tsx               # ReactFlow canvas root
    ├── DialogNode/
    │   ├── DialogNode.tsx           # Conversation card (prompt + response)
    │   └── DialogNode.css
    ├── InputPanel/
    │   ├── InputPanel.tsx           # Bottom input bar
    │   └── InputPanel.css
    └── ActionButton/
        ├── ActionButton.tsx         # Reusable icon button
        └── ActionButton.css
```

## Key Dependencies

| Package | Version | Purpose |
|---|---|---|
| `@xyflow/react` | ^12.10.0 | Infinite canvas and graph rendering |
| `react` | ^19.2.0 | UI framework |
| `lucide-react` | ^0.562.0 | Icons for action buttons |
| `typescript` | ~5.9.3 | Type safety |
| `vite` | ^7.2.4 | Build tool and dev server |

## Current State (POC)

- Input creates nodes visually but does not call the backend.
- AI response body shows Lorem ipsum placeholder text.
- Text-selection branching (the core feature) is not yet implemented.
- Node timestamps are hardcoded to "10:18 AM".
