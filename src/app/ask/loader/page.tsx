import Skeleton from "@/components/flow/Skeleton";
import React from "react";

const page = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      {/* <Spinner /> */}
      <Skeleton />
    </div>
  );
};

export default page;
