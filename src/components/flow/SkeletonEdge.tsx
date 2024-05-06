import { BezierEdge, EdgeProps } from "reactflow";

const SkeletonEdge = (props: EdgeProps) => (
  <BezierEdge
    {...props}
    animated
    style={{ strokeDasharray: "5,5", opacity: 0.7 }}
  />
);
export default SkeletonEdge;
