import {
  Background,
  ReactFlow,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import InputPanel from "../InputPanel/InputPanel";
import { useReactFlowChanges } from "../../CustomHooks/useReactFlowChanges";
import { useNodeManipulation } from "../../CustomHooks/useNodeManipulation";
import DialogNode from "../DialogNode/DialogNode";

const nodeTypes = {
  dialogNode: DialogNode,
};

export default function Canvas() {
  const {
    nodes,
    edges,
    setEdges,
    setNodes,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useReactFlowChanges();

  const { addNode } = useNodeManipulation(nodes, setNodes, setEdges);

  console.log("Rendering Canvas with nodes:", nodes, "and edges:", edges);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlowProvider>
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
      </ReactFlowProvider>
    </div>
  );
}
