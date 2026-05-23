import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';

import { Node } from '../Models/Node';
import { Edge } from '../Models/Edge';

interface CanvasStore {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (params: any) => void;
  updateNodeResponse: (nodeId: string, chunk: string) => void;
  setNodeLoading: (nodeId: string, loading: boolean) => void;
}

const useCanvasStore = create<CanvasStore>((set) => ({
  nodes: [],
  edges: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) =>
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) as Node[] })),

  onEdgesChange: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) as Edge[] })),

  onConnect: (params) =>
    set((state) => ({ edges: addEdge(params, state.edges) as Edge[] })),

  updateNodeResponse: (nodeId, chunk) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, response: (n.data.response ?? '') + chunk } }
          : n
      ),
    })),

  setNodeLoading: (nodeId, loading) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, isLoading: loading } } : n
      ),
    })),
}));

export { useCanvasStore };
