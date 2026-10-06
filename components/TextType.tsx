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
  const textSpanRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
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
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (!isVisible || !textArray.length) return;

    let textIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let timerId: ReturnType<typeof setTimeout>;

    const step = () => {
      const currentText = reverseMode
        ? textArray[textIdx].split("").reverse().join("")
        : textArray[textIdx];

      if (deleting) {
        if (charIdx <= 0) {
          if (!loop && textIdx === textArray.length - 1) return;
          deleting = false;
          charIdx = 0;
          textIdx = (textIdx + 1) % textArray.length;
          timerId = setTimeout(step, getTypingSpeed());
        } else {
          charIdx--;
          if (textSpanRef.current) {
            textSpanRef.current.textContent = currentText.slice(0, charIdx);
          }
          timerId = setTimeout(step, deletingSpeed);
        }
      } else {
        if (charIdx < currentText.length) {
          charIdx++;
          if (textSpanRef.current) {
            textSpanRef.current.textContent = currentText.slice(0, charIdx);
          }
          if (cursorRef.current && hideCursorWhileTyping) {
            cursorRef.current.style.display = charIdx < currentText.length ? "none" : "";
          }
          const delay = charIdx === 1 ? initialDelay : getTypingSpeed();
          timerId = setTimeout(step, delay);
        } else {
          if (cursorRef.current) cursorRef.current.style.display = "";
          if (loop || textArray.length > 1) {
            deleting = true;
            timerId = setTimeout(step, pauseDuration);
          }
        }
      }
    };

    timerId = setTimeout(step, initialDelay);

    return () => clearTimeout(timerId);
  }, [
    deletingSpeed,
    getTypingSpeed,
    hideCursorWhileTyping,
    initialDelay,
    isVisible,
    loop,
    pauseDuration,
    reverseMode,
    textArray,
  ]);

  return createElement(
    Component,
    { ref: containerRef, className: `text-type ${className}`.trim() },
    <span
      ref={textSpanRef}
      className="text-type__content"
      style={{ color: textColors[0] || "inherit" }}
    />,
    showCursor && (
      <span
        ref={cursorRef}
        className={`text-type__cursor ${cursorClassName}`.trim()}
        style={{ animationDuration: `${cursorBlinkDuration}s` }}
      >
        {cursorCharacter}
      </span>
    ),
  );
}