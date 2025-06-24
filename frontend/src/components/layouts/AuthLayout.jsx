import React from "react";

function AuthLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden">
      {/* Left Side: Form */}
      <div className="w-full md:w-[60vw] h-full flex flex-col">
        {/* Header with Logo */}
        <div className="px-6 pt-6 pb-2 shrink-0 flex items-center gap-2">
          <h2 className="text-lg font-semibold text-black">Task Flow</h2>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">{children}</div>
      </div>

      {/* Right Side: Image with overlay, logo, caption */}
      <div className="hidden md:flex w-[40vw] h-full relative">
        {/* Overlay */}
        <div className="absolute inset-0 bg-blue-900 bg-opacity-40 z-10"></div>

        {/* Centered Caption */}
        <div className="z-20 relative m-auto text-center text-white px-6">
          <h2 className="text-3xl font-semibold leading-snug">
            Stay Organized.
            <br />
            Work Smart.
          </h2>
          <p className="mt-3 text-sm text-blue-100">
            Task Flow helps teams streamline tasks and boost productivity.
          </p>
        </div>

        {/* Top-left Logo */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 text-center">
          <h2 className="text-lg font-semibold text-white">Task Flow</h2>
          <span className="text-sm font-semibold text-white">
            Developed by ARA Tech
          </span>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
