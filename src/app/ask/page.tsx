import { redirect } from "next/navigation";
import React from "react";

const Page = () => {
  async function createInvoice(formData: FormData) {
    "use server";

    const query = formData.get("query");

    redirect(`/ask/${query}`);
  }

  return (
    <div className="w-screen h-screen flex justify-center flex-col items-center">
      <h1 className="text-[80px] mb-10 font-thin tracking-[40px]">cloudflow</h1>
      <form action={createInvoice} className="flex flex-col gap-2 w-[400px]">
        <input
          type="text"
          autoComplete="off"
          id="query"
          name="query"
          className="bg-gray-50 border w-full border-gray-300 text-gray-900 text-center text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Select a topic of interest"
          required
        />
        <button
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="submit"
        >
          Check it out
        </button>
      </form>
    </div>
  );
};

export default Page;
