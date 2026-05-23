import { useState } from "react";
import { Panel } from "@xyflow/react";
import "./InputPanel.css";

interface InputPanelProps {
  addNode: (text: string) => void;
}

export default function InputPanel({ addNode }: InputPanelProps) {
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (inputText.trim() === "") return;
    addNode(inputText);
    setInputText("");
  };

  return (
    <Panel position="bottom-center" className="Input-Panel-Container">
      <div className="Input-Panel-Sub-Container">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="Input-Panel-Input"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="Input-Panel-Button">
          Send
        </button>
      </div>
    </Panel>
  );
}
