import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  applyEdgeChanges,
  applyNodeChanges,
  getOutgoers,
} from "reactflow";
import { createStore } from "zustand/vanilla";

// Demo - explain

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
  getNodesEdges: () => { nodes: Array<Node<NodeContent>>; edges: Array<Edge> };
  onNodesChange: (nodes: Array<NodeChange>) => void;
  onEdgesChange: (edges: Array<EdgeChange>) => void;
  removeNodeWithAllEdges: (nodeId: string) => void;
  setTopic: (topic: string | null) => void;
};

export type NodeStore = NodeState & NodeActions;

export const defaultInitState: NodeState = {
  selectedNodeId: null,
  topic: null,
  nodes: [],
  edges: [],
};

// Demo - live coding (cca 2 functions)
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
    getNodesEdges: () => ({ nodes: get().nodes, edges: get().edges }),
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
    removeNodeWithAllEdges: (nodeId: string) => {
      let { nodes, edges } = get().getNodesEdges();
      const node = nodes.find((node) => node.id === nodeId);
      if (!node) {
        return;
      }
      const children = getAllChildren(node, nodes, edges, []);
      const childrenEdges = new Set(
        edges
          .filter((edge) =>
            children.find(
              (node) => node.id === edge.source || node.id === edge.target
            )
          )
          .map((edge) => edge.id)
      );
      nodes = removeNodes([nodeId, children.map((c) => c.id)].flat(), nodes);
      edges = removeEdges(Array.from(childrenEdges), edges);
      get().setNodesEdges(nodes, edges);
      get().setSelectedNodeId(null);
    },
  }));

const removeNodes = (nodeIds: Array<string>, nodes: Array<Node<NodeContent>>) =>
  applyNodeChanges(
    nodeIds.map((nodeId) => ({ type: "remove", id: nodeId })),
    nodes
  );
const removeEdges = (edgeIds: Array<string>, edges: Array<Edge>) =>
  applyEdgeChanges(
    edgeIds.map((edgeId) => ({ type: "remove", id: edgeId })),
    edges
  );

// Demo - live coding
export const getAllChildren = (
  node: Node<NodeContent> | undefined,
  nodes: Array<Node<NodeContent>>,
  edges: Array<Edge>,
  all: Array<Node<NodeContent>>
): Array<Node<NodeContent>> => {
  if (node == null) {
    return all;
  }

  const outs = getOutgoers(node, nodes, edges);
  all.push(...outs);
  outs.forEach((out) => getAllChildren(out, nodes, edges, all));
  return all;
};
