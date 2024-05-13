"use client";
import ClientProviders from "@/providers/ClientProviders";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactFlowProvider } from "reactflow";
import InnerFlow, { FlowType } from "./InnerFlow";

const Flow = (props: FlowType) => {
  return (
    <ClientProviders>
      <div className="w-screen h-screen relative">
        <div className="absolute left-0 top-0 z-50 p-2">
          <Link href="/" title="Back to main screen">
            <ArrowLeft className="w-8 h-8 text-gray-900 opacity-40 hover:opacity-100 transition-all duration-300" />
          </Link>
        </div>
        <ReactFlowProvider>
          <InnerFlow {...props} />
        </ReactFlowProvider>
      </div>
    </ClientProviders>
  );
};

export default Flow;
