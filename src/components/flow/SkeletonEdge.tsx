import { EdgeProps, StraightEdge } from "reactflow";

const SkeletonEdge = (props: EdgeProps) => (
  <StraightEdge {...props} style={{ strokeDasharray: "5,5" }} />
);
export default SkeletonEdge;
