import React, { useEffect, useState, useRef } from "react";
import {
  ArrowUpRight, ArrowRight, Menu, X, Sparkles, PanelsTopLeft,
  ShoppingBag, Workflow, Gauge, Check, Globe2, Mail, ChevronDown,
  Compass, Layers, Zap, Cpu, Award, Star, Activity, Clock,
  MessageSquare, ShieldCheck, HeartHandshake, FileCode2,
  CreditCard, Lock, FileText, Truck, RefreshCw, Shield, Phone
} from "lucide-react";

import ParticleCanvas from "./components/ParticleCanvas";
import HeroVisual from "./components/HeroVisual";
import CustomCursor from "./components/CustomCursor";
import Marquee from "./components/Marquee";
import FloatingControls from "./components/SoundToggle";
import ProjectModal from "./components/ProjectModal";
import ProjectCalculator from "./components/ProjectCalculator";
import PolicyModal from "./components/PolicyModal";
import Confetti from "./components/Confetti";
import { sound } from "./utils/sound";

// The 5 Core Service Divisions from VELSPECTRA Model.md §4
const services = [
  {
    icon: PanelsTopLeft,
    number: "01",
    title: "Website Design & Development",
    badge: "Primary Service",
    desc: "Professional, responsive websites built with React 19 and modern styling that turn visitors into paying customers.",
    tags: ["Business Websites", "High-Converting Landing Pages", "Portfolio Sites", "Corporate Sites"],
    deliverables: [
      "Custom UI/UX Prototypes",
      "Mobile-First Responsive 60fps Code",
      "WhatsApp Direct Contact Button",
      "Basic On-Page SEO Setup"
    ],
    timeline: "5 – 14 Days"
  },
  {
    icon: ShoppingBag,
    number: "02",
    title: "E-Commerce Development",
    badge: "Specialized",
    desc: "Modern digital storefronts engineered for smooth product browsing, seamless shopping carts, and reliable checkout.",
    tags: ["Product Catalogues", "Cart & Checkout Flows", "Razorpay / Stripe Gateways", "Order Management"],
    deliverables: [
      "Product Catalog Architecture",
      "Secure Payment Gateway Integration",
      "Customer Order Notification Flows",
      "Store Administration Setup"
    ],
    timeline: "2 – 4 Weeks"
  },
  {
    icon: Gauge,
    number: "03",
    title: "Website Maintenance & Care",
    badge: "Recurring Retainer",
    desc: "Keep your website healthy, fast, secure, and updated with regular content refreshes and monitoring.",
    tags: ["Content Updates", "Bug Fixes", "Performance Speed Checks", "Security & Backups"],
    deliverables: [
      "Monthly Content & Price Updates",
      "Core Web Vitals Monitoring",
      "Security & Dependency Patches",
      "Direct Priority Founder Support"
    ],
    timeline: "Monthly Retainer"
  },
  {
    icon: Workflow,
    number: "04",
    title: "Business Automation & Integrations",
    badge: "Workflow Efficiency",
    desc: "Connect your website directly to your daily communication channels, CRM, and booking calendars.",
    tags: ["WhatsApp One-Click Enquiry", "Form-to-Email Routing", "Appointment Booking", "Lead Capture Sync"],
    deliverables: [
      "Instant WhatsApp Lead Routing",
      "Interactive Booking Calendar (Cal.com)",
      "Automated Email Inquiries to Owner",
      "Google Sheets Lead Sync"
    ],
    timeline: "3 – 7 Days"
  },
  {
    icon: Zap,
    number: "05",
    title: "Digital Optimization & SEO",
    badge: "Performance & Visibility",
    desc: "Ensure your website loads instantly under 0.8 seconds and is indexed correctly on Google Search.",
    tags: ["SEO Foundations", "Sub-Second Load Times", "Google Analytics", "Conversion Tuning"],
    deliverables: [
      "Lighthouse 95+ Performance Tuning",
      "Meta Tags, OpenGraph & Sitemaps",
      "Google Search Console Indexing",
      "Traffic & Lead Analytics Setup"
    ],
    timeline: "Add-on or Standalone"
  }
];

// Industry-Specific Demonstration Concepts from VELSPECTRA Model.md §3 & §10
const projects = [
  {
    id: "01",
    category: "Restaurants & Cafés",
    name: "The Sunday Table",
    type: "Restaurant & Dining Website",
    tone: "warm",
    label: "A place for good food.",
    challenge: "Restaurants frequently rely solely on Instagram without an organized digital menu, location directions, or one-click table reservation link.",
    tech: ["React 19", "Interactive Menu", "WhatsApp Table Booking", "Google Maps Directions", "Mobile-First"]
  },
  {
    id: "02",
    category: "Salons & Wellness",
    name: "Luxe Aura Studio",
    type: "Salon & Spa Portal",
    tone: "lime",
    label: "Make room to refresh.",
    challenge: "Salons lose customers when their pricing structure is unclear and booking requires phone calls during busy styling sessions.",
    tech: ["Vite", "Service & Pricing Lookbook", "Direct WhatsApp Booking", "Instagram Feed Sync", "Cloudflare Pages"]
  },
  {
    id: "03",
    category: "Clinics & Healthcare",
    name: "Apex Health Clinic",
    type: "Medical Practice Website",
    tone: "blue",
    label: "Clarity for patient care.",
    challenge: "Clinics need to establish immediate professional trust, present doctor credentials, and allow patients to request appointment slots with ease.",
    tech: ["React 19", "Doctor Profiles", "Appointment Enquiry Form", "Patient FAQs", "HIPAA/Privacy Ready"]
  },
  {
    id: "04",
    category: "Corporate & Advisory",
    name: "Northstar Advisory",
    type: "Consulting & Corporate Site",
    tone: "violet",
    label: "Strategic clarity for what comes next.",
    challenge: "Professional firms require a polished corporate identity, case study portfolios, and authoritative presentation to win high-ticket B2B client proposals.",
    tech: ["Tailwind CSS", "Case Study Portfolio", "PDF Proposal Lead Magnet", "Calendly Integration", "Edge Hosting"]
  }
];

// Official Pricing Packages from VELSPECTRA Model.md §5
const pricingPackages = [
  {
    tier: "01 - Entry Level",
    name: "Starter Website",
    priceINR: "₹4,999 – ₹7,999",
    priceUSD: "$99 – $149",
    billing: "One-time project fee",
    tagline: "Ideal for new local businesses establishing their first online presence.",
    features: [
      "1-Page responsive mobile-friendly website",
      "Business introduction, story & photos",
      "Services overview & price/menu showcase",
      "WhatsApp direct enquiry button",
      "Basic SEO setup & Google Maps embed",
      "1 revision round included",
      "Full source code & 100% ownership handover"
    ],
    popular: false
  },
  {
    tier: "02 - Recommended",
    name: "Business Website",
    priceINR: "₹9,999 – ₹19,999",
    priceUSD: "$199 – $399",
    billing: "One-time project fee",
    tagline: "Our most popular package for established businesses, salons, clinics, and firms.",
    features: [
      "Up to 5 standard custom pages",
      "Bespoke visual UI/UX design (Figma)",
      "Contact, enquiry & appointment forms",
      "WhatsApp & social media integrations",
      "On-page SEO optimization & metadata",
      "Sub-second load times on Cloudflare Pages",
      "2 revision rounds included",
      "Full client ownership & documentation"
    ],
    popular: true
  },
  {
    tier: "03 - Advanced",
    name: "Professional Website",
    priceINR: "₹24,999 – ₹49,999",
    priceUSD: "$499 – $999",
    billing: "One-time project fee",
    tagline: "For growing companies, startups, and brands demanding distinctive polish.",
    features: [
      "Custom multi-page web architecture",
      "Interactive animations & micro-interactions",
      "Google Analytics & lead tracking setup",
      "CRM & automated email routing",
      "Comprehensive speed & Core Web Vitals audit",
      "3 revision rounds included",
      "Priority founder support during launch"
    ],
    popular: false
  },
  {
    tier: "04 - Specialized",
    name: "E-Commerce Website",
    priceINR: "₹29,999 – ₹79,999+",
    priceUSD: "$699 – $1,499+",
    billing: "One-time project fee",
    tagline: "Complete online storefront with payment gateways and order management.",
    features: [
      "Full product catalogue & category browsing",
      "Shopping cart & streamlined checkout",
      "Razorpay / Stripe payment gateway integration",
      "Automated order email & WhatsApp alerts",
      "Store administration management setup",
      "Pre-launch testing & security audit",
      "Post-launch staff handover guide"
    ],
    popular: false
  }
];

// Monthly Care Retainers from Model.md §5.C
const carePlans = [
  { name: "Basic Care", inr: "₹499", usd: "$9", desc: "Minor content, text & image updates" },
  { name: "Standard Care", inr: "₹999", usd: "$19", desc: "Regular updates, bug fixes, security & speed monitoring", popular: true },
  { name: "Premium Care", inr: "₹1,999", usd: "$39", desc: "Priority updates, monthly analytics & direct founder hotline" }
];

const metrics = [
  { value: "100%", label: "Client Code Ownership", sub: "Domain, host & code in your name" },
  { value: "< 0.8s", label: "Mobile Loading Speed", sub: "Cloudflare Pages global edge CDN" },
  { value: "₹0", label: "Hidden Subscriptions", sub: "Transparent milestone pricing" },
  { value: "Direct", label: "Founder Collaboration", sub: "Zero middleman account managers" },
];

// Global smooth navigation helper that updates clean URLs without '#'
export const scrollToSection = (id) => {
  const cleanId = id ? id.replace(/^\/?#?/, "") : "home";
  if (!cleanId || cleanId === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.pushState(null, "", "/");
    return;
  }
  const el = document.getElementById(cleanId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
    window.history.pushState(null, "", `/${cleanId}`);
  }
};

function Logo({ footer = false, onNavigate }) {
  return (
    <a
      className={`brand ${footer ? "brand-footer" : ""}`}
      href="/"
      aria-label="VELSPECTRA home"
      onClick={(e) => {
        e.preventDefault();
        sound.playClick();
        if (onNavigate) onNavigate("home");
        else scrollToSection("home");
      }}
      onMouseEnter={() => sound.playHover()}
    >
      <div className="brand-mark-wrap">
        <img src="/velspectra-v-icon.png" alt="" className="brand-mark" />
        <span className="brand-glow" />
      </div>
      <span>VELSPECTRA</span>
    </a>
  );
}

function Header({ currency, setCurrency, onNavigate }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links = [
    ["Services", "services"],
    ["Pricing", "pricing"],
    ["Work", "work"],
    ["Process", "process"],
    ["About", "about"]
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container nav-wrap">
        <Logo onNavigate={onNavigate} />
        <nav className={open ? "nav nav-open" : "nav"}>
          {links.map(([label, sectionId]) => (
            <a
              key={label}
              href={`/${sectionId}`}
              onClick={(e) => {
                e.preventDefault();
                sound.playClick();
                setOpen(false);
                if (onNavigate) onNavigate(sectionId);
                else scrollToSection(sectionId);
              }}
              onMouseEnter={() => sound.playHover()}
            >
              {label}
            </a>
          ))}

          {/* Currency Toggle */}
          <div className="currency-switch-pill">
            <button
              type="button"
              className={`curr-btn ${currency === "INR" ? "is-curr-active" : ""}`}
              onClick={() => {
                sound.playClick();
                setCurrency("INR");
              }}
            >
              ₹ INR
            </button>
            <button
              type="button"
              className={`curr-btn ${currency === "USD" ? "is-curr-active" : ""}`}
              onClick={() => {
                sound.playClick();
                setCurrency("USD");
              }}
            >
              $ USD
            </button>
          </div>

          <a
            className="nav-cta"
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              sound.playClick();
              setOpen(false);
              if (onNavigate) onNavigate("contact");
              else scrollToSection("contact");
            }}
            onMouseEnter={() => sound.playHover()}
          >
            Start a project <ArrowUpRight size={15} />
          </a>
        </nav>
        <button
          className="menu-toggle"
          onClick={() => {
            sound.playClick();
            setOpen(!open);
          }}
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

function ProjectCard({ project, onSelect }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, px: 50, py: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const py = Math.max(0, Math.min(100, (y / rect.height) * 100));
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -6;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 6;
    setTilt({ rx, ry, px, py });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    sound.playHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0, px: 50, py: 50 });
  };

  return (
    <article
      ref={cardRef}
      className={`project-card project-${project.tone} ${isHovered ? "is-tilted" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        sound.playClick();
        onSelect(project);
      }}
      data-cursor="DEMO"
    >
      <div
        className="project-card-inner"
        style={{
          transform: isHovered
            ? `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(8px)`
            : "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
          transition: isHovered ? "transform 0.08s linear" : "transform 0.35s ease-out",
        }}
      >
        <div className="project-art">
          <div
            className="project-sheen"
            style={{
              background: `radial-gradient(circle at ${tilt.px}% ${tilt.py}%, rgba(255,255,255,0.45) 0%, transparent 65%)`,
              opacity: isHovered ? 1 : 0,
            }}
          />

          <div className="project-browser">
            <span /><span /><span />
            <small>INDUSTRY BLUEPRINT / {project.id}</small>
          </div>

          <div className="project-art-content">
            <span className="project-kicker">{project.category}</span>
            <h3>{project.label}</h3>
            <div className="project-art-bottom">
              <span>{project.name}</span>
              <span className="round-arrow">
                <ArrowUpRight size={18} />
              </span>
            </div>
          </div>

          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-orbit orbit-three" />
        </div>

        <div className="project-meta">
          <div>
            <span className="eyebrow">{project.id} / {project.type}</span>
            <h3>{project.name}</h3>
          </div>
          <span className="project-link" aria-label="Open case study">
            <ArrowUpRight size={18} />
          </span>
        </div>
      </div>
    </article>
  );
}

function App() {
  const [currency, setCurrency] = useState("INR");
  const [submitted, setSubmitted] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [expandedService, setExpandedService] = useState(null);
  const [activeProcessStep, setActiveProcessStep] = useState(0);

  // Compliance modal state
  const [activePolicy, setActivePolicy] = useState(null);

  // Clean URL Path routing & complete removal of '#' hashes
  useEffect(() => {
    const handleCleanRoute = () => {
      // 1. If user loaded with a legacy '#' hash (e.g. /#pricing), convert it to clean URL immediately
      if (window.location.hash) {
        const rawHash = window.location.hash.replace("#", "").toLowerCase();
        const cleanPath = rawHash === "home" ? "/" : `/${rawHash}`;
        window.history.replaceState(null, "", cleanPath);
      }

      // 2. Parse clean pathname without leading/trailing slashes
      const path = window.location.pathname.replace(/^\/|\/$/g, "").toLowerCase();

      if (path === "terms") {
        setActivePolicy("terms");
      } else if (path === "privacy") {
        setActivePolicy("privacy");
      } else if (path === "refund" || path === "refunds") {
        setActivePolicy("refund");
      } else if (path === "delivery") {
        setActivePolicy("delivery");
      } else if (path === "contact-info" || path === "business-info") {
        setActivePolicy("contact");
      } else if (path === "payment-process" || path === "how-to-pay") {
        setActivePolicy("payment");
      } else if (path) {
        // Section smooth scroll (/services, /pricing, /work, /process, /about, /contact)
        const targetElement = document.getElementById(path);
        if (targetElement) {
          setTimeout(() => {
            targetElement.scrollIntoView({ behavior: "smooth" });
          }, 150);
        }
      }
    };

    handleCleanRoute();
    window.addEventListener("popstate", handleCleanRoute);
    return () => window.removeEventListener("popstate", handleCleanRoute);
  }, []);

  // Form states
  const [formCategory, setFormCategory] = useState("Business Website (₹9,999 - ₹19,999)");
  const [formBudget, setFormBudget] = useState(currency === "INR" ? "₹10,000 – ₹20,000" : "$200 – $400");
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailDelivered, setEmailDelivered] = useState(false);

  const budgetsINR = ["₹5,000 – ₹10,000", "₹10,000 – ₹20,000", "₹20,000 – ₹50,000", "₹50,000+"];
  const budgetsUSD = ["$100 – $200", "$200 – $400", "$400 – $1,000", "$1,000+"];

  // Update budget selection when currency switches
  useEffect(() => {
    if (currency === "INR") {
      setFormBudget("₹10,000 – ₹20,000");
    } else {
      setFormBudget("$200 – $400");
    }
  }, [currency]);

  // Format pre-filled WhatsApp lead text with complete content and project link
  const getWhatsAppEnquiryUrl = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://velspectra.in";
    const text =
      `*⚡ New Project Enquiry — VELSPECTRA*\n\n` +
      `*Client Name:* ${formName || "Valued Client"}\n` +
      `*Email:* ${formEmail || "Not provided"}\n` +
      `*Phone:* ${formPhone || "Not provided"}\n` +
      `*Selected Package:* ${formCategory}\n` +
      `*Target Budget:* ${currency} ${formBudget}\n\n` +
      `*Project Requirements & Details:*\n${formMessage || "I need a professional website developed."}\n\n` +
      `*Project Reference Link:* ${origin}/services\n` +
      `— Dispatched automatically via velspectra.in`;
    return `https://wa.me/918310490313?text=${encodeURIComponent(text)}`;
  };

  // Robust reveal observer
  useEffect(() => {
    const nodes = document.querySelectorAll(
      ".intro-content, .section-heading, .service-row, .project-card, .process-intro, .process-step, .statement-inner, .contact-copy, .contact-form, .metric-card, .calculator-widget, .pricing-card, .care-card"
    );

    nodes.forEach((node) => {
      if (node.getAttribute("data-visible") !== "true") {
        node.setAttribute("data-reveal", "");
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true");
            entry.target.setAttribute("data-reveal", "visible");
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );

    nodes.forEach((node) => {
      if (node.getAttribute("data-visible") !== "true") {
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, [selectedFilter, currency]);

  // Handle calculator selection transfer
  const handleScopeSelect = (packageName, summary) => {
    setFormCategory(packageName);
    setFormMessage((prev) =>
      prev ? `${prev}\n\n[Blueprint]: ${summary}` : `Hi VELSPECTRA team,\n\nI want to get started with the ${packageName} package.\n\nBlueprint details:\n• ${summary}\n\nPlease share the timeline and next steps.`
    );
  };

  // Real Option 3: Dual Transmission (Email to vishwanathdvgmm@gmail.com + WhatsApp sync)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    sound.playClick();

    const payload = {
      _subject: `⚡ VELSPECTRA Lead: ${formName} (${formCategory})`,
      _replyto: formEmail,
      "Client Name": formName,
      "Client Email": formEmail,
      "Client Phone / WhatsApp": formPhone || "Not provided",
      "Selected Package": formCategory,
      "Target Budget": `${currency} ${formBudget}`,
      "Project Requirements": formMessage,
      "Submission Timestamp": new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      _template: "table",
      _captcha: "false"
    };

    let delivered = false;

    // 1. Direct API delivery to your verified Gmail via FormSubmit
    try {
      const res = await fetch("https://formsubmit.co/ajax/vishwanathdvgmm@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        delivered = true;
      }
    } catch (err) {
      console.warn("Direct email delivery note:", err);
    }

    // 2. Cloudflare Serverless Function fallback
    try {
      await fetch("/api/send-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          phone: formPhone,
          package: formCategory,
          budget: `${currency} ${formBudget}`,
          message: formMessage,
          currency: currency
        })
      });
    } catch (_) {}

    setEmailDelivered(delivered);
    setIsSubmitting(false);
    sound.playSuccess();
    setSubmitted(true);

    // 3. Automatic instant WhatsApp automation with full project content & link
    setTimeout(() => {
      window.open(getWhatsAppEnquiryUrl(), "_blank");
    }, 400);
  };

  const filteredProjects =
    selectedFilter === "all"
      ? projects
      : projects.filter(
          (p) =>
            p.category.toLowerCase().includes(selectedFilter) ||
            p.type.toLowerCase().includes(selectedFilter)
        );

  return (
    <>
      <CustomCursor />
      {submitted && <Confetti />}
      <FloatingControls />

      {/* Case Study Demonstration Modal */}
      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}

      {/* Mandatory Regulatory Compliance & Legal Modals */}
      {activePolicy && (
        <PolicyModal
          policyType={activePolicy}
          onClose={() => {
            setActivePolicy(null);
            window.history.replaceState(null, "", "/");
          }}
        />
      )}

      <Header
        currency={currency}
        setCurrency={setCurrency}
        onNavigate={scrollToSection}
      />

      <main>
        {/* HERO SECTION */}
        <section className="hero" id="home">
          <ParticleCanvas />
          <div className="hero-grid" />
          <div className="hero-ambient-glow glow-pink" />
          <div className="hero-ambient-glow glow-blue" />

          <div className="container hero-inner">
            <div className="hero-copy">
              <div className="eyebrow hero-eyebrow">
                <span className="status-dot" />
                <span>INDEPENDENT DIGITAL SOLUTIONS AGENCY</span>
                <span className="eyebrow-line" />
              </div>

              <h1>
                Make your<br />
                <span>next move</span><br />
                mean more.
              </h1>

              <p className="hero-description">
                VELSPECTRA helps businesses establish and improve their digital presence through professionally designed websites, e-commerce stores and practical digital automation.
              </p>

              <div className="hero-actions">
                <a
                  className="button button-primary"
                  href="/pricing"
                  onMouseEnter={() => sound.playHover()}
                  onClick={(e) => {
                    e.preventDefault();
                    sound.playClick();
                    scrollToSection("pricing");
                  }}
                >
                  View Packages & Pricing <ArrowUpRight size={17} />
                </a>
                <a
                  className="text-link"
                  href="/work"
                  onMouseEnter={() => sound.playHover()}
                  onClick={(e) => {
                    e.preventDefault();
                    sound.playClick();
                    scrollToSection("work");
                  }}
                >
                  Explore Industry Demos <ArrowRight size={16} />
                </a>
              </div>

              {/* Direct Value Badges from Model.md */}
              <div className="hero-tech-pills">
                <span className="hero-pill">✦ 100% Client Code Ownership</span>
                <span className="hero-pill">✦ Direct Founder Delivery</span>
                <span className="hero-pill">✦ WhatsApp Lead Routing</span>
              </div>
            </div>

            <HeroVisual />

            <div className="hero-bottom">
              <span>BUILDING DIGITAL EXPERIENCES THAT MOVE BUSINESSES FORWARD.</span>
              <a
                href="/services"
                onMouseEnter={() => sound.playHover()}
                onClick={(e) => {
                  e.preventDefault();
                  sound.playClick();
                  scrollToSection("services");
                }}
              >
                SCROLL TO EXPLORE <span>↓</span>
              </a>
            </div>
          </div>
        </section>

        {/* KINETIC MARQUEE BANNER */}
        <Marquee />

        {/* SECTION 01: ABOUT & VALUE PROPOSITION */}
        <section className="intro section-pad" id="about">
          <div className="container intro-grid">
            <div className="eyebrow">01 / WHO WE ARE</div>
            <div className="intro-content">
              <h2>
                Good businesses deserve a{" "}
                <span>better digital presence.</span>
              </h2>
              <div className="intro-bottom">
                <p>
                  VELSPECTRA is not simply selling website code. We sell complete business outcomes: professional presentation of your products and services, customer discovery, automated WhatsApp enquiries, and systems that simplify everyday business operations.
                </p>
                <a
                  className="text-link"
                  href="/pricing"
                  onMouseEnter={() => sound.playHover()}
                  onClick={(e) => {
                    e.preventDefault();
                    sound.playClick();
                    scrollToSection("pricing");
                  }}
                >
                  See Transparent Pricing <ArrowUpRight size={16} />
                </a>
              </div>

              {/* 4 Foundation Metrics from Model.md */}
              <div className="metrics-grid">
                {metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="metric-card"
                    onMouseEnter={() => sound.playHover()}
                  >
                    <div className="metric-value">{m.value}</div>
                    <div className="metric-label">{m.label}</div>
                    <div className="metric-sub">{m.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 02: THE 5 SERVICE DIVISIONS */}
        <section className="services section-pad" id="services">
          <div className="container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">02 / SERVICE CATALOGUE</div>
                <h2>
                  Focused services built around<br />
                  <span>your business outcomes.</span>
                </h2>
              </div>
              <p>
                A focused service portfolio spanning high-speed websites, e-commerce storefronts, maintenance retainers, and WhatsApp automation.
              </p>
            </div>

            <div className="service-list">
              {services.map(({ icon: Icon, number, title, badge, desc, tags, deliverables, timeline }) => {
                const isExpanded = expandedService === number;
                return (
                  <article
                    className={`service-row ${isExpanded ? "is-expanded" : ""}`}
                    key={number}
                    onClick={() => {
                      sound.playClick();
                      setExpandedService(isExpanded ? null : number);
                    }}
                    onMouseEnter={() => sound.playHover()}
                    data-cursor="EXPAND"
                  >
                    <span className="service-number">{number}</span>
                    <div className="service-icon">
                      <Icon size={23} />
                    </div>
                    <div className="service-main">
                      <div className="service-title-row">
                        <h3>{title}</h3>
                        <span className="service-timeline-badge">
                          <Clock size={12} /> {timeline}
                        </span>
                        <span className="service-division-badge">{badge}</span>
                      </div>
                      <p>{desc}</p>
                      <div className="service-tags">
                        {tags.map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </div>

                      {/* Expandable deliverables breakdown */}
                      {isExpanded && (
                        <div className="service-details-drawer">
                          <div className="deliverables-heading">Deliverables & Scope:</div>
                          <div className="deliverables-grid">
                            {deliverables.map((item, i) => (
                              <div key={i} className="deliverable-item">
                                <Check size={14} className="deliverable-check" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      className="service-arrow"
                      aria-label={`Toggle details for ${title}`}
                      type="button"
                    >
                      <ArrowUpRight size={18} />
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 03: TRANSPARENT PACKAGES & PRICING */}
        <section className="pricing section-pad" id="pricing">
          <div className="container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">03 / PACKAGES & TRANSPARENT PRICING</div>
                <h2>
                  Predictable investments.<br />
                  <span>Zero hidden charges.</span>
                </h2>
              </div>
              <div className="pricing-header-right">
                <p>
                  Clearly defined page counts, revision limits, and inclusions. You always own 100% of your domain, hosting, and code.
                </p>
                <div className="currency-selector-badge">
                  <span>Showing in:</span>
                  <button
                    type="button"
                    className={currency === "INR" ? "active" : ""}
                    onClick={() => setCurrency("INR")}
                  >
                    ₹ INR (India)
                  </button>
                  <button
                    type="button"
                    className={currency === "USD" ? "active" : ""}
                    onClick={() => setCurrency("USD")}
                  >
                    $ USD (International)
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Core Packages Grid from Model.md §5.A */}
            <div className="pricing-grid">
              {pricingPackages.map((pkg, idx) => (
                <div
                  key={idx}
                  className={`pricing-card ${pkg.popular ? "is-featured" : ""}`}
                  onMouseEnter={() => sound.playHover()}
                >
                  {pkg.popular && <div className="popular-badge">RECOMMENDED</div>}
                  <div className="pkg-tier">{pkg.tier}</div>
                  <h3 className="pkg-name">{pkg.name}</h3>
                  <div className="pkg-price-wrap">
                    <span className="pkg-price">
                      {currency === "INR" ? pkg.priceINR : pkg.priceUSD}
                    </span>
                    <span className="pkg-billing">{pkg.billing}</span>
                  </div>
                  <p className="pkg-tagline">{pkg.tagline}</p>

                  <ul className="pkg-features">
                    {pkg.features.map((feat, fIdx) => (
                      <li key={fIdx}>
                        <Check size={14} className="feature-check" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="/contact"
                    className={`button ${pkg.popular ? "button-primary" : "button-secondary"}`}
                    onClick={(e) => {
                      e.preventDefault();
                      sound.playClick();
                      setFormCategory(`${pkg.name} (${currency === "INR" ? pkg.priceINR : pkg.priceUSD})`);
                      scrollToSection("contact");
                    }}
                  >
                    Select {pkg.name} <ArrowUpRight size={15} />
                  </a>
                </div>
              ))}
            </div>

            {/* Monthly Care Retainers from Model.md §5.C */}
            <div className="care-section">
              <div className="care-header">
                <div>
                  <span className="eyebrow">RECURRING SUPPORT</span>
                  <h3>Website Care & Maintenance Retainers</h3>
                </div>
                <p>Never worry about content updates, broken links, or speed degradation after launch.</p>
              </div>

              <div className="care-grid">
                {carePlans.map((plan, idx) => (
                  <div key={idx} className={`care-card ${plan.popular ? "care-featured" : ""}`}>
                    <div className="care-top">
                      <h4>{plan.name}</h4>
                      <div className="care-price">
                        {currency === "INR" ? plan.inr : plan.usd}
                        <span>/ month</span>
                      </div>
                    </div>
                    <p>{plan.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Scope & Timeline Calculator */}
            <ProjectCalculator
              currency={currency}
              onSelectScope={handleScopeSelect}
            />

            {/* Payment Process Notice from Payment_Model.md §6 */}
            <div className="payment-notice-card">
              <div className="payment-notice-icon">
                <ShieldCheck size={26} color="#7ad8e8" />
              </div>
              <div className="payment-notice-content">
                <h4>Structured, Transparent Payment Process</h4>
                <p>
                  VELSPECTRA accepts payments via agreed manual methods (UPI &amp; domestic bank transfers for India; supported international bank wires for overseas clients). Payment details are issued on an official project invoice only after your scope and quotation are approved. Work commences once the agreed 50% advance has been independently verified.
                </p>
                <div className="payment-notice-milestones">
                  <span><strong>50%</strong> Project Advance</span>
                  <span><strong>30%</strong> Development Milestone</span>
                  <span><strong>20%</strong> Final Handover</span>
                </div>
              </div>
              <button
                type="button"
                className="payment-notice-btn"
                onClick={() => {
                  sound.playClick();
                  setActivePolicy("payment");
                  window.history.pushState(null, "", "/payment-process");
                }}
              >
                Payment Workflow &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 04: INDUSTRY DEMONSTRATIONS / TEMPLATES */}
        <section className="work section-pad" id="work">
          <div className="container">
            <div className="section-heading work-heading">
              <div>
                <div className="eyebrow">04 / DEMONSTRATION WORK</div>
                <h2>
                  Tailored solutions for<br />
                  <span>real businesses.</span>
                </h2>
              </div>
              <p>
                Reusable, high-speed industry architectures adapted to restaurants, clinics, wellness studios, and corporate advisories.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="project-filters">
              {[
                ["all", "All Industries"],
                ["restaurants", "Restaurants & Cafés"],
                ["wellness", "Salons & Spas"],
                ["clinics", "Clinics & Doctors"],
                ["corporate", "Corporate & Consulting"]
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`filter-btn ${selectedFilter === key ? "is-active" : ""}`}
                  onClick={() => {
                    sound.playClick();
                    setSelectedFilter(key);
                  }}
                  onMouseEnter={() => sound.playHover()}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="project-grid">
              {filteredProjects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onSelect={(proj) => setActiveProject(proj)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 05: HOW WE WORK (SOP FROM MODEL.MD §8) */}
        <section className="process section-pad" id="process">
          <div className="container process-grid">
            <div className="process-intro">
              <div className="eyebrow">05 / HOW WE DELIVER</div>
              <h2>
                Clear steps.<br />
                <span>Honest agreements.</span>
              </h2>
              <p>
                A standard operating procedure that protects your time, ensures high design quality, and guarantees you own your entire digital asset.
              </p>

              <div className="process-guarantee">
                <div className="guarantee-icon"><ShieldCheck size={18} /></div>
                <div>
                  <strong>Client Ownership Policy</strong>
                  <p>You own your domain, hosting, and complete source code. No proprietary lock-in. Zero surprise monthly software fees.</p>
                </div>
              </div>

              <div className="process-guarantee" style={{ marginTop: "14px" }}>
                <div className="guarantee-icon"><HeartHandshake size={18} /></div>
                <div>
                  <strong>Simple Payment Terms</strong>
                  <p>50% advance before development begins, 50% only after you approve the preview and before final deployment.</p>
                </div>
              </div>
            </div>

            <div className="process-steps">
              {[
                {
                  n: "01",
                  t: "Discovery & Requirements",
                  d: "We learn about your business, target audience, required pages, and features. We provide a transparent written quotation and agreed scope.",
                  tag: "Days 1–2",
                  items: ["Requirements alignment", "Fixed price quote", "No-obligation discussion"]
                },
                {
                  n: "02",
                  t: "Visual Design & Prototype",
                  d: "We design a clean, responsive prototype in Figma tailored to your branding, colours, and offerings. 50% project advance is collected.",
                  tag: "Days 3–5",
                  items: ["Figma visual prototype", "Content & image placement", "Client review & revisions"]
                },
                {
                  n: "03",
                  t: "Development & Integrations",
                  d: "We build your website using modern React 19 + Vite, configure WhatsApp direct buttons, contact forms, and mobile layouts.",
                  tag: "Days 6–10",
                  items: ["Sub-second mobile speed", "WhatsApp & form setup", "Cross-browser QA testing"]
                },
                {
                  n: "04",
                  t: "Deployment & Complete Handover",
                  d: "We connect your custom domain on Cloudflare Pages, verify SSL, complete the final payment, and hand over all code and credentials.",
                  tag: "Day 12+",
                  items: ["Live domain launch", "Ownership handover doc", "Optional care plan"]
                }
              ].map((step, idx) => {
                const isActive = activeProcessStep === idx;
                return (
                  <div
                    className={`process-step ${isActive ? "is-active" : ""}`}
                    key={step.n}
                    onClick={() => {
                      sound.playClick();
                      setActiveProcessStep(idx);
                    }}
                    onMouseEnter={() => sound.playHover()}
                    data-cursor="STEP"
                  >
                    <span className="step-num">{step.n}</span>
                    <div className="step-body">
                      <div className="step-title-line">
                        <h3>{step.t}</h3>
                        <span className="step-tag">{step.tag}</span>
                      </div>
                      <p>{step.d}</p>
                      {isActive && (
                        <div className="step-inclusions">
                          {step.items.map((it, i) => (
                            <span key={i} className="step-chip">✓ {it}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="step-indicator">
                      <Check size={16} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* STATEMENT BANNER */}
        <section className="statement">
          <div className="container statement-inner">
            <Sparkles size={22} className="statement-sparkle" />
            <div className="statement-text">
              <p>
                Building digital experiences that <span>move businesses forward.</span><br />
                Direct founder craft. Real outcomes.
              </p>
            </div>
            
            {/* Audio frequency wave animation */}
            <div className="audio-wave" aria-hidden="true">
              <span className="wave-bar bar-1" />
              <span className="wave-bar bar-2" />
              <span className="wave-bar bar-3" />
              <span className="wave-bar bar-4" />
              <span className="wave-bar bar-5" />
            </div>

            <span className="statement-index">VELSPECTRA // 2026</span>
          </div>
        </section>

        {/* SECTION 06: CONTACT & ENQUIRY */}
        <section className="contact section-pad" id="contact">
          <div className="container contact-grid">
            <div className="contact-copy">
              <div className="eyebrow">06 / START YOUR PROJECT</div>
              <h2>
                Ready to build a<br />
                <span>better website?</span>
              </h2>
              <p>
                Tell us about your business and goals. We will review your requirements and provide a clear quotation and timeline.
              </p>

              <div className="contact-direct">
                <a
                  href="mailto:vishwanathdvgmm@gmail.com"
                  onMouseEnter={() => sound.playHover()}
                  onClick={() => sound.playClick()}
                >
                  <Mail size={17} /> vishwanathdvgmm@gmail.com
                </a>
                <a
                  href="tel:+918310490313"
                  onMouseEnter={() => sound.playHover()}
                  onClick={() => sound.playClick()}
                >
                  <Phone size={17} /> +91 8310490313
                </a>
                <a
                  href="https://wa.me/918310490313?text=Hi%20VELSPECTRA,%20I'm%20interested%20in%20a%20website%20for%20my%20business."
                  target="_blank"
                  rel="noreferrer"
                  className="whatsapp-direct-link"
                  onMouseEnter={() => sound.playHover()}
                  onClick={() => sound.playClick()}
                >
                  <MessageSquare size={17} /> Chat on WhatsApp (+91 8310490313) ↗
                </a>
                <span>
                  <Globe2 size={17} /> Operating from India · Serving local & international clients
                </span>
                <span>
                  <Activity size={17} /> Currently accepting new website projects
                </span>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleFormSubmit}>
              {submitted ? (
                <div className="success-state">
                  <div className="success-icon">
                    <Check size={28} />
                  </div>
                  <h3>Enquiry Successfully Dispatched!</h3>
                  <p>
                    Thank you, <strong>{formName || "there"}</strong>. Your project requirements for <strong>{formCategory}</strong> have been delivered directly to our inbox at <strong>vishwanathdvgmm@gmail.com</strong>.
                  </p>

                  <div className="whatsapp-lead-bridge">
                    <div className="bridge-icon">
                      <MessageSquare size={22} color="#25d366" />
                    </div>
                    <div className="bridge-text">
                      <strong>Instant WhatsApp Priority Hotline</strong>
                      <p>Want to discuss your project right away? Forward these details straight to Vishwanath on WhatsApp.</p>
                    </div>
                    <a
                      href={getWhatsAppEnquiryUrl()}
                      target="_blank"
                      rel="noreferrer"
                      className="whatsapp-bridge-btn"
                      onClick={() => sound.playClick()}
                    >
                      Open in WhatsApp ↗
                    </a>
                  </div>

                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => {
                      sound.playClick();
                      setSubmitted(false);
                    }}
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <>
                  <div className="form-row">
                    <label>
                      Your name *
                      <input
                        required
                        name="name"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Rahul Sharma / Sarah Jenkins"
                      />
                    </label>
                    <label>
                      Email address *
                      <input
                        required
                        type="email"
                        name="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="you@business.com"
                      />
                    </label>
                  </div>

                  <div className="form-row">
                    <label>
                      Phone / WhatsApp (Optional)
                      <input
                        name="phone"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                      />
                    </label>
                    <label>
                      Selected Package / Service *
                      <span className="select-wrap">
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                        >
                          <option>Starter Website (₹4,999 – ₹7,999 / $99 – $149)</option>
                          <option>Business Website (₹9,999 – ₹19,999 / $199 – $399)</option>
                          <option>Professional Website (₹24,999 – ₹49,999 / $499 – $999)</option>
                          <option>E-Commerce Website (₹29,999 – ₹79,999+ / $699 – $1,499+)</option>
                          <option>Website Maintenance Retainer</option>
                          <option>WhatsApp Automation & Custom Integrations</option>
                        </select>
                        <ChevronDown size={16} />
                      </span>
                    </label>
                  </div>

                  <div className="form-budget-group">
                    <label className="budget-label">Target Project Budget ({currency})</label>
                    <div className="budget-chips">
                      {(currency === "INR" ? budgetsINR : budgetsUSD).map((b) => (
                        <button
                          type="button"
                          key={b}
                          className={`budget-chip ${formBudget === b ? "is-selected" : ""}`}
                          onClick={() => {
                            sound.playClick();
                            setFormBudget(b);
                          }}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label>
                    Tell us about your business and website needs *
                    <textarea
                      required
                      name="message"
                      rows={4}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="e.g. We run a café in Bengaluru and need a mobile-friendly menu, location map, and WhatsApp table reservation button..."
                    />
                  </label>

                  <button
                    className={`button button-primary form-submit ${isSubmitting ? "is-loading" : ""}`}
                    type="submit"
                    disabled={isSubmitting}
                    onMouseEnter={() => sound.playHover()}
                  >
                    {isSubmitting ? (
                      <span>Sending to Inbox...</span>
                    ) : (
                      <>
                        <span>Send Project Enquiry</span> <ArrowUpRight size={17} />
                      </>
                    )}
                  </button>
                  <p className="form-note">
                    We value privacy. 100% confidential. No spam, ever.
                  </p>
                </>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-top">
          <div>
            <Logo footer />
            <p>
              VELSPECTRA is an independent digital solutions agency.<br />
              Building digital experiences that move businesses forward.
            </p>
            <p className="footer-subtext">
              Domain: <strong>velspectra.in</strong> · Sole Proprietorship · Operating from India & serving worldwide.
            </p>
            <div className="footer-trust-badges">
              <span><ShieldCheck size={13} color="#34d399" /> Direct Verified Banking &amp; UPI</span>
              <span><Lock size={13} color="#7ad8e8" /> 256-Bit SSL Encrypted</span>
            </div>
          </div>
          <div className="footer-links">
            <div>
              <span className="eyebrow">SERVICES</span>
              <a
                href="/services"
                onClick={(e) => {
                  e.preventDefault();
                  sound.playClick();
                  scrollToSection("services");
                }}
              >
                Website Development
              </a>
              <a
                href="/services"
                onClick={(e) => {
                  e.preventDefault();
                  sound.playClick();
                  scrollToSection("services");
                }}
              >
                E-Commerce Stores
              </a>
              <a
                href="/services"
                onClick={(e) => {
                  e.preventDefault();
                  sound.playClick();
                  scrollToSection("services");
                }}
              >
                Maintenance Retainers
              </a>
              <a
                href="/services"
                onClick={(e) => {
                  e.preventDefault();
                  sound.playClick();
                  scrollToSection("services");
                }}
              >
                WhatsApp Automation
              </a>
              <a
                href="/services"
                onClick={(e) => {
                  e.preventDefault();
                  sound.playClick();
                  scrollToSection("services");
                }}
              >
                Digital Optimization & SEO
              </a>
            </div>
            <div>
              <span className="eyebrow">PACKAGES</span>
              <a
                href="/pricing"
                onClick={(e) => {
                  e.preventDefault();
                  sound.playClick();
                  scrollToSection("pricing");
                }}
              >
                Starter (₹4,999+)
              </a>
              <a
                href="/pricing"
                onClick={(e) => {
                  e.preventDefault();
                  sound.playClick();
                  scrollToSection("pricing");
                }}
              >
                Business (₹9,999+)
              </a>
              <a
                href="/pricing"
                onClick={(e) => {
                  e.preventDefault();
                  sound.playClick();
                  scrollToSection("pricing");
                }}
              >
                Professional (₹24,999+)
              </a>
              <a
                href="/pricing"
                onClick={(e) => {
                  e.preventDefault();
                  sound.playClick();
                  scrollToSection("pricing");
                }}
              >
                E-Commerce (₹29,999+)
              </a>
              <a
                href="/pricing"
                onClick={(e) => {
                  e.preventDefault();
                  sound.playClick();
                  scrollToSection("pricing");
                }}
              >
                Monthly Care Plans
              </a>
            </div>
            <div>
              <span className="eyebrow">LEGAL & POLICIES</span>
              <button
                type="button"
                className="footer-policy-link"
                onClick={() => {
                  sound.playClick();
                  setActivePolicy("terms");
                  window.history.pushState(null, "", "/terms");
                }}
              >
                Terms & Conditions
              </button>
              <button
                type="button"
                className="footer-policy-link"
                onClick={() => {
                  sound.playClick();
                  setActivePolicy("privacy");
                  window.history.pushState(null, "", "/privacy");
                }}
              >
                Privacy Policy
              </button>
              <button
                type="button"
                className="footer-policy-link"
                onClick={() => {
                  sound.playClick();
                  setActivePolicy("refund");
                  window.history.pushState(null, "", "/refund");
                }}
              >
                Refund & Cancellation
              </button>
              <button
                type="button"
                className="footer-policy-link"
                onClick={() => {
                  sound.playClick();
                  setActivePolicy("delivery");
                  window.history.pushState(null, "", "/delivery");
                }}
              >
                Digital Delivery Policy
              </button>
              <button
                type="button"
                className="footer-policy-link"
                onClick={() => {
                  sound.playClick();
                  setActivePolicy("contact");
                  window.history.pushState(null, "", "/contact-info");
                }}
              >
                Business Information
              </button>
              <button
                type="button"
                className="footer-policy-link"
                onClick={() => {
                  sound.playClick();
                  setActivePolicy("payment");
                  window.history.pushState(null, "", "/payment-process");
                }}
              >
                Payment Workflow
              </button>
            </div>
            <div>
              <span className="eyebrow">CLIENT & PAYMENTS</span>
              <button
                type="button"
                className="footer-pay-btn"
                onClick={() => {
                  sound.playClick();
                  setActivePolicy("payment");
                  window.history.pushState(null, "", "/payment-process");
                }}
              >
                <FileText size={14} /> How Payment Works
              </button>
              <a href="mailto:vishwanathdvgmm@gmail.com">vishwanathdvgmm@gmail.com</a>
              <a href="tel:+918310490313" className="phone-footer-link">
                <Phone size={13} /> +91 8310490313
              </a>
              <a
                href="https://wa.me/918310490313?text=Hi%20VELSPECTRA,%20I'm%20contacting%20regarding%20my%20website%20project."
                target="_blank"
                rel="noreferrer"
                className="whatsapp-footer-link"
              >
                <MessageSquare size={13} /> WhatsApp (+91 8310490313)
              </a>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  sound.playClick();
                  scrollToSection("home");
                }}
              >
                Back to top ↑
              </a>
            </div>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} VELSPECTRA (velspectra.in). ALL RIGHTS RESERVED.</span>
          <span>SOLE PROPRIETORSHIP · INDEPENDENT DIGITAL STUDIO</span>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              sound.playClick();
              scrollToSection("home");
            }}
          >
            V / TOP
          </a>
        </div>
      </footer>
    </>
  );
}

export default App;
