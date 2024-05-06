import { EdgeProps, SmoothStepEdge, StraightEdge } from "reactflow";

export default function CustomEdge(props: EdgeProps) {
  if (props.data?.connected) {
    return <SmoothStepEdge {...props} style={{ strokeDasharray: "5,5" }} />;
  }
  return <StraightEdge {...props} style={{ strokeDasharray: "5,5" }} />;
}
