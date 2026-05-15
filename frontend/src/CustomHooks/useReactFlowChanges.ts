import { useState, useCallback } from 'react';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';

import { Node } from '../Models/Node';
import { Edge } from '../Models/Edge';

const useReactFlowChanges = () => {
  const initialNode: Node[] = []
  const initialEdge: Edge[] = []

  const [nodes, setNodes] = useState(initialNode);
  const [edges, setEdges] = useState(initialEdge);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  return { nodes, edges, onNodesChange, onEdgesChange, onConnect, setNodes, setEdges };
}

export { useReactFlowChanges };