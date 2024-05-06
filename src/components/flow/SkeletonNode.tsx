import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { Skeleton } from "../ui/skeleton";
import React from "react";

const getRandom = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const SkeletonNode = ({ isConnectable, xPos, id }: NodeProps) => {
  const width = React.useMemo(() => getRandom(50, 100), []);
  const isLeft = xPos < 0;
  const isRoot = id === "0";
  return (
    <div className="bg-white px-4 py-2 border border-gray-200 rounded-lg">
      <Handle
        type="target"
        position={isLeft ? Position.Right : Position.Left}
        className="bg-gray-200"
        isConnectable={isConnectable}
      />
      <Skeleton style={{ width }} className="h-[10px]" />
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

export default memo(SkeletonNode);
