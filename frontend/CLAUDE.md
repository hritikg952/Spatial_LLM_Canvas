# Frontend — CLAUDE.md

## Stack

- **React** 19.2 + **TypeScript** 5.9 — UI framework
- **Vite** 7.2 — dev server and build tool
- **@xyflow/react** 12.10 — graph/canvas library (ReactFlow)
- **lucide-react** — icon set used in DialogNode action buttons

## Directory Layout

```
frontend/src/
├── main.tsx                          # React app mount point
├── App.tsx                           # Root component (renders Canvas)
├── Models/
│   ├── Node.ts                       # Node class: id, type, position, data, measured
│   └── Edge.ts                       # Edge class: id, source, target
├── CustomHooks/
│   ├── useReactFlowChanges.ts        # ReactFlow nodes/edges state + change handlers
│   └── useNodeManipulation.ts        # addNode(), focusOnNode()
└── Components/
    ├── Canvas/
    │   └── Canvas.tsx                # ReactFlow canvas, registers nodeTypes
    ├── DialogNode/
    │   ├── DialogNode.tsx            # Conversation card (user prompt + AI response)
    │   └── DialogNode.css
    ├── InputPanel/
    │   ├── InputPanel.tsx            # Fixed bottom input bar, calls addNode()
    │   └── InputPanel.css
    └── ActionButton/
        ├── ActionButton.tsx          # Icon+label button used in DialogNode footer
        └── ActionButton.css
```

## Data Model

### Node (`Models/Node.ts`)
```ts
{
  id: string           // "n0", "n1", ...
  type: "dialogNode"
  position: { x, y }
  data: { userPrompt: string; response?: string }
  measured?: { width: number; height: number }  // set by ReactFlow after first render
}
```

### Edge (`Models/Edge.ts`)
```ts
{ id: string; source: string; target: string }
```

## Component Responsibilities

### Canvas (`Canvas.tsx`)
- Owns the ReactFlow instance.
- Composes `useReactFlowChanges` (state) + `useNodeManipulation` (mutations).
- Registers `dialogNode` as the only custom node type.
- Renders `InputPanel` inside the ReactFlow `Panel`.

### DialogNode (`DialogNode.tsx`)
- Receives the full `Node` object as props from ReactFlow.
- Displays `data.userPrompt` in the header.
- Displays `data.response` in the body (currently appended with Lorem ipsum placeholder text — backend not connected).
- Footer: Copy / ThumbsUp / ThumbsDown / Regenerate action buttons.
- Has ReactFlow `Handle` connectors: `target` at top, `source` at bottom.

### InputPanel (`InputPanel.tsx`)
- Fixed panel at the bottom center of the canvas.
- On submit: calls `addNode(text)` from `useNodeManipulation`.
- Has a 1-second simulated loading state (no real API call yet).
- Submit on Enter key or Send button.

### useReactFlowChanges (`CustomHooks/useReactFlowChanges.ts`)
- Holds `nodes` and `edges` state.
- Exposes `onNodesChange`, `onEdgesChange`, `onConnect` handlers for ReactFlow callbacks.
- Exposes `setNodes`, `setEdges` for imperative updates.

### useNodeManipulation (`CustomHooks/useNodeManipulation.ts`)
- `addNode(text)`: creates a new Node below the last node, creates an Edge linking them, updates state.
- `focusOnNode(nodeId)`: animates camera to center on a node using `setCenter`.
- Node IDs are sequential: `n0`, `n1`, `n2`, ...
- New node Y position = previous node's `measured.height + 100` (stacks vertically).

## Current POC Gaps

- **No backend call**: `InputPanel` does not hit `/chat/generate`. Response stays as Lorem ipsum placeholder.
- **No text-selection branching**: The core feature (select text → branch to new node) is not implemented.
- **Hardcoded timestamp**: DialogNode shows "10:18 AM" for all nodes.
- **No conversation history**: Each `/chat/generate` call would be a single-turn exchange; multi-turn context threading is not designed yet.
- **console.log debug output**: Several components log to console — should be removed before any demo.
