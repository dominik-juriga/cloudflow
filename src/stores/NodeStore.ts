import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import { createStore } from "zustand/vanilla";

export type NodeContentItem = {
  label: string;
  fact: string | null;
};

export type NodeContent = NodeContentItem & { context: Array<NodeContentItem> };

export type NodeState = {
  nodes: Array<Node<NodeContent>>;
  edges: Array<Edge<any>>;
  selectedNodeId: string | null;
  topic: string | null;
};

export type NodeActions = {
  setSelectedNodeId: (id: string | null) => void;
  getSelectedNode: () => Node<NodeContent> | null;
  setNodes: (nodes: Array<Node<NodeContent>>) => void;
  getNodes: () => Array<Node<NodeContent>>;
  setEdges: (edges: Array<Edge>) => void;
  getEdges: () => Array<Edge>;
  setNodesEdges: (nodes: Array<Node<NodeContent>>, edges: Array<Edge>) => void;
  onNodesChange: (nodes: Array<NodeChange>) => void;
  onEdgesChange: (edges: Array<EdgeChange>) => void;
  setTopic: (topic: string | null) => void;
};

export type NodeStore = NodeState & NodeActions;

export const defaultInitState: NodeState = {
  selectedNodeId: null,
  topic: null,
  nodes: [],
  edges: [],
};
export const createNodeStore = (initState: NodeState = defaultInitState) =>
  createStore<NodeStore>()((set, get) => ({
    ...initState,
    setSelectedNodeId: (selectedNodeId) =>
      set(() => ({
        selectedNodeId,
      })),
    setEdges: (edges) => set(() => ({ edges })),
    getEdges: () => get().edges,
    setNodes: (nodes) => set(() => ({ nodes })),
    getNodes: () => get().nodes,
    setNodesEdges: (nodes, edges) => set(() => ({ nodes, edges })),
    getSelectedNode: () =>
      get().nodes.find((node) => node.id === get().selectedNodeId) ?? null,
    setTopic: (topic) => set(() => ({ topic })),
    onNodesChange: (changes) =>
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      }),

    onEdgesChange: (changes) =>
      set({
        edges: applyEdgeChanges(changes, get().edges),
      }),
  }));
