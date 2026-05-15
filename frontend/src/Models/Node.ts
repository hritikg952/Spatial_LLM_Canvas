class Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { userPrompt: string; response?: string };
  measured?: { width: number; height: number };

  constructor(
    id: string,
    position: { x: number; y: number },
    data: { userPrompt: string; response?: string },
    type: string = "dialogNode"
  ) {
    this.id = id;
    this.position = position;
    this.data = data;
    this.type = type;
  }
}

export { Node };
