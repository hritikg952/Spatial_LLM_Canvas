import { useReactFlow } from "@xyflow/react";

import { Node } from "../Models/Node";
import { Edge } from "../Models/Edge";

const useNodeManipulation = (
  nodes: Node[],
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
) => {
  const { setCenter } = useReactFlow();

  const getLastNode = (): Node | null => {
    if (nodes.length === 0) {
      return null;
    }
    return nodes[nodes.length - 1];
  };

  const addNode = (text: string) => {
    // Add a new node with the input text as its label
    const lastNode: Node | null = getLastNode();

    if (lastNode === null) {
      const newNode = new Node(
        `n0`, // ID
        { x: 0, y: 0 }, // Position
        { userPrompt: text }, // Data
        "dialogNode" // Type
      );
      setNodes((nds) => nds.concat(newNode));
      return;
    }

    console.log("Last node found:", lastNode);

    const newNode = new Node(
      `n${parseInt(lastNode.id.substring(1)) + 1}`,
      { x: lastNode.position.x, y: (lastNode.measured?.height ?? 0) + 100 },
      { userPrompt: text },
      "dialogNode"
    );

    console.log("New node:", newNode);

    const newEdge = new Edge(
      `${lastNode.id}-${newNode.id}`, // ID
      lastNode.id, // Source
      newNode.id // Target
    );

    setNodes((nds) => nds.concat(newNode));
    setEdges((eds) => eds.concat(newEdge));

    focusOnNode(newNode.id);
  };

  const focusOnNode = (nodeId: string) => {
    const nodeToFocus = nodes.find((n) => n.id === nodeId);

    if (!nodeToFocus) return;

    const x = nodeToFocus.position.x + nodeToFocus.measured!.width / 2;
    const y = nodeToFocus.position.y + nodeToFocus.measured!.height / 2;
    const zoom = 1.85;

    setCenter(x, y, { zoom, duration: 1000 });
  };

  return { addNode, focusOnNode };
};

export { useNodeManipulation };
