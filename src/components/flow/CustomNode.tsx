import { cn } from "@/lib/utils";
import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";

const CustomNode = ({ data, isConnectable, xPos }: NodeProps) => {
  const isRoot = data.fact == null;
  const isLeft = xPos < 0;
  return (
    <div className="bg-white px-4 py-2 border border-gray-200 rounded-lg">
      <Handle
        type="target"
        position={isLeft ? Position.Right : Position.Left}
        className="bg-gray-200"
        isConnectable={isConnectable}
      />
      <p className={cn("text-md", isRoot && "font-semibold")}>{data.label}</p>
      <Handle
        type="source"
        position={
          isRoot ? Position.Bottom : isLeft ? Position.Left : Position.Right
        }
        className="bg-gray-200"
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(CustomNode);
