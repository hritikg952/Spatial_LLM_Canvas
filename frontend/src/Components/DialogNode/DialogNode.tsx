import { Position, Handle } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import { Copy, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react";

import ActionButton from "../ActionButton/ActionButton";

import "./DialogNode.css";

type DialogNodeData = { userPrompt: string; response?: string };

const DialogNode = (props: NodeProps & { data: DialogNodeData }) => {
  return (
    <div className="card-wrapper-page">
      {/* CARD CONTAINER */}
      <div className="card-container">
        {/* HEADER: USER CONTEXT */}
        <div className="card-header">
          <div className="user-avatar">US</div>
          <div className="user-content">
            <div className="meta-row">
              <span className="user-name">User</span>
              <span className="timestamp">10:18 AM</span>
            </div>
            <p className="user-text">{props.data.userPrompt}</p>
          </div>

          {/* Edit Action (Hover only) */}
          {/* <button className="edit-btn" aria-label="Edit Prompt">
            <Edit2 size={16} />
          </button> */}
        </div>
        {/* BODY: AI RESPONSE */}
        <div className="card-body">
          <div className="ai-layout">
            <div className="ai-content">
              <p className="ai-text">
                {props.data.response}
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
                voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores eos qui ratione voluptatem sequi
                nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
                sit amet, consectetur, adipisci velit, sed quia non numquam eius
                modi tempora incidunt ut labore et dolore magnam aliquam quaerat
                voluptatem. Ut enim ad minima veniam, quis nostrum
                exercitationem ullam corporis suscipit laboriosam, nisi ut
                aliquid ex ea commodi consequatur? Quis autem vel eum iure
                reprehenderit qui in ea voluptate velit esse quam nihil
                molestiae consequatur, vel illum qui dolorem eum fugiat quo
                voluptas nulla pariatur?
              </p>
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
        // render node position x, y
        {/* <div className="node-position">
          x: {props.position.x}, y: {props.position.y}
        </div> */}
      </div>
      <Handle type="target" position={Position.Top} className="handle-top" />
      <Handle
        type="source"
        position={Position.Bottom}
        className="handle-bottom"
      />
    </div>
  );
};

export default DialogNode;
