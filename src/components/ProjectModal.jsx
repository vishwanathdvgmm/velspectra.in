import React, { useEffect } from "react";
import { X, ArrowUpRight, CheckCircle2, Cpu, Compass, Layers, Globe } from "lucide-react";
import { sound } from "../utils/sound";

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="project-modal-backdrop" onClick={onClose}>
      <div
        className="project-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="modal-close-btn"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          aria-label="Close case study"
        >
          <X size={20} />
        </button>

        <div className="modal-header">
          <div className="modal-eyebrow">
            <span>{project.id} // INDUSTRY DEMONSTRATION</span>
            <span className="modal-category">{project.category}</span>
          </div>
          <h2>{project.name}</h2>
          <p className="modal-tagline">{project.label}</p>
        </div>

        <div className={`modal-visual-banner project-${project.tone}`}>
          <div className="modal-mockup-frame">
            <div className="mockup-header">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
              <span className="mockup-url">
                https://{project.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.velspectra.in
              </span>
            </div>
            <div className="mockup-screen">
              <div className="mockup-hero">
                <span className="mockup-kicker">{project.type}</span>
                <h3>{project.label}</h3>
                <p>
                  Engineered with React 19, mobile-first responsiveness, WhatsApp direct booking, and sub-second loading speeds.
                </p>
                <div className="mockup-btn">Ready-to-Deploy Template ↗</div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-body-grid">
          <div className="modal-section">
            <h3><Compass size={16} /> Target Business Problem</h3>
            <p>{project.challenge}</p>
          </div>

          <div className="modal-section">
            <h3><Cpu size={16} /> Included Features & Stack</h3>
            <div className="tech-pills">
              {(project.tech || ["React 19", "Vite", "Tailwind CSS", "WhatsApp Direct", "Cloudflare Pages", "SEO Setup"]).map((t) => (
                <span key={t} className="tech-pill">{t}</span>
              ))}
            </div>
          </div>

          <div className="modal-section modal-results">
            <h3><CheckCircle2 size={16} /> Business Outcomes</h3>
            <ul>
              <li><strong>WhatsApp Lead Flow</strong> Direct customer enquiries straight to phone</li>
              <li><strong>&lt; 0.8s Speed</strong> Instant loading on 4G/5G mobile devices</li>
              <li><strong>100% Client Ownership</strong> Domain, hosting and source code handover</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="button button-primary"
            onClick={() => {
              sound.playClick();
              onClose();
              const contactEl = document.getElementById("contact");
              if (contactEl) {
                contactEl.scrollIntoView({ behavior: "smooth" });
              }
              window.history.pushState(null, "", "/contact");
            }}
          >
            Launch a website like this <ArrowUpRight size={16} />
          </button>
          <button
            className="text-link"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
          >
            Close preview
          </button>
        </div>
      </div>
    </div>
  );
}
