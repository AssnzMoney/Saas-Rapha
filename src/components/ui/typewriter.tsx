"use client";

import React, { useState, useEffect } from "react";

interface TypewriterProps {
  text: string[];
  speed?: number;
  className?: string;
  waitTime?: number;
  deleteSpeed?: number;
  cursorChar?: string;
}

export const Typewriter = ({
  text,
  speed = 70,
  className,
  waitTime = 1500,
  deleteSpeed = 40,
  cursorChar = "|",
}: TypewriterProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const currentText = text[index];

    if (isDeleting) {
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % text.length);
      }
    } else {
      if (displayedText.length < currentText.length) {
        timer = setTimeout(() => {
          setDisplayedText((prev) => currentText.slice(0, prev.length + 1));
        }, speed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, waitTime);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, index, text, speed, deleteSpeed, waitTime]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-pulse">{cursorChar}</span>
    </span>
  );
};
