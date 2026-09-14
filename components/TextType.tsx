"use client";

import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";
import "./TextType.css";

type TextTypeProps = {
  text: string | string[];
  as?: ElementType;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  className?: string;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: ReactNode;
  cursorClassName?: string;
  cursorBlinkDuration?: number;
  textColors?: string[];
  variableSpeed?: { min: number; max: number };
  startOnVisible?: boolean;
  reverseMode?: boolean;
};

export default function TextType({
  text,
  as: Component = "div",
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = "",
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = "|",
  cursorClassName = "",
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  startOnVisible = false,
  reverseMode = false,
}: TextTypeProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const getTypingSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    return variableSpeed.min + Math.random() * (variableSpeed.max - variableSpeed.min);
  }, [typingSpeed, variableSpeed]);

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (!isVisible || !textArray.length) return;
    const currentText = reverseMode
      ? textArray[textIndex].split("").reverse().join("")
      : textArray[textIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (isDeleting) {
      if (!displayedText) {
        if (!loop && textIndex === textArray.length - 1) return;
        setIsDeleting(false);
        setCharIndex(0);
        setTextIndex((index) => (index + 1) % textArray.length);
      } else {
        timeout = setTimeout(() => setDisplayedText((value) => value.slice(0, -1)), deletingSpeed);
      }
    } else if (charIndex < currentText.length) {
      timeout = setTimeout(() => {
        setDisplayedText((value) => value + currentText[charIndex]);
        setCharIndex((index) => index + 1);
      }, charIndex === 0 ? initialDelay : getTypingSpeed());
    } else if (loop || textArray.length > 1) {
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deletingSpeed, displayedText, getTypingSpeed, initialDelay, isDeleting, isVisible, loop, pauseDuration, reverseMode, textArray, textIndex]);

  const shouldHideCursor = hideCursorWhileTyping && (charIndex < textArray[textIndex].length || isDeleting);

  return createElement(
    Component,
    { ref: containerRef, className: `text-type ${className}`.trim() },
    <span className="text-type__content" style={{ color: textColors[textIndex % textColors.length] || "inherit" }}>
      {displayedText}
    </span>,
    showCursor && !shouldHideCursor && (
      <span
        className={`text-type__cursor ${cursorClassName}`.trim()}
        style={{ animationDuration: `${cursorBlinkDuration}s` }}
      >
        {cursorCharacter}
      </span>
    ),
  );
}
