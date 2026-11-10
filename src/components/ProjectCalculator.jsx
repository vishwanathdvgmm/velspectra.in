import React, { useState } from "react";
import { Sparkles, Calculator, ArrowRight, Check, MessageSquare } from "lucide-react";
import { sound } from "../utils/sound";

export default function ProjectCalculator({ currency = "INR", onSelectScope }) {
  const isINR = currency === "INR";
  const [packageType, setPackageType] = useState("business");
  const [selectedAddons, setSelectedAddons] = useState(["whatsapp", "seo"]);

  const packages = {
    starter: {
      id: "starter",
      name: "Starter Website",
      category: "Entry Level",
      priceINR: "₹4,999 – ₹7,999",
      priceUSD: "$99 – $149",
      timeline: "5 – 7 Days",
      ideal: "Single page responsive site, menu, or landing page",
    },
    business: {
      id: "business",
      name: "Business Website",
      category: "Recommended",
      priceINR: "₹9,999 – ₹19,999",
      priceUSD: "$199 – $399",
      timeline: "1 – 2 Weeks",
      ideal: "Up to 5 pages, custom design, forms & WhatsApp",
    },
    professional: {
      id: "professional",
      name: "Professional Website",
      category: "Advanced",
      priceINR: "₹24,999 – ₹49,999",
      priceUSD: "$499 – $999",
      timeline: "2 – 3 Weeks",
      ideal: "Multi-page dynamic web app, custom animations & analytics",
    },
    ecommerce: {
      id: "ecommerce",
      name: "E-Commerce Storefront",
      category: "Specialized",
      priceINR: "₹29,999 – ₹79,999+",
      priceUSD: "$699 – $1,499+",
      timeline: "3 – 5 Weeks",
      ideal: "Catalog, cart, Razorpay / Stripe gateway & order flows",
    },
  };

  const addonsList = [
    { id: "whatsapp", label: "WhatsApp One-Click Booking / Enquiry", inr: "Included in Business+", usd: "Included" },
    { id: "seo", label: "Core Web Vitals & On-Page SEO Foundations", inr: "+ ₹2,499", usd: "+ $49" },
    { id: "payment", label: "Payment Gateway Integration (Razorpay/Stripe)", inr: "+ ₹4,999", usd: "+ $99" },
    { id: "maintenance", label: "Monthly Standard Care Retainer", inr: "₹999 / mo", usd: "$19 / mo" },
  ];

  const toggleAddon = (id) => {
    sound.playClick();
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((item) => item !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const handleApplyToForm = () => {
    sound.playClick();
    const pkg = packages[packageType];
    const addonNames = selectedAddons
      .map((id) => addonsList.find((a) => a.id === id)?.label)
      .filter(Boolean)
      .join(", ");
    const summary = `${pkg.name} (${isINR ? pkg.priceINR : pkg.priceUSD}) with [${addonNames}]`;
    if (onSelectScope) {
      onSelectScope(pkg.name, summary);
    }
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
    window.history.pushState(null, "", "/contact");
  };

  const currentPkg = packages[packageType];

  return (
    <div className="calculator-widget">
      <div className="calculator-header">
        <div>
          <span className="eyebrow">
            <Calculator size={13} /> ESTIMATE YOUR PROJECT
          </span>
          <h3>Interactive Scope & Quotation Planner</h3>
          <p className="calc-subtitle">
            Select your package and desired capabilities to view estimated project scope and timelines.
          </p>
        </div>
        <span className="calc-badge">
          <Sparkles size={13} /> Transparent Pricing
        </span>
      </div>

      <div className="calc-grid">
        <div className="calc-group">
          <label className="calc-label">1. Choose Your Package Tier</label>
          <div className="calc-options">
            {Object.values(packages).map((pkg) => {
              const isSelected = packageType === pkg.id;
              return (
                <button
                  type="button"
                  key={pkg.id}
                  className={`calc-chip ${isSelected ? "is-selected" : ""}`}
                  onClick={() => {
                    sound.playClick();
                    setPackageType(pkg.id);
                  }}
                >
                  <div className="chip-content">
                    <div className="chip-top-row">
                      <span className="chip-title">{pkg.name}</span>
                      <span className="chip-tier-tag">{pkg.category}</span>
                    </div>
                    <span className="chip-desc">{pkg.ideal}</span>
                    <span className="chip-price">
                      {isINR ? pkg.priceINR : pkg.priceUSD}
                    </span>
                  </div>
                  {isSelected && <Check size={16} className="chip-check" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="calc-group">
          <label className="calc-label">2. Specialized Integrations & Care</label>
          <div className="calc-addons">
            {addonsList.map((addon) => {
              const active = selectedAddons.includes(addon.id);
              return (
                <button
                  type="button"
                  key={addon.id}
                  className={`addon-pill ${active ? "is-active" : ""}`}
                  onClick={() => toggleAddon(addon.id)}
                >
                  <span className="addon-indicator">{active ? "✓" : "+"}</span>
                  <div className="addon-text-wrap">
                    <span className="addon-name">{addon.label}</span>
                    <span className="addon-cost">
                      {isINR ? addon.inr : addon.usd}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="calc-summary-bar">
        <div className="summary-details">
          <div className="summary-item">
            <span className="summary-label">Estimated Investment</span>
            <span className="summary-value highlight-price">
              {isINR ? currentPkg.priceINR : currentPkg.priceUSD}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Turnaround</span>
            <span className="summary-value">{currentPkg.timeline}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Terms</span>
            <span className="summary-value">50% Advance · 50% on Handover</span>
          </div>
        </div>
        <button
          type="button"
          className="button button-primary calc-submit-btn"
          onClick={handleApplyToForm}
        >
          Enquire With This Blueprint <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
