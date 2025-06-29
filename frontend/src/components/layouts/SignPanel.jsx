import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // Reuse your UI Button if available

const SignPanel = () => {
  const [sign, setSign] = useState("");

  return (
    <div className="col-span-12 md:col-span-3 bg-white border border-gray-200 rounded-lg shadow p-5 h-full flex flex-col justify-between">
      {/* Top Section */}
      <div className="space-y-5 overflow-auto">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            Sign Document
          </h2>
          <p className="text-sm text-gray-500">
            Enter your name or signature below
          </p>
        </div>

        {/* Input */}
        <div>
          <label
            htmlFor="sign"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Signature
          </label>
          <input
            id="sign"
            type="text"
            value={sign}
            onChange={(e) => setSign(e.target.value)}
            placeholder="e.g. Rakesh"
            autoFocus
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-sm"
          />
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preview
          </label>
          {/* Style 1 - Script */}
          <div className="w-full px-4 py-3 bg-gray-100 border rounded-md text-lg text-gray-700 font-signature flex items-center justify-center min-h-[48px] text-center mb-2">
            {sign || (
              <span className="text-gray-400 italic">
                Your signature will appear here
              </span>
            )}
          </div>

          {/* Style 2 - Serif */}
          <div className="w-full px-4 py-3 bg-gray-100 border rounded-md text-lg text-gray-800 font-serif flex items-center justify-center min-h-[48px] text-center mb-2">
            {sign || (
              <span className="text-gray-400 italic">
                Your signature will appear here
              </span>
            )}
          </div>

          {/* Style 3 - Bold & Uppercase */}
          <div className="w-full px-4 py-3 bg-gray-100 border rounded-md text-lg text-gray-900 font-bold uppercase flex items-center justify-center min-h-[48px] text-center">
            {sign || (
              <span className="text-gray-400 italic">
                Your signature will appear here
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="pt-5">
        <Button className="w-full bg-amber-400 text-white hover:bg-amber-500 transition font-semibold">
          Sign Document
        </Button>
      </div>
    </div>
  );
};

export default SignPanel;
