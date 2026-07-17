"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(239, 68, 68, 0.4)", // Red-500 equivalent color
  ...props
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1c] overflow-hidden shadow-sm transition-shadow hover:shadow-md",
        className
      )}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      
      {/* We use an inner wrapper with the exact same background to cut out the center, 
          leaving only the border glowing, but since the user might want the glow to softly illuminate the card or just the border,
          in light mode, a soft inner glow is very beautiful. 
          To make ONLY the border glow, we can use a padding trick, or just let it be a background glow.
          The user image shows a glowing border. Let's make the background white and the wrapper provide the border.
       */}
      <div className="absolute inset-[1px] rounded-2xl bg-white dark:bg-[#1c1c1c] z-0" />
      
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
}
