"use client";
import React from "react";
import ReactFlow, { Background, type Node } from "reactflow";
import SkeletonNode from "./SkeletonNode";
import SkeletonEdge from "./SkeletonEdge";

const nodeTypes = { skeleton: SkeletonNode };
const edgeTypes = { skeleton: SkeletonEdge };

const Skeleton = () => {
  const radius = 300;
  const angle = (2 * Math.PI) / 10;

  const nodes: Array<Node> = [
    {
      id: "0",
      position: { x: 0, y: 0 },
      data: {},
      type: "skeleton",
    },
    Array.from({ length: 10 }).map((_, index: number) => ({
      id: (index + 1).toString(),
      position: {
        x: radius * Math.cos(angle * index),
        y: radius * Math.sin(angle * index),
      },
      data: {},
      type: "skeleton",
    })),
  ].flat();

  const edges = nodes
    .filter((node) => node.id !== "0")
    .map((node) => ({
      id: `e/0/${node.id}`,
      source: `0`,
      target: node.id,
      type: "skeleton",
    }));
  return (
    <div className="size-full">
      <ReactFlow
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={nodes}
        edges={edges}
        fitView
        panOnDrag={false}
      >
        <Background />
      </ReactFlow>
    </div>
  );
};

export default Skeleton;
