import { useReactFlow } from "@xyflow/react";

import { Node } from "../Models/Node";
import { Edge } from "../Models/Edge";
import { useCanvasStore } from "../store/canvasStore";

const useNodeManipulation = () => {
  const { setCenter } = useReactFlow();
  const { nodes, edges, setNodes, setEdges, setNodeLoading, updateNodeResponse } = useCanvasStore();

  const getLastNode = (): Node | null => {
    if (nodes.length === 0) return null;
    return nodes[nodes.length - 1];
  };

  const addNode = async (text: string) => {
    const lastNode: Node | null = getLastNode();

    let newNode: Node;

    if (lastNode === null) {
      newNode = new Node(`n0`, { x: 0, y: 0 }, { userPrompt: text, isLoading: true });
      setNodes([newNode]);
    } else {
      newNode = new Node(
        `n${parseInt(lastNode.id.substring(1)) + 1}`,
        { x: lastNode.position.x, y: (lastNode.measured?.height ?? 0) + lastNode.position.y + 100 },
        { userPrompt: text, isLoading: true }
      );

      const newEdge = new Edge(`${lastNode.id}-${newNode.id}`, lastNode.id, newNode.id);

      setNodes([...nodes, newNode]);
      setEdges([...edges, newEdge]);
    }

    const nodeId = newNode.id;

    try {
      const res = await fetch("http://localhost:8000/chat/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, stream: true }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let firstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        if (firstChunk) {
          setNodeLoading(nodeId, false);
          firstChunk = false;
        }

        for (const line of chunk.split("\n")) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            updateNodeResponse(nodeId, parsed.content ?? line);
          } catch {
            updateNodeResponse(nodeId, line);
          }
        }
      }
    } catch (e) {
      updateNodeResponse(nodeId, "\n\n[Error: failed to get response]");
    } finally {
      setNodeLoading(nodeId, false);
    }
  };

  const focusOnNode = (nodeId: string) => {
    const nodeToFocus = nodes.find((n) => n.id === nodeId);
    if (!nodeToFocus) return;

    const x = nodeToFocus.position.x + (nodeToFocus.measured?.width ?? 0) / 2;
    const y = nodeToFocus.position.y + (nodeToFocus.measured?.height ?? 0) / 2;
    setCenter(x, y, { zoom: 1.85, duration: 1000 });
  };

  return { addNode, focusOnNode };
};

export { useNodeManipulation };
