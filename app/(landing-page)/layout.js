import React from "react";

const LandingLayout = ({ children }) => {
  return (
    // <main className="h-full bg-[#111827] overflow-auto">
    <main className="h-full bg-[#071b12] overflow-auto">
      <div className="mx-auto max-w-screen-xl h-full">{children}</div>
    </main>
  );
};

export default LandingLayout;
