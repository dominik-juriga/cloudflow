"use client";

import { useNodeStore } from "@/providers/NodeStoreProvider";
import { NodeContent } from "@/stores/NodeStore";
import React from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  OnConnect,
  useReactFlow,
  type Node,
} from "reactflow";
import ContextWindow from "./ContextWindow";
import CustomEdge from "./CustomEdge";
import CustomNode from "./CustomNode";

const nodeTypes = {
  custom: CustomNode,
};
const edgeTypes = {
  custom: CustomEdge,
};

export type FlowType = {
  nodes: Array<Node<NodeContent>>;
  edges: Array<{ id: string; source: string; target: string }>;
  topic: string;
};

const InnerFlow = (props: FlowType) => {
  const flow = useReactFlow();
  const {
    nodes,
    edges,
    onEdgesChange,
    onNodesChange,
    setEdges,
    getEdges,
    getNodes,
    setTopic,
    setNodes,
    setNodesEdges,
    setSelectedNodeId,
    selectedNodeId,
  } = useNodeStore((state) => state);

  const focusNode = React.useCallback(
    (nodeId: string | null) => {
      if (nodeId) {
        const node = flow.getNode(nodeId);
        if (!node) {
          return;
        }
        const x = node.position.x + (node.width ?? 150) * 2 - 50;
        const y = node.position.y + (node.height ?? 150) / 2;
        const zoom = 1.5;

        flow.setCenter(x, y, { zoom, duration: 1000 });
      }
    },
    [flow]
  );

  const handleConnection: OnConnect = React.useCallback(
    (connection) => {
      if (!connection.source || !connection.target) {
        return;
      }
      const nodes = getNodes();
      const edges = getEdges();
      setEdges(
        [
          edges,
          {
            id: `e/${connection.source}/${connection.target}`,
            source: connection.source,
            target: connection.target,
            type: "custom",
            data: {
              connected: true,
            },
          },
        ].flat()
      );
      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);

      if (!targetNode || !sourceNode) {
        return;
      }

      const newContext = [
        sourceNode.data.context,
        targetNode.data.context,
      ].flat();

      setNodes([
        ...nodes.filter((node) => node.id !== targetNode.id),
        {
          ...targetNode,
          data: {
            ...targetNode.data,
            context: newContext,
          },
        },
      ]);
    },
    [getEdges, getNodes, setEdges, setNodes]
  );

  React.useEffect(() => {
    setTopic(props.topic);
  }, [props.topic, setTopic]);

  React.useEffect(() => {
    focusNode(selectedNodeId);
  }, [flow, focusNode, selectedNodeId]);

  React.useEffect(() => {
    setNodesEdges(props.nodes, props.edges);
  }, [props.nodes, props.edges, setNodesEdges]);

  return (
    <React.Fragment>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneClick={() => setSelectedNodeId(null)}
        onNodeClick={(_, node) => {
          setSelectedNodeId(node.id);
        }}
        onConnect={handleConnection}
        fitView
      >
        <Background gap={12} size={1} />
      </ReactFlow>
      <MiniMap className="z-[5]" />
      <Controls />
      <ContextWindow />
    </React.Fragment>
  );
};

export default InnerFlow;
