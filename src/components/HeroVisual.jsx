import React, { useState, useEffect, useRef } from "react";
import { sound } from "../utils/sound";

export default function HeroVisual() {
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      // Max tilt angle
      targetY = deltaX * 16;
      targetX = -deltaY * 16;
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
      setHovered(false);
    };

    const handleMouseEnter = () => {
      setHovered(true);
      sound.playHover();
    };

    const loop = () => {
      // Lerp for butter smooth damping
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      setTilt({ x: currentX, y: currentY });
      rafId = requestAnimationFrame(loop);
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("mouseenter", handleMouseEnter);
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  const handleClick = (e) => {
    sound.playClick();
    const id = Date.now();
    setRipples((prev) => [...prev, id]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r !== id));
    }, 1200);
  };

  return (
    <div
      ref={containerRef}
      className={`hero-visual ${hovered ? "is-hovered" : ""}`}
      onClick={handleClick}
      aria-label="Interactive 3D VELSPECTRA brand monument"
      role="region"
    >
      <div className="visual-label label-top">
        <span className="live-pill">
          <span className="live-dot" /> LIVE / 001
        </span>
        <span className="visual-fps">3D ORBITAL CORE</span>
      </div>

      {/* 3D tilt stage */}
      <div
        className="visual-stage"
        style={{
          transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        {/* Shockwave ripples on click */}
        {ripples.map((id) => (
          <div key={id} className="visual-shockwave" />
        ))}

        {/* Ambient background bloom */}
        <div className="visual-ambient-bloom" />

        {/* Orbital rings with rotating satellites */}
        <div className="orbit-track track-1">
          <div className="satellite sat-1" />
        </div>
        <div className="orbit-track track-2">
          <div className="satellite sat-2" />
        </div>
        <div className="orbit-track track-3">
          <div className="satellite sat-3" />
        </div>

        {/* Glowing floating beacons */}
        <div className="visual-cross cross-a">
          <span className="cross-pulse" />
        </div>
        <div className="visual-cross cross-b">
          <span className="cross-pulse" />
        </div>

        {/* Central glowing V monument */}
        <div className="visual-v">
          <div className="visual-v-inner">
            <span className="v-glyph">V</span>
            <div className="v-sheen" />
          </div>
        </div>

        {/* Floating coordinates indicator */}
        <div className="visual-coords">
          <span>X: {tilt.y.toFixed(1)}°</span>
          <span>Y: {(-tilt.x).toFixed(1)}°</span>
        </div>
      </div>

      <div className="visual-label label-bottom">
        <span>
          IDEAS INTO
          <br />
          INTERFACES
        </span>
        <span className="click-hint">CLICK TO PULSE ENERGY</span>
        <span>
          EST. 2026
          <br />
          AVAILABLE WORLDWIDE
        </span>
      </div>
    </div>
  );
}
