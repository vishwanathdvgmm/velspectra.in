import React, { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const [hoverText, setHoverText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    let mouseX = -1000;
    let mouseY = -1000;
    let ringX = -1000;
    let ringY = -1000;
    let initialized = false;
    let rafId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!initialized) {
        ringX = mouseX;
        ringY = mouseY;
        initialized = true;
        setIsVisible(true);
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const render = () => {
      if (initialized) {
        // Butter smooth lerp interpolation
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;

        if (cursorRingRef.current) {
          cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        }
      }
      rafId = requestAnimationFrame(render);
    };

    const handlePointerOver = (e) => {
      const target = e.target.closest(
        "a, button, .project-card, .service-row, .process-step, .interactive-badge, .calculator-chip, [data-cursor]"
      );
      if (target) {
        setIsHovered(true);
        const text = target.getAttribute("data-cursor") || "";
        setHoverText(text);
      } else {
        setIsHovered(false);
        setHoverText("");
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseover", handlePointerOver, { passive: true });
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseover", handlePointerOver);
      cancelAnimationFrame(rafId);
    };
  }, []); // Run ONCE on mount, NEVER reset on state changes!

  return (
    <>
      <div
        ref={cursorDotRef}
        className={`custom-cursor-dot ${isVisible ? "is-active" : ""}`}
        aria-hidden="true"
      />
      <div
        ref={cursorRingRef}
        className={`custom-cursor-ring ${isVisible ? "is-active" : ""} ${
          isHovered ? "is-hovering" : ""
        } ${hoverText ? "has-text" : ""}`}
        aria-hidden="true"
      >
        {hoverText && <span className="cursor-label">{hoverText}</span>}
      </div>
    </>
  );
}
