import Spinner from "@/components/Spinner";
import Skeleton from "@/components/flow/Skeleton";

const Loading = () => (
  <div className="w-screen h-screen flex justify-center items-center">
    <Skeleton />
  </div>
);

export default Loading;
