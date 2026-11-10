import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, ArrowUp } from "lucide-react";
import { sound } from "../utils/sound";

export default function FloatingControls() {
  const [muted, setMuted] = useState(sound.isMuted());
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      const progress = total > 0 ? (current / total) * 100 : 0;
      setScrollProgress(progress);
      setShowTop(current > 400);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleSound = () => {
    const isNowActive = sound.toggleMute();
    setMuted(!isNowActive);
  };

  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.pushState(null, "", "/");
  };

  return (
    <div
      className="floating-dock"
      role="complementary"
      aria-label="Studio controls"
    >
      <button
        className={`floating-btn ${!muted ? "is-sound-on" : ""}`}
        onClick={toggleSound}
        title={muted ? "Enable futuristic sound effects" : "Mute sound effects"}
        aria-label={muted ? "Enable sound" : "Mute sound"}
      >
        {!muted ? <Volume2 size={16} /> : <VolumeX size={16} />}
        <span className="sound-pulse-ring" />
      </button>

      {showTop && (
        <button
          className="floating-btn scroll-top-btn"
          onClick={scrollToTop}
          title="Scroll to top"
          aria-label="Scroll to top"
        >
          <svg className="progress-ring" width="36" height="36">
            <circle
              className="progress-ring-circle-bg"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="2"
              fill="transparent"
              r="15"
              cx="18"
              cy="18"
            />
            <circle
              className="progress-ring-circle"
              stroke="url(#gradient-accent)"
              strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 15}`}
              strokeDashoffset={`${2 * Math.PI * 15 * (1 - scrollProgress / 100)}`}
              strokeLinecap="round"
              fill="transparent"
              r="15"
              cx="18"
              cy="18"
            />
            <defs>
              <linearGradient
                id="gradient-accent"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ef3568" />
                <stop offset="100%" stopColor="#7ad8e8" />
              </linearGradient>
            </defs>
          </svg>
          <ArrowUp size={14} className="scroll-arrow-icon" />
        </button>
      )}
    </div>
  );
}
