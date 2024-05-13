"use client";

import { useNodeStore } from "@/providers/NodeStoreProvider";

import { useMutation } from "@tanstack/react-query";
import { PlusIcon, TrashIcon } from "lucide-react";
import qs from "qs";
import React from "react";
import { useReactFlow, getOutgoers, type Node } from "reactflow";
import Spinner from "../Spinner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";
import { NodeContent } from "@/stores/NodeStore";
import { Button } from "../ui/button";

const ContextWindow = () => {
  const [query, setQuery] = React.useState("");

  const flow = useReactFlow();

  // Demo - live coding
  const [deleteMode, setDeleteMode] = React.useState(false);

  const { topic, setSelectedNodeId, getSelectedNode, removeNodeWithAllEdges } =
    useNodeStore((state) => state);

    // Demo - live coding/explain
  const { mutate, isPending } = useMutation({
    mutationFn: async (query: string) => {
      const currentNode = getSelectedNode();
      if (!currentNode) {
        return;
      }
      const apiContextValue = currentNode.data.context.map(
        (contextItem) => contextItem.fact
      );

      const response = await fetch(
        "http://localhost:3000/api/query?" +
          qs.stringify({
            topic,
            context: JSON.stringify(apiContextValue),
            q: query,
          })
      );

      if (response.ok) {
        return await response.json();
      }
    },

    onSuccess: (data) => {
      setQuery("");

      const currentNode = getSelectedNode();
      if (!currentNode) {
        return;
      }

      const position = currentNode.position;

      if (!position) {
        return;
      }

      const children = getOutgoers(
        currentNode,
        flow.getNodes(),
        flow.getEdges()
      );

      const node = {
        id: flow.getNodes().length.toString(),
        position: {
          x:
            position.x > 0
              ? position.x + (currentNode?.width ?? 150) + 50
              : position.x - (currentNode?.width ?? 150) - 50,
          y: (currentNode?.position.y ?? 0) + children.length * 60,
        },
        data: {
          label: query,
          fact: data[0].message.content,
          context: [
            currentNode.data.context,
            {
              label: query,
              fact: data[0].message.content,
            },
          ].flat(),
        },
        type: "custom",
      };

      const edge = {
        id: `e/${currentNode?.id}/${node.id}`,
        source: currentNode?.id ?? "",
        target: node.id,
        type: "custom",
        animated: true,
      };

      flow.addNodes([node]);
      flow.addEdges([edge]);

      setSelectedNodeId(node.id);
    },
  });

  const selectedNode = getSelectedNode();

  const removeNode = React.useCallback(
    (node: Node<NodeContent> | null) => {
      if (!node) {
        return;
      }

      removeNodeWithAllEdges(node.id);
    },
    [removeNodeWithAllEdges]
  );

  // Demo - live coding/explain
  React.useEffect(() => {
    setDeleteMode(false);
  }, [selectedNode]);

  if (!selectedNode) {
    return null;
  }

  return (
    <div className="absolute right-0 top-0 w-1/2 h-screen z-10  px-6 py-8">
      <div className="size-full absolute left-0 top-0 isolate  rounded-xl bg-white/70 backdrop-blur-md shadow-2xl ring-1 ring-black/5" />
      <div className="flex z-10 flex-col justify-between h-full relative pt-8">
        <Button
          className="absolute top-0 right-[-2px]"
          onClick={() => setSelectedNodeId(null)}
        >
          <PlusIcon className="transform rotate-45" />
        </Button>
        <Accordion
          key={selectedNode.id}
          className="w-full h-max overflow-y-auto overflow-x-hidden"
          type="single"
          collapsible
          defaultValue={`item-${selectedNode.data.context.length - 1}`}
        >
          {selectedNode.data.context.map((contextItem, index) => (
            <AccordionItem key={contextItem.fact} value={`item-${index}`}>
              <AccordionTrigger>{contextItem.label}</AccordionTrigger>
              <AccordionContent>{contextItem.fact}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {isPending ? (
          <div className="w-full flex justify-center py-4">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col gap-2 w-full mt-2">
            <input
              type="text"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-gray-50 border w-full border-gray-200 text-gray-900 text-center text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Expand the conversation..."
              required
            />

            <div className="w-full flex justify-between gap-2">
              <Button onClick={() => mutate(query)} type="submit" size="lg">
                Explore more on {selectedNode.data.label}
              </Button>
              <div className="flex gap-2 items-center border border-gray-200 rounded-lg px-2">
                {/** Demo - live coding */}
                <Switch
                  checked={deleteMode}
                  title="Enable node deletion"
                  onCheckedChange={setDeleteMode}
                />
                
                <Button
                  className={cn({
                    "opacity-20 transition-opacity duration-300": !deleteMode,
                  })}
                  size="sm"
                  variant={"ghost"}
                  disabled={!deleteMode}
                  onClick={() => removeNode(selectedNode)}
                  title="Remove node"
                >
                  <TrashIcon color="red" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContextWindow;
