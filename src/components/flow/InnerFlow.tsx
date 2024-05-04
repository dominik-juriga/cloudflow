"use client";

import { useNodeStore } from "@/providers/NodeStoreProvider";
import { NodeContent } from "@/stores/NodeStore";
import React from "react";
import ReactFlow, { Background, useReactFlow, type Node } from "reactflow";
import CustomNode from "./CustomNode";
import ContextWindow from "./ContextWindow";

const nodeTypes = {
  custom: CustomNode,
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
    setTopic,
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
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneClick={() => setSelectedNodeId(null)}
        onNodeClick={(_, node) => {
          setSelectedNodeId(node.id);
        }}
        fitView
      >
        <Background gap={12} size={1} />
      </ReactFlow>
      <ContextWindow />
    </React.Fragment>
  );
};

export default InnerFlow;
