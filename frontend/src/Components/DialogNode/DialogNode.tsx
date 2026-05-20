import { Position, Handle } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import { Copy, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react";

import ActionButton from "../ActionButton/ActionButton";

import "./DialogNode.css";

type DialogNodeData = { userPrompt: string; response?: string; isLoading?: boolean };

const DialogNode = (props: NodeProps & { data: DialogNodeData }) => {
  const { userPrompt, response, isLoading } = props.data;

  return (
    <div className="card-wrapper-page">
      <div className="card-container">
        {/* HEADER: USER CONTEXT */}
        <div className="card-header">
          <div className="user-avatar">US</div>
          <div className="user-content">
            <div className="meta-row">
              <span className="user-name">User</span>
            </div>
            <p className="user-text">{userPrompt}</p>
          </div>
        </div>

        {/* BODY: AI RESPONSE */}
        <div className="card-body">
          <div className="ai-layout">
            <div className="ai-content">
              {isLoading ? (
                <div className="skeleton-container">
                  <div className="skeleton-line" />
                  <div className="skeleton-line skeleton-line--short" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line skeleton-line--medium" />
                </div>
              ) : (
                <p className="ai-text">{response}</p>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER: ACTION BAR */}
        <div className="card-footer">
          <ActionButton icon={<Copy />} label="Copy" />
          <ActionButton icon={<ThumbsUp />} label="Good" />
          <ActionButton icon={<ThumbsDown />} label="Bad" />
          <div className="divider"></div>
          <ActionButton icon={<RefreshCw />} label="Regenerate" />
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="handle-top" />
      <Handle type="source" position={Position.Bottom} className="handle-bottom" />
    </div>
  );
};

export default DialogNode;
