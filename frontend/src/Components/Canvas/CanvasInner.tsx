import {
  Background,
  ReactFlow,
  BackgroundVariant,
  Controls,
} from "@xyflow/react";
import type { NodeTypes } from "@xyflow/react";

import InputPanel from "../InputPanel/InputPanel";
import { useNodeManipulation } from "../../CustomHooks/useNodeManipulation";
import { useCanvasStore } from "../../store/canvasStore";
import DialogNode from "../DialogNode/DialogNode";

const nodeTypes: NodeTypes = {
  dialogNode: DialogNode,
};

export default function CanvasInner() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useCanvasStore();
  const { addNode } = useNodeManipulation();

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    >
      <Controls />
      <Background
        gap={12}
        size={1}
        variant={BackgroundVariant.Dots}
        bgColor="#f3f3f3"
      />
      <InputPanel addNode={addNode} />
    </ReactFlow>
  );
}
