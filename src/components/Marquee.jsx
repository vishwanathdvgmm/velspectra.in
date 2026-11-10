import React from "react";
import { Sparkles, Zap, Globe, Shield, Terminal, ArrowUpRight } from "lucide-react";

export default function Marquee() {
  const items1 = [
    { text: "HIGH PERFORMANCE ENGINEERING", icon: Zap },
    { text: "IMMERSIVE 3D & MOTION", icon: Sparkles },
    { text: "NEXT-GEN COMMERCE", icon: Globe },
    { text: "BESPOKE BRAND INTERFACES", icon: Terminal },
    { text: "MICRO-INTERACTIONS & POLISH", icon: Shield },
    { text: "DESIGN WITH INTENTION", icon: Sparkles },
  ];

  const items2 = [
    { text: "AWWWARDS-LEVEL CRAFT", icon: Sparkles },
    { text: "TAILORED ARCHITECTURES", icon: Terminal },
    { text: "HEADLESS & LIGHTWEIGHT", icon: Zap },
    { text: "SUB-SECOND LOAD TIMES", icon: Shield },
    { text: "STRATEGIC USER JOURNEYS", icon: Globe },
    { text: "VELSPECTRA DIGITAL STUDIO", icon: Sparkles },
  ];

  return (
    <div className="marquee-wrapper" aria-hidden="true">
      <div className="marquee-track track-forward">
        <div className="marquee-content">
          {[...items1, ...items1].map((item, idx) => {
            const Icon = item.icon;
            return (
              <span key={idx} className="marquee-pill">
                <Icon size={12} className="marquee-icon" />
                <span>{item.text}</span>
                <span className="marquee-separator">•</span>
              </span>
            );
          })}
        </div>
      </div>

      <div className="marquee-track track-reverse">
        <div className="marquee-content">
          {[...items2, ...items2].map((item, idx) => {
            const Icon = item.icon;
            return (
              <span key={idx} className="marquee-pill pill-secondary">
                <Icon size={12} className="marquee-icon" />
                <span>{item.text}</span>
                <span className="marquee-separator">✦</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

