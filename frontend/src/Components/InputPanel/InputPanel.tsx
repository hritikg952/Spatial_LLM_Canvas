import { useState } from "react";
import { Panel } from "@xyflow/react";
import "./InputPanel.css";

interface InputPanelProps {
  addNode: (text: string) => void;
}

export default function InputPanel({ addNode }: InputPanelProps) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (inputText.trim() === "") return;
    addNode(inputText);
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setInputText("");
    }, 1000);
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
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="Input-Panel-Button"
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </Panel>
  );
}
