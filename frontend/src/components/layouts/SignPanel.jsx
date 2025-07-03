import React from "react";
import { Button } from "@/components/ui/button";
import { useDraggable } from "@dnd-kit/core";

const SignPanel = ({
  sign,
  setSign,
  onSign,
  isSigningComplete,
  onReset,
  isDropped,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "signature",
    disabled: isSigningComplete || isDropped, // disable dragging once dropped
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div className="col-span-12 md:col-span-3 bg-white border rounded-lg shadow p-5 flex flex-col justify-between h-full">
      <div className="space-y-5 overflow-auto">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            Sign Document
          </h2>
          <p className="text-sm text-gray-500">
            Enter your name or signature below
          </p>
        </div>

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
            placeholder="e.g. John Doe"
            className="w-full px-4 py-2 border rounded-md shadow-sm text-sm"
            disabled={isSigningComplete}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preview
          </label>
          <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            className={`w-full px-4 py-3 bg-gray-100 border rounded-md text-lg text-gray-700 font-signature flex items-center justify-center min-h-[48px] text-center ${
              isSigningComplete || isDropped ? "cursor-default" : "cursor-grab"
            }`}
          >
            {sign || (
              <span className="text-gray-400 italic">
                Your signature will appear here
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="pt-5 space-y-2">
        {isSigningComplete ? (
          <Button
            className="w-full bg-green-600 text-white hover:bg-green-700 transition font-semibold"
            onClick={onReset}
          >
            Sign Another Document
          </Button>
        ) : (
          <Button
            className="w-full bg-amber-500 text-white hover:bg-amber-600 transition font-semibold"
            onClick={onSign}
            disabled={!sign}
          >
            Sign Document
          </Button>
        )}
      </div>
    </div>
  );
};

export default SignPanel;
