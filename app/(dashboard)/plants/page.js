"use client";
import React, { useState } from "react";
import { MultimodalInput } from "./_components/multi-input";
import { Markdown } from "../_components/markdown";
import { Empty } from "../_components/empty";
import { Loader } from "../_components/loader";

const page = () => {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleResponse = (data) => {
    setResponse(data);
  };
  const handleLoadingChange = (newIsLoading) => {
    setIsLoading(newIsLoading);
  };
  return (
    <div className="bg-white min-h-full flex flex-col items-center justify-center">
      <div className="w-full md:w-[600px] shadow-lg  ">
        <MultimodalInput
          onResponse={handleResponse}
          onLoadingChange={handleLoadingChange}
        />
        <div className="">
          <div>
            {isLoading && <div>{<Loader />}</div>}
            {!response && !isLoading && (
              <div>
                <Empty />
              </div>
            )}
            {response && (
              <div className="w-full p-8 flex items-start gap-x-8 rounded-lg bg-muted">
                <Markdown content={response} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
