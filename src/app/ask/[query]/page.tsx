import React from "react";
import qs from "qs";
import Flow from "@/components/flow/Flow";
import { NodeContent } from "@/stores/NodeStore";
import { type Node } from "reactflow";
import { notFound } from "next/navigation";

type PageProps = { params: { query: string } };

export const generateMetadata = ({ params }: PageProps) => {
  return {
    title: decodeURIComponent(params.query),
  };
};

const Page = async ({ params }: PageProps) => {
  const decoded = decodeURIComponent(params.query);

  const response = await fetch(
    "http://localhost:3000/api/query?" + qs.stringify({ topic: decoded })
  );

  if (!response.ok) {
    return <div>Failed to fetch response</div>;
  }

  const data = await response.json();
  let parsed = null;
  try {
    parsed = JSON.parse(data[0].message.content).facts;
  } catch (e) {
    notFound();
  }

  const radius = 300;
  const angle = (2 * Math.PI) / parsed.length;

  const nodes: Array<Node<NodeContent>> = [
    {
      id: "0",
      position: { x: 0, y: 0 },
      data: { label: decoded, context: [] },
      type: "custom",
    },
    parsed.map((fact: { fact: string; summary: string }, index: number) => ({
      id: (index + 1).toString(),
      position: {
        x: radius * Math.cos(angle * index),
        y: radius * Math.sin(angle * index),
      },
      data: {
        label: fact.summary,
        context: [{ label: fact.summary, fact: fact.fact }],
      },
      type: "custom",
    })),
  ].flat();

  const edges = nodes
    .filter((node) => node.id !== "0")
    .map((node) => ({
      id: `e/0/${node.id}`,
      source: `0`,
      target: node.id,
      type: "custom",
    }));

  return <Flow nodes={nodes} edges={edges} topic={decoded} />;
};

export default Page;
