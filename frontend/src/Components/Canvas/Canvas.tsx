import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import CanvasInner from "./CanvasInner";

export default function Canvas() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlowProvider>
        <CanvasInner />
      </ReactFlowProvider>
    </div>
  );
}
