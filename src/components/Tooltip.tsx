// src/components/Tooltip.tsx
import React from "react";

interface TooltipProps {
  content: string;
  visible: boolean;
  position: { top: number; left: number };
}

const Tooltip: React.FC<TooltipProps> = ({ content, visible, position }) => {
  if (!visible) return null;

  return (
    <div
      style={{ top: position.top, left: position.left, zIndex: 100 }}
      className="fixed bg-gray-700 text-white text-xs rounded p-2 shadow-lg whitespace-pre-line"
    >
      {content}
    </div>
  );
};

export default Tooltip;
