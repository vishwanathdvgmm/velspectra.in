import React, { useState, useEffect } from "react";
import {
  Lock,
  Unlock,
  ShieldCheck,
  CreditCard,
  QrCode,
  FileText,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Save,
  RefreshCw,
  X,
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  Building,
  Landmark,
} from "lucide-react";
import { sound } from "../utils/sound";

const DEFAULT_BANK_CONFIG = {
  accountHolder: "VISHWANATH M M (VELSPECTRA)",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  accountType: "Savings",
  upiId: "vishwanathdvgmm@slc",
};

export default function AdminPortal({ onClose }) {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return (
      typeof window !== "undefined" &&
      localStorage.getItem("velspectra_admin_auth") === "true"
    );
  });
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  // Bank Configuration state
  const [bankConfig, setBankConfig] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("velspectra_bank_config");
      if (saved) {
        try {
          return { ...DEFAULT_BANK_CONFIG, ...JSON.parse(saved) };
        } catch (_) {}
      }
    }
    return DEFAULT_BANK_CONFIG;
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Invoice Creator state
  const [invoiceId, setInvoiceId] = useState(
    () => `VEL-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
  );
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [projectTitle, setProjectTitle] = useState(
    "Custom Website Design & Development",
  );
  const [totalAmount, setTotalAmount] = useState(15000);
  const [currency, setCurrency] = useState("INR");
  const [selectedMilestone, setSelectedMilestone] = useState("advance");
  const [deliverables, setDeliverables] = useState([
    "Custom responsive UI/UX design (Mobile & Desktop)",
    "Clean React 19 frontend implementation",
    "WhatsApp lead enquiry routing & automated forms",
    "Domain setup, speed optimization & global CDN deployment",
    "100% full source code and asset ownership handover",
  ]);

  const [copiedKey, setCopiedKey] = useState("");

  // Milestone calculation
  const milestoneRates = {
    advance: {
      label: "Project Advance",
      percent: 0.5,
      desc: "50% required before design & code commences",
    },
    milestone: {
      label: "Development Milestone",
      percent: 0.3,
      desc: "30% due upon staging site review",
    },
    final: {
      label: "Final Deployment & Handover",
      percent: 0.2,
      desc: "20% due before domain launch & code transfer",
    },
    full: {
      label: "Full Project Settlement",
      percent: 1.0,
      desc: "100% full project payment",
    },
  };

  const currentRate =
    milestoneRates[selectedMilestone] || milestoneRates.advance;
  const dueAmount = Math.round(totalAmount * currentRate.percent);

  // Passcode verification (Default: 8310 or founder master key)
  const handleLogin = (e) => {
    e.preventDefault();
    if (
      passcode === "8310" ||
      passcode === "8310490313" ||
      passcode.toLowerCase() === "velspectra"
    ) {
      setIsAuthenticated(true);
      localStorage.setItem("velspectra_admin_auth", "true");
      setAuthError("");
      sound.playSuccess();
    } else {
      setAuthError("Invalid founder passcode. Please try again.");
      sound.playClick();
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("velspectra_admin_auth");
    sound.playClick();
  };

  // Save bank configuration to localStorage
  const handleSaveBankConfig = (e) => {
    e.preventDefault();
    sound.playSuccess();
    localStorage.setItem("velspectra_bank_config", JSON.stringify(bankConfig));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Generate shareable client URL
  const generateClientUrl = () => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://velspectra.in";
    const params = new URLSearchParams({
      id: invoiceId,
      name: clientName || "Valued Client",
      email: clientEmail || "",
      phone: clientPhone || "",
      project: projectTitle,
      amount: String(totalAmount),
      currency: currency,
      milestone: selectedMilestone,
    });
    return `${origin}/invoice?${params.toString()}`;
  };

  const handleCopy = (text, key) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  // Format WhatsApp message to client with invoice link
  const getWhatsAppClientUrl = () => {
    const clientUrl = generateClientUrl();
    const cleanPhone = clientPhone.replace(/\D/g, "");
    const targetPhone = cleanPhone
      ? cleanPhone.startsWith("91")
        ? cleanPhone
        : `91${cleanPhone}`
      : "918310490313";
    const msg =
      `*Official Project Invoice — VELSPECTRA*\n\n` +
      `Hi ${clientName || "there"},\n\n` +
      `Here is your project invoice and payment link for *${projectTitle}*:\n\n` +
      `• *Invoice ID:* ${invoiceId}\n` +
      `• *Total Project Value:* ${currency === "INR" ? "₹" : "$"}${totalAmount.toLocaleString("en-IN")}\n` +
      `• *Phase Due:* ${currentRate.label} (${Math.round(currentRate.percent * 100)}%)\n` +
      `• *Amount Due:* *${currency === "INR" ? "₹" : "$"}${dueAmount.toLocaleString("en-IN")}*\n\n` +
      `💳 *View Invoice & Pay via UPI / Bank Transfer:*\n` +
      `${clientUrl}\n\n` +
      `— VELSPECTRA · Vishwanath M M (+91 8310490313)`;

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="invoice-page-backdrop">
      <div className="admin-portal-box">
        {/* Top Header */}
        <div className="admin-header">
          <div className="admin-header-title">
            <span className="founder-badge">
              <ShieldCheck size={14} color="#7ad8e8" /> FOUNDER CONSOLE
            </span>
            <h2>VELSPECTRA Admin &amp; Invoice Portal</h2>
            <p>
              Private workspace for Vishwanath M M. Manage bank settlement
              details and generate client invoices.
            </p>
          </div>
          <div className="admin-header-actions">
            {isAuthenticated && (
              <button
                type="button"
                className="admin-logout-btn"
                onClick={handleLogout}
              >
                <Lock size={13} /> Lock Console
              </button>
            )}
            <button
              type="button"
              className="admin-close-btn"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              aria-label="Close Admin Console"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Auth Gate */}
        {!isAuthenticated ? (
          <div className="admin-auth-card">
            <div className="auth-icon-wrap">
              <Lock size={32} color="#ef3568" />
            </div>
            <h3>Founder Access Required</h3>
            <p>
              This portal is restricted to VELSPECTRA administration. Enter your
              founder PIN to continue.
            </p>

            <form onSubmit={handleLogin} className="admin-auth-form">
              <input
                type="password"
                placeholder="Enter founder PIN (e.g. 8310)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="button button-primary auth-submit-btn"
              >
                <Unlock size={15} /> Unlock Admin Console
              </button>
              {authError && <div className="admin-error-text">{authError}</div>}
            </form>
          </div>
        ) : (
          <div className="admin-content-grid">
            {/* Left Column: Bank Configuration */}
            <div className="admin-card">
              <div className="admin-card-head">
                <div className="card-head-title">
                  <Landmark size={18} color="#7ad8e8" />
                  <h3>Settlement Bank &amp; UPI Configuration</h3>
                </div>
                <span className="card-head-sub">
                  Configure accounts displayed on client invoices
                </span>
              </div>

              <form onSubmit={handleSaveBankConfig} className="admin-bank-form">
                <label>
                  <span>Account Holder Name</span>
                  <input
                    type="text"
                    value={bankConfig.accountHolder}
                    onChange={(e) =>
                      setBankConfig({
                        ...bankConfig,
                        accountHolder: e.target.value,
                      })
                    }
                    placeholder="VISHWANATH M M (VELSPECTRA)"
                    required
                  />
                </label>

                <div className="form-two-col">
                  <label>
                    <span>Bank Name</span>
                    <input
                      type="text"
                      value={bankConfig.bankName}
                      onChange={(e) =>
                        setBankConfig({
                          ...bankConfig,
                          bankName: e.target.value,
                        })
                      }
                      placeholder="e.g. State Bank of India / HDFC"
                    />
                  </label>
                  <label>
                    <span>Account Type</span>
                    <select
                      value={bankConfig.accountType}
                      onChange={(e) =>
                        setBankConfig({
                          ...bankConfig,
                          accountType: e.target.value,
                        })
                      }
                    >
                      <option value="Savings">Savings Account</option>
                      <option value="Current">Current Account</option>
                    </select>
                  </label>
                </div>

                <div className="form-two-col">
                  <label>
                    <span>Account Number</span>
                    <input
                      type="text"
                      value={bankConfig.accountNumber}
                      onChange={(e) =>
                        setBankConfig({
                          ...bankConfig,
                          accountNumber: e.target.value,
                        })
                      }
                      placeholder="e.g. 9999999999 or bank A/C"
                    />
                  </label>
                  <label>
                    <span>IFSC Code</span>
                    <input
                      type="text"
                      value={bankConfig.ifscCode}
                      onChange={(e) =>
                        setBankConfig({
                          ...bankConfig,
                          ifscCode: e.target.value,
                        })
                      }
                      placeholder="e.g. SBIN0001234"
                    />
                  </label>
                </div>

                <label>
                  <span>Business UPI ID (VPA)</span>
                  <input
                    type="text"
                    value={bankConfig.upiId}
                    onChange={(e) =>
                      setBankConfig({ ...bankConfig, upiId: e.target.value })
                    }
                    placeholder="9999999999@ybl"
                    required
                  />
                </label>

                <button
                  type="submit"
                  className="button button-primary bank-save-btn"
                >
                  <Save size={15} /> Save Bank Settings
                </button>

                {saveSuccess && (
                  <div className="save-success-pill">
                    <Check size={14} /> Bank details saved and active for new
                    invoices!
                  </div>
                )}
              </form>
            </div>

            {/* Right Column: Invoice Generator */}
            <div className="admin-card">
              <div className="admin-card-head">
                <div className="card-head-title">
                  <FileText size={18} color="#ef3568" />
                  <h3>Create Client Invoice</h3>
                </div>
                <span className="card-head-sub">
                  Generate milestone payment link for client
                </span>
              </div>

              <div className="admin-invoice-form">
                <div className="form-two-col">
                  <label>
                    <span>Invoice Reference ID</span>
                    <input
                      type="text"
                      value={invoiceId}
                      onChange={(e) => setInvoiceId(e.target.value)}
                      placeholder="VEL-2026-001"
                    />
                  </label>
                  <label>
                    <span>Currency</span>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </label>
                </div>

                <div className="form-two-col">
                  <label>
                    <span>Client / Company Name</span>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                    />
                  </label>
                  <label>
                    <span>Client Email Address</span>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="client@company.com"
                    />
                  </label>
                </div>

                <div className="form-two-col">
                  <label>
                    <span>Client WhatsApp / Phone</span>
                    <input
                      type="text"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </label>
                  <label>
                    <span>Payment Milestone</span>
                    <select
                      value={selectedMilestone}
                      onChange={(e) => setSelectedMilestone(e.target.value)}
                    >
                      <option value="advance">
                        50% Project Advance (commencement)
                      </option>
                      <option value="milestone">
                        30% Development Milestone
                      </option>
                      <option value="final">
                        20% Final Handover &amp; Domain Launch
                      </option>
                      <option value="full">100% Full Settlement</option>
                    </select>
                  </label>
                </div>

                <div className="form-two-col">
                  <label>
                    <span>Project Scope &amp; Title</span>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="Custom Website Design & Development"
                    />
                  </label>
                  <label>
                    <span>Total Project Value ({currency})</span>
                    <input
                      type="number"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(Number(e.target.value))}
                      step={500}
                    />
                  </label>
                </div>

                {/* Calculation Summary Box */}
                <div className="admin-calc-box">
                  <div className="admin-calc-row">
                    <span>Selected Phase:</span>
                    <strong>
                      {currentRate.label} (
                      {Math.round(currentRate.percent * 100)}%)
                    </strong>
                  </div>
                  <div className="admin-calc-row">
                    <span>Phase Due Amount:</span>
                    <span className="admin-highlight-price">
                      {currency === "INR" ? "₹" : "$"}
                      {dueAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Generated Link Actions */}
                <div className="admin-link-actions">
                  <button
                    type="button"
                    className="button button-primary admin-action-btn"
                    onClick={() => handleCopy(generateClientUrl(), "link")}
                  >
                    {copiedKey === "link" ? (
                      <>
                        <Check size={15} /> Copied Client Link!
                      </>
                    ) : (
                      <>
                        <Copy size={15} /> Copy Invoice Link
                      </>
                    )}
                  </button>

                  <a
                    href={getWhatsAppClientUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="button admin-action-btn admin-whatsapp-btn"
                    onClick={() => sound.playClick()}
                  >
                    <MessageSquare size={15} /> Send on WhatsApp
                  </a>

                  <a
                    href={generateClientUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="button button-secondary admin-action-btn"
                    onClick={() => sound.playClick()}
                  >
                    <ExternalLink size={15} /> Open Client View
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
