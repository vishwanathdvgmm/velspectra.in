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
  Plus,
  Trash2,
  Printer,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  Search,
  ChevronDown,
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

const OFFICIAL_SERVICES = [
  {
    id: "landing",
    name: "Landing Page Development",
    startingINR: 2999,
    startingUSD: 49,
  },
  {
    id: "business",
    name: "Business Website Development",
    startingINR: 5999,
    startingUSD: 99,
  },
  {
    id: "portfolio",
    name: "Portfolio Website Development",
    startingINR: 8999,
    startingUSD: 149,
  },
  {
    id: "restaurant",
    name: "Restaurant Website Development",
    startingINR: 11999,
    startingUSD: 199,
  },
  {
    id: "ecommerce",
    name: "E-commerce Website Development",
    startingINR: 14999,
    startingUSD: 249,
  },
  {
    id: "custom",
    name: "Custom Website Development",
    startingINR: 19999,
    startingUSD: 349,
  },
];

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

  // Navigation tab in Admin
  const [activeTab, setActiveTab] = useState("vault"); // "vault" | "create" | "docs" | "reminders" | "bank"

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

  // Saved Invoices Vault (stored in localStorage by client name)
  const [savedInvoices, setSavedInvoices] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("velspectra_saved_invoices");
        if (raw) return JSON.parse(raw);
      } catch (_) {}
    }
    return [];
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Save invoices list to localStorage
  const updateSavedInvoices = (newList) => {
    setSavedInvoices(newList);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "velspectra_saved_invoices",
        JSON.stringify(newList),
      );
    }
  };

  // Invoice Creator state
  const [selectedServiceId, setSelectedServiceId] = useState("business");
  const [invoiceId, setInvoiceId] = useState(
    () => `VEL-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
  );
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [projectTitle, setProjectTitle] = useState(
    "Business Website Development",
  );
  const [currency, setCurrency] = useState("INR");
  const [totalAmount, setTotalAmount] = useState(5999);
  const [selectedMilestone, setSelectedMilestone] = useState("advance");
  const [generatedInvoice, setGeneratedInvoice] = useState(null);

  // Document Suite state
  const [docType, setDocType] = useState("quote"); // "quote" | "agreement" | "receipt"
  const [receiptAmountPaid, setReceiptAmountPaid] = useState("");
  const [receiptUtr, setReceiptUtr] = useState("");
  const [receiptPaymentType, setReceiptPaymentType] = useState("50% Advance");
  const [receiptPaymentMethod, setReceiptPaymentMethod] = useState("UPI");

  // Gmail Reminders state
  const [reminderType, setReminderType] = useState("status"); // "status" | "payment"
  const [reminderMilestoneText, setReminderMilestoneText] = useState(
    "Development phase completed. Staging preview is ready for review.",
  );

  const [copiedKey, setCopiedKey] = useState("");

  // When selected service changes in creator, update default price and title
  const handleServiceChange = (serviceId) => {
    setSelectedServiceId(serviceId);
    const s = OFFICIAL_SERVICES.find((item) => item.id === serviceId);
    if (s) {
      setProjectTitle(s.name);
      setTotalAmount(currency === "INR" ? s.startingINR : s.startingUSD);
    }
  };

  // Currency conversion handler with accurate rate math
  const handleCurrencyChange = (newCurrency) => {
    if (newCurrency === currency) return;
    sound.playClick();
    if (newCurrency === "USD" && currency === "INR") {
      // Convert INR to USD (1 USD ≈ 85 INR, rounded to clean amount)
      const usdVal = Math.max(39, Math.round(totalAmount / 85));
      setTotalAmount(usdVal);
    } else if (newCurrency === "INR" && currency === "USD") {
      // Convert USD to INR (1 USD ≈ 85 INR, rounded to clean 500)
      const inrVal = Math.round((totalAmount * 85) / 500) * 500;
      setTotalAmount(inrVal);
    }
    setCurrency(newCurrency);
  };

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
  const dueAmount = Math.max(0, Math.round(totalAmount * currentRate.percent));

  // Passcode verification
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

  // Save bank configuration
  const handleSaveBankConfig = (e) => {
    e.preventDefault();
    sound.playSuccess();
    localStorage.setItem("velspectra_bank_config", JSON.stringify(bankConfig));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Generate and store invoice in Vault
  const handleGenerateInvoice = (e) => {
    e.preventDefault();
    if (!clientName.trim()) {
      alert("Please enter the client or company name.");
      return;
    }

    sound.playSuccess();

    const record = {
      id: invoiceId,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientPhone: clientPhone.trim(),
      projectTitle,
      totalAmount: Number(totalAmount),
      currency,
      milestone: selectedMilestone,
      paidAmount: 0,
      status: "Awaiting Verification",
      createdAt: new Date().toISOString(),
    };

    // Upsert into saved invoices
    const filtered = savedInvoices.filter((inv) => inv.id !== invoiceId);
    const updated = [record, ...filtered];
    updateSavedInvoices(updated);

    setGeneratedInvoice(record);
  };

  // Update status or payment on existing invoice in Vault
  const handleUpdatePaymentStatus = (id, newStatus, newPaidAmount) => {
    sound.playClick();
    const updated = savedInvoices.map((inv) => {
      if (inv.id === id) {
        return {
          ...inv,
          status: newStatus,
          paidAmount: Number(
            newPaidAmount !== undefined ? newPaidAmount : inv.paidAmount,
          ),
        };
      }
      return inv;
    });
    updateSavedInvoices(updated);
  };

  // Delete invoice from Vault
  const handleDeleteInvoice = (id) => {
    if (confirm(`Are you sure you want to delete invoice ${id}?`)) {
      sound.playClick();
      const updated = savedInvoices.filter((inv) => inv.id !== id);
      updateSavedInvoices(updated);
      if (generatedInvoice?.id === id) setGeneratedInvoice(null);
    }
  };

  // Clean short share link
  const getShortInvoiceUrl = (id, name) => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://velspectra.in";
    return `${origin}/invoice?id=${id}&name=${encodeURIComponent(name || "Client")}`;
  };

  const handleCopy = (text, key) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  // WhatsApp Quotation & Invoice message
  const getWhatsAppMessageUrl = (inv) => {
    const shortUrl = getShortInvoiceUrl(inv.id, inv.clientName);
    const cleanPhone = (inv.clientPhone || "").replace(/\D/g, "");
    const targetPhone = cleanPhone
      ? cleanPhone.startsWith("91")
        ? cleanPhone
        : `91${cleanPhone}`
      : "918310490313";

    const msg =
      `*Official Project Invoice — VELSPECTRA*\n\n` +
      `Hi ${inv.clientName},\n\n` +
      `Here is your project invoice and milestone payment link for *${inv.projectTitle}*:\n\n` +
      `• *Invoice ID:* ${inv.id}\n` +
      `• *Total Project Value:* ${inv.currency === "INR" ? "₹" : "$"}${inv.totalAmount.toLocaleString("en-IN")}\n` +
      `• *Status:* ${inv.status}\n\n` +
      `💳 *View Official Invoice & Pay via UPI / Bank Transfer:*\n` +
      `${shortUrl}\n\n` +
      `— VELSPECTRA · Vishwanath M M (+91 8310490313)`;

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`;
  };

  // Filtered invoices in Vault
  const filteredInvoices = savedInvoices.filter((inv) => {
    const q = searchQuery.toLowerCase();
    return (
      inv.clientName.toLowerCase().includes(q) ||
      inv.id.toLowerCase().includes(q) ||
      (inv.projectTitle && inv.projectTitle.toLowerCase().includes(q))
    );
  });

  return (
    <div className="invoice-page-backdrop">
      <div className="admin-portal-box">
        {/* Top Header */}
        <div className="admin-header">
          <div className="admin-header-title">
            <span className="founder-badge">
              <ShieldCheck size={14} color="#7ad8e8" /> FOUNDER CONSOLE
            </span>
            <h2>VELSPECTRA Admin &amp; Document Portal</h2>
            <p>
              Private founder dashboard for Vishwanath M M. Manage client
              invoices, receipts, quotations, agreements, and payment tracking.
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
          <div className="admin-authenticated-wrap">
            {/* Admin Navigation Tabs */}
            <div className="admin-nav-tabs">
              <button
                type="button"
                className={`admin-nav-tab ${activeTab === "vault" ? "is-active" : ""}`}
                onClick={() => {
                  sound.playClick();
                  setActiveTab("vault");
                }}
              >
                <FileText size={15} /> Invoices Vault ({savedInvoices.length})
              </button>
              <button
                type="button"
                className={`admin-nav-tab ${activeTab === "create" ? "is-active" : ""}`}
                onClick={() => {
                  sound.playClick();
                  setActiveTab("create");
                }}
              >
                <Plus size={15} /> Create Invoice
              </button>
              <button
                type="button"
                className={`admin-nav-tab ${activeTab === "docs" ? "is-active" : ""}`}
                onClick={() => {
                  sound.playClick();
                  setActiveTab("docs");
                }}
              >
                <Sparkles size={15} /> Document Suite (Quotes, Receipts,
                Agreements)
              </button>
              <button
                type="button"
                className={`admin-nav-tab ${activeTab === "reminders" ? "is-active" : ""}`}
                onClick={() => {
                  sound.playClick();
                  setActiveTab("reminders");
                }}
              >
                <Mail size={15} /> Gmail Reminders
              </button>
              <button
                type="button"
                className={`admin-nav-tab ${activeTab === "bank" ? "is-active" : ""}`}
                onClick={() => {
                  sound.playClick();
                  setActiveTab("bank");
                }}
              >
                <Landmark size={15} /> Bank &amp; UPI Settings
              </button>
            </div>

            {/* TAB 1: INVOICES VAULT */}
            {activeTab === "vault" && (
              <div className="admin-tab-pane">
                <div className="vault-header-row">
                  <div>
                    <h3>Client Invoices Vault</h3>
                    <p>
                      All created invoices stored by client name for instant
                      retrieval, status updates, and receipt generation.
                    </p>
                  </div>
                  <div className="vault-search-box">
                    <Search size={15} />
                    <input
                      type="text"
                      placeholder="Search by client name or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {filteredInvoices.length === 0 ? (
                  <div className="vault-empty-state">
                    <FileText size={36} color="#666" />
                    <h4>No invoices saved yet</h4>
                    <p>
                      Generate your first client invoice using the "Create
                      Invoice" tab.
                    </p>
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={() => setActiveTab("create")}
                    >
                      <Plus size={15} /> Create New Invoice
                    </button>
                  </div>
                ) : (
                  <div className="vault-table-wrap">
                    <table className="vault-table">
                      <thead>
                        <tr>
                          <th>Client Name</th>
                          <th>Invoice ID</th>
                          <th>Project Scope</th>
                          <th>Total Value</th>
                          <th>Status / Payment</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInvoices.map((inv) => (
                          <tr key={inv.id}>
                            <td>
                              <strong>{inv.clientName}</strong>
                              {inv.clientEmail && (
                                <div className="vault-subtext">
                                  {inv.clientEmail}
                                </div>
                              )}
                              {inv.clientPhone && (
                                <div className="vault-subtext">
                                  {inv.clientPhone}
                                </div>
                              )}
                            </td>
                            <td>
                              <span className="vault-id-chip">{inv.id}</span>
                              <div className="vault-subtext">
                                {new Date(inv.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </div>
                            </td>
                            <td>{inv.projectTitle}</td>
                            <td>
                              <strong>
                                {inv.currency === "INR" ? "₹" : "$"}
                                {Number(inv.totalAmount).toLocaleString(
                                  "en-IN",
                                )}
                              </strong>
                              {inv.paidAmount > 0 && (
                                <div
                                  className="vault-subtext"
                                  style={{ color: "#34d399" }}
                                >
                                  Paid: {inv.currency === "INR" ? "₹" : "$"}
                                  {inv.paidAmount.toLocaleString("en-IN")}
                                </div>
                              )}
                            </td>
                            <td>
                              <select
                                className="vault-status-select"
                                value={inv.status}
                                onChange={(e) =>
                                  handleUpdatePaymentStatus(
                                    inv.id,
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="Awaiting Verification">
                                  Awaiting Verification
                                </option>
                                <option value="50% Advance Received">
                                  50% Advance Received
                                </option>
                                <option value="30% Milestone Received">
                                  30% Milestone Received
                                </option>
                                <option value="Fully Settled">
                                  Fully Settled
                                </option>
                              </select>
                            </td>
                            <td>
                              <div className="vault-action-buttons">
                                <a
                                  href={getShortInvoiceUrl(
                                    inv.id,
                                    inv.clientName,
                                  )}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mini-vault-btn"
                                  title="Open Client View & Print PDF"
                                >
                                  <ExternalLink size={13} /> Open
                                </a>
                                <button
                                  type="button"
                                  className="mini-vault-btn"
                                  onClick={() =>
                                    handleCopy(
                                      getShortInvoiceUrl(
                                        inv.id,
                                        inv.clientName,
                                      ),
                                      `vault_url_${inv.id}`,
                                    )
                                  }
                                  title="Copy Short Share Link"
                                >
                                  {copiedKey === `vault_url_${inv.id}`
                                    ? "Copied!"
                                    : "Link"}
                                </button>
                                <a
                                  href={getWhatsAppMessageUrl(inv)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mini-vault-btn mini-whatsapp"
                                  title="Send to client on WhatsApp"
                                >
                                  <MessageSquare size={13} />
                                </a>
                                <button
                                  type="button"
                                  className="mini-vault-btn mini-danger"
                                  onClick={() => handleDeleteInvoice(inv.id)}
                                  title="Delete invoice"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: CREATE INVOICE */}
            {activeTab === "create" && (
              <div className="admin-tab-pane">
                <div className="admin-card">
                  <div className="admin-card-head">
                    <div className="card-head-title">
                      <FileText size={18} color="#ef3568" />
                      <h3>Create New Client Invoice</h3>
                    </div>
                    <span className="card-head-sub">
                      Select service package or enter custom amount.
                      Automatically saved in your vault.
                    </span>
                  </div>

                  <form
                    onSubmit={handleGenerateInvoice}
                    className="admin-invoice-form"
                  >
                    <div className="form-two-col">
                      <label>
                        <span>
                          Select Service Package (Auto-populates price)
                        </span>
                        <select
                          value={selectedServiceId}
                          onChange={(e) => handleServiceChange(e.target.value)}
                        >
                          {OFFICIAL_SERVICES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} (Starting from{" "}
                              {currency === "INR"
                                ? `₹${s.startingINR}`
                                : `$${s.startingUSD}`}
                              )
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        <span>Currency</span>
                        <select
                          value={currency}
                          onChange={(e) => handleCurrencyChange(e.target.value)}
                        >
                          <option value="INR">INR (₹)</option>
                          <option value="USD">USD ($)</option>
                        </select>
                      </label>
                    </div>

                    <div className="form-two-col">
                      <label>
                        <span>Client / Company Name *</span>
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="e.g. Rahul Sharma / Acme Corp"
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
                          onChange={(e) =>
                            setTotalAmount(Number(e.target.value))
                          }
                          step={currency === "INR" ? 500 : 10}
                          min={1}
                          required
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

                    <button
                      type="submit"
                      className="button button-primary admin-generate-btn"
                    >
                      <Sparkles size={16} /> Generate Invoice &amp; Short Share
                      Link
                    </button>
                  </form>

                  {/* Generated Invoice Output */}
                  {generatedInvoice && (
                    <div className="generated-invoice-result-card">
                      <div className="result-header">
                        <CheckCircle2 size={20} color="#34d399" />
                        <div>
                          <strong>
                            Invoice Successfully Generated &amp; Saved in Vault!
                          </strong>
                          <p>
                            Reference: {generatedInvoice.id} for{" "}
                            {generatedInvoice.clientName}
                          </p>
                        </div>
                      </div>

                      <div className="result-link-box">
                        <span className="result-label">
                          Short Share Link for Client:
                        </span>
                        <code>
                          {getShortInvoiceUrl(
                            generatedInvoice.id,
                            generatedInvoice.clientName,
                          )}
                        </code>
                      </div>

                      <div className="result-actions">
                        <button
                          type="button"
                          className="button button-primary"
                          onClick={() =>
                            handleCopy(
                              getShortInvoiceUrl(
                                generatedInvoice.id,
                                generatedInvoice.clientName,
                              ),
                              "gen_link",
                            )
                          }
                        >
                          {copiedKey === "gen_link" ? (
                            <Check size={15} />
                          ) : (
                            <Copy size={15} />
                          )}
                          <span>
                            {copiedKey === "gen_link"
                              ? "Copied!"
                              : "Copy Short Link"}
                          </span>
                        </button>

                        <a
                          href={getWhatsAppMessageUrl(generatedInvoice)}
                          target="_blank"
                          rel="noreferrer"
                          className="button admin-whatsapp-btn"
                        >
                          <MessageSquare size={15} /> Send to Client on WhatsApp
                        </a>

                        <a
                          href={getShortInvoiceUrl(
                            generatedInvoice.id,
                            generatedInvoice.clientName,
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="button button-secondary"
                        >
                          <ExternalLink size={15} /> Open Live Invoice
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: DOCUMENT SUITE */}
            {activeTab === "docs" && (
              <div className="admin-tab-pane">
                <div className="docs-subnav">
                  <button
                    type="button"
                    className={`docs-sub-tab ${docType === "quote" ? "is-active" : ""}`}
                    onClick={() => setDocType("quote")}
                  >
                    1. Project Quotation
                  </button>
                  <button
                    type="button"
                    className={`docs-sub-tab ${docType === "agreement" ? "is-active" : ""}`}
                    onClick={() => setDocType("agreement")}
                  >
                    2. Client Service Agreement
                  </button>
                  <button
                    type="button"
                    className={`docs-sub-tab ${docType === "receipt" ? "is-active" : ""}`}
                    onClick={() => setDocType("receipt")}
                  >
                    3. Official Payment Receipt
                  </button>
                </div>

                <div className="admin-card doc-preview-card">
                  {docType === "quote" && (
                    <div className="doc-content">
                      <div className="doc-head-actions">
                        <h4>Project Quotation (VEL-QT-2026-001)</h4>
                        <button
                          type="button"
                          className="mini-vault-btn"
                          onClick={() => {
                            const text =
                              document.getElementById("quote-text").innerText;
                            handleCopy(text, "quote");
                          }}
                        >
                          {copiedKey === "quote"
                            ? "Copied!"
                            : "Copy Formatted Quotation"}
                        </button>
                      </div>

                      <div id="quote-text" className="doc-paper-preview">
                        <p>
                          <strong>Website:</strong> https://velspectra.in/
                          <br />
                          <strong>Email:</strong> vishwanathdvgmm@gmail.com
                          <br />
                          <strong>Business:</strong> VELSPECTRA — Sole
                          Proprietorship
                          <br />
                          <strong>Legal Proprietor:</strong> VISHWANATH
                          MANJUNATH MADURI
                          <br />
                          <strong>Udyam MSME:</strong> UDYAM-KR-12-0080220
                        </p>
                        <hr />
                        <h4>1. QUOTATION DETAILS</h4>
                        <p>
                          Quotation Number: VEL-QT-2026-001
                          <br />
                          Date of Issue:{" "}
                          {new Date().toLocaleDateString("en-IN")}
                          <br />
                          Valid Until:{" "}
                          {new Date(
                            Date.now() + 14 * 86400000,
                          ).toLocaleDateString("en-IN")}
                        </p>

                        <h4>2. CLIENT INFORMATION</h4>
                        <p>
                          Client / Business Name:{" "}
                          {clientName || "[Client Name]"}
                          <br />
                          Email: {clientEmail || "[Client Email]"}
                          <br />
                          Phone: {clientPhone || "[Client Phone]"}
                          <br />
                          Location: India / International
                        </p>

                        <h4>3. PROJECT DETAILS</h4>
                        <p>
                          Project Name:{" "}
                          {projectTitle ||
                            "Custom Website Design & Development"}
                          <br />
                          Service Type: Website Development
                          <br />
                          Project Description: High-speed, responsive digital
                          web solution tailored to client offerings.
                        </p>

                        <h4>4. SCOPE OF WORK</h4>
                        <p>
                          • Custom UI/UX design & responsive mobile layout
                          <br />
                          • Sub-second performance on global CDN (Cloudflare
                          Pages)
                          <br />
                          • Direct WhatsApp lead routing & automated contact
                          forms
                          <br />
                          • On-page SEO setup & metadata configuration
                          <br />• 100% full source code and digital asset
                          ownership handover
                        </p>

                        <h4>5. PRICE BREAKDOWN</h4>
                        <p>
                          Website Development: {currency === "INR" ? "₹" : "$"}
                          {totalAmount.toLocaleString("en-IN")}
                          <br />
                          Taxes: GST Threshold Exempt (Model.md §5)
                          <br />
                          <strong>
                            Total Project Cost: {currency === "INR" ? "₹" : "$"}
                            {totalAmount.toLocaleString("en-IN")}
                          </strong>
                        </p>

                        <h4>6. PAYMENT SCHEDULE</h4>
                        <p>
                          • 50% — Advance payment before project commencement.
                          <br />
                          • 30% — Development milestone approval.
                          <br />• 20% — Before final website handover and live
                          domain deployment.
                        </p>

                        <h4>7. TERMS AND CONDITIONS</h4>
                        <p>
                          Work begins after written quotation approval and
                          receipt of the 50% advance payment. Client ownership
                          is transferred upon full settlement.
                        </p>

                        <p>
                          Prepared by:
                          <br />
                          <strong>
                            VELSPECTRA · VISHWANATH MANJUNATH MADURI
                          </strong>
                          <br />
                          Sole Proprietor · +91 8310490313 ·
                          vishwanathdvgmm@gmail.com
                        </p>
                      </div>
                    </div>
                  )}

                  {docType === "agreement" && (
                    <div className="doc-content">
                      <div className="doc-head-actions">
                        <h4>Client Service Agreement (12 Clauses)</h4>
                        <button
                          type="button"
                          className="mini-vault-btn"
                          onClick={() => {
                            const text =
                              document.getElementById(
                                "agreement-text",
                              ).innerText;
                            handleCopy(text, "agreement");
                          }}
                        >
                          {copiedKey === "agreement"
                            ? "Copied!"
                            : "Copy Full Agreement"}
                        </button>
                      </div>

                      <div id="agreement-text" className="doc-paper-preview">
                        <p>
                          <strong>VELSPECTRA — CLIENT SERVICE AGREEMENT</strong>
                          <br />
                          Website: https://velspectra.in/ · Email:
                          vishwanathdvgmm@gmail.com · Phone: +91 8310490313
                        </p>
                        <p>
                          This agreement is entered into between:
                          <br />
                          <strong>SERVICE PROVIDER:</strong> VELSPECTRA (Sole
                          Proprietorship), Legal Proprietor: VISHWANATH
                          MANJUNATH MADURI, Davangere, Karnataka, India.
                          <br />
                          <strong>CLIENT:</strong>{" "}
                          {clientName || "[Client Name]"}, Email:{" "}
                          {clientEmail || "[Email]"}, Phone:{" "}
                          {clientPhone || "[Phone]"}.
                        </p>
                        <hr />
                        <h4>1. PROJECT DETAILS:</h4>
                        <p>
                          Project Name: {projectTitle}
                          <br />
                          Agreement Date:{" "}
                          {new Date().toLocaleDateString("en-IN")}
                        </p>
                        <h4>2. SCOPE OF WORK:</h4>
                        <p>
                          VELSPECTRA agrees to provide custom responsive website
                          design, development, contact form integrations, and
                          production deployment.
                        </p>
                        <h4>3. PAYMENT TERMS:</h4>
                        <p>
                          50% advance before project commencement, 30% upon
                          milestone approval, 20% before final handover and
                          domain launch.
                        </p>
                        <h4>4. CLIENT RESPONSIBILITIES:</h4>
                        <p>
                          Client agrees to provide accurate text, images, brand
                          materials, and timely feedback.
                        </p>
                        <h4>5. REVISIONS:</h4>
                        <p>
                          Agreed revision rounds are included during the preview
                          staging phase before live launch.
                        </p>
                        <h4>6. PROJECT DELIVERY &amp; HANDOVER:</h4>
                        <p>
                          After completion and receipt of full payment, full
                          source code and administrative credentials will be
                          transferred to the client.
                        </p>
                        <h4>7. INTELLECTUAL PROPERTY:</h4>
                        <p>
                          Client receives 100% full ownership of the
                          commissioned final website code upon full settlement.
                        </p>
                        <h4>8. CANCELLATION &amp; REFUNDS:</h4>
                        <p>
                          Either party may cancel in writing. Payment for
                          completed work and approved expenses will be accounted
                          for.
                        </p>
                        <h4>9. CONFIDENTIALITY:</h4>
                        <p>
                          Both parties agree to treat business details and
                          materials confidentially.
                        </p>
                        <h4>10. LIMITATION OF RESPONSIBILITY:</h4>
                        <p>
                          VELSPECTRA makes reasonable efforts to deliver
                          high-quality code. Third-party domains and hosting
                          remain governed by respective providers.
                        </p>
                        <h4>11. DISPUTE RESOLUTION:</h4>
                        <p>
                          Informal mutual discussion first; governed by
                          applicable Indian law.
                        </p>
                        <h4>12. ACCEPTANCE &amp; SIGNATURES:</h4>
                        <p>
                          Service Provider: VISHWANATH MANJUNATH MADURI
                          (VELSPECTRA)
                          <br />
                          Client: {clientName || "[Client Name]"}
                        </p>
                      </div>
                    </div>
                  )}

                  {docType === "receipt" && (
                    <div className="doc-content">
                      <div className="doc-head-actions">
                        <h4>Official Payment Receipt (VEL-RC-2026-001)</h4>
                        <button
                          type="button"
                          className="mini-vault-btn"
                          onClick={() => {
                            const text =
                              document.getElementById("receipt-text").innerText;
                            handleCopy(text, "receipt");
                          }}
                        >
                          {copiedKey === "receipt" ? "Copied!" : "Copy Receipt"}
                        </button>
                      </div>

                      <div className="receipt-input-grid">
                        <label>
                          <span>Amount Received ({currency})</span>
                          <input
                            type="number"
                            placeholder="e.g. 7500"
                            value={receiptAmountPaid}
                            onChange={(e) =>
                              setReceiptAmountPaid(e.target.value)
                            }
                          />
                        </label>
                        <label>
                          <span>UTR / Transaction Reference</span>
                          <input
                            type="text"
                            placeholder="e.g. 123456789012"
                            value={receiptUtr}
                            onChange={(e) => setReceiptUtr(e.target.value)}
                          />
                        </label>
                        <label>
                          <span>Payment Stage</span>
                          <select
                            value={receiptPaymentType}
                            onChange={(e) =>
                              setReceiptPaymentType(e.target.value)
                            }
                          >
                            <option value="50% Project Advance">
                              50% Project Advance
                            </option>
                            <option value="30% Development Milestone">
                              30% Development Milestone
                            </option>
                            <option value="20% Final Handover">
                              20% Final Handover
                            </option>
                            <option value="100% Full Project Settlement">
                              100% Full Project Settlement
                            </option>
                          </select>
                        </label>
                        <label>
                          <span>Payment Method</span>
                          <select
                            value={receiptPaymentMethod}
                            onChange={(e) =>
                              setReceiptPaymentMethod(e.target.value)
                            }
                          >
                            <option value="UPI (Google Pay / PhonePe / Paytm / BHIM)">
                              UPI (GPay / PhonePe / Paytm)
                            </option>
                            <option value="Bank Transfer (NEFT / IMPS)">
                              Bank Transfer (NEFT / IMPS)
                            </option>
                            <option value="Direct Account Credit">
                              Direct Account Credit
                            </option>
                          </select>
                        </label>
                      </div>

                      <div id="receipt-text" className="doc-paper-preview">
                        <p>
                          <strong>VELSPECTRA — OFFICIAL PAYMENT RECEIPT</strong>
                          <br />
                          Website: https://velspectra.in/ · Email:
                          vishwanathdvgmm@gmail.com · Phone: +91 8310490313
                        </p>
                        <p>
                          <strong>1. BUSINESS DETAILS:</strong>
                          <br />
                          Business Name: VELSPECTRA
                          <br />
                          Legal Proprietor: VISHWANATH MANJUNATH MADURI
                          <br />
                          Business Structure: Sole Proprietorship
                          <br />
                          Udyam Registration Number: UDYAM-KR-12-0080220 (Micro
                          Enterprise, Services)
                          <br />
                          Business Location: Davangere, Karnataka, India
                        </p>

                        <p>
                          <strong>2. RECEIPT DETAILS:</strong>
                          <br />
                          Receipt Number: VEL-RC-2026-001
                          <br />
                          Receipt Date: {new Date().toLocaleDateString("en-IN")}
                          <br />
                          Invoice Reference: {invoiceId}
                          <br />
                          Project Reference: {projectTitle}
                        </p>

                        <p>
                          <strong>3. CLIENT DETAILS:</strong>
                          <br />
                          Client / Business Name:{" "}
                          {clientName || "[Client Name]"}
                          <br />
                          Email: {clientEmail || "[Email]"}
                          <br />
                          Phone: {clientPhone || "[Phone]"}
                        </p>

                        <p>
                          <strong>4. PAYMENT DETAILS:</strong>
                          <br />
                          Service: {projectTitle}
                          <br />
                          Payment Type: {receiptPaymentType}
                          <br />
                          Payment Method: {receiptPaymentMethod}
                          <br />
                          Transaction Reference / UTR:{" "}
                          {receiptUtr || "[Pending UTR]"}
                          <br />
                          Payment Date: {new Date().toLocaleDateString("en-IN")}
                          <br />
                          <strong>
                            Amount Received: {currency === "INR" ? "₹" : "$"}
                            {receiptAmountPaid || dueAmount}
                          </strong>
                        </p>

                        <p>
                          <strong>5. PAYMENT CONFIRMATION:</strong>
                          <br />
                          This receipt confirms that VELSPECTRA has received the
                          payment specified above from the client and verified
                          account credit.
                        </p>

                        <p>
                          RECEIVED BY:
                          <br />
                          <strong>
                            VELSPECTRA · VISHWANATH MANJUNATH MADURI
                          </strong>
                          <br />
                          Legal Proprietor · https://velspectra.in/
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: GMAIL REMINDERS */}
            {activeTab === "reminders" && (
              <div className="admin-tab-pane">
                <div className="admin-card">
                  <div className="admin-card-head">
                    <div className="card-head-title">
                      <Mail size={18} color="#7ad8e8" />
                      <h3>Gmail Client Reminders &amp; Status Updates</h3>
                    </div>
                    <span className="card-head-sub">
                      Quick one-click email composer to update clients on
                      development progress or request milestone payment.
                    </span>
                  </div>

                  <div className="reminder-type-selector">
                    <button
                      type="button"
                      className={`reminder-btn ${reminderType === "status" ? "is-active" : ""}`}
                      onClick={() => setReminderType("status")}
                    >
                      Project Status Update Email
                    </button>
                    <button
                      type="button"
                      className={`reminder-btn ${reminderType === "payment" ? "is-active" : ""}`}
                      onClick={() => setReminderType("payment")}
                    >
                      Payment Milestone Reminder Email
                    </button>
                  </div>

                  <div className="reminder-form">
                    <label>
                      <span>Client Email</span>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="client@company.com"
                      />
                    </label>

                    {reminderType === "status" ? (
                      <>
                        <label>
                          <span>Status Update Notes</span>
                          <textarea
                            rows={3}
                            value={reminderMilestoneText}
                            onChange={(e) =>
                              setReminderMilestoneText(e.target.value)
                            }
                            placeholder="Describe what has been completed..."
                          />
                        </label>

                        <div className="reminder-action-bar">
                          <a
                            href={`mailto:${clientEmail}?subject=${encodeURIComponent(`Project Status Update: ${projectTitle} — VELSPECTRA`)}&body=${encodeURIComponent(
                              `Dear ${clientName || "Valued Client"},\n\n` +
                                `I am pleased to share an update on your website project: ${projectTitle}.\n\n` +
                                `Status Summary:\n${reminderMilestoneText}\n\n` +
                                `You can review the current staging preview and test the interactive design on mobile and desktop.\n\n` +
                                `If you have any feedback or revisions, feel free to reply directly or contact me on WhatsApp (+91 8310490313).\n\n` +
                                `Best regards,\n` +
                                `Vishwanath M M\n` +
                                `Founder, VELSPECTRA\n` +
                                `https://velspectra.in/`,
                            )}`}
                            className="button button-primary"
                          >
                            <Send size={15} /> Open in Gmail / Email Client
                          </a>
                        </div>
                      </>
                    ) : (
                      <>
                        <p
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.9rem",
                            margin: "10px 0",
                          }}
                        >
                          Dispatches payment reminder for{" "}
                          <strong>
                            {currentRate.label} (
                            {currency === "INR" ? "₹" : "$"}
                            {dueAmount.toLocaleString("en-IN")})
                          </strong>{" "}
                          with invoice link and verified bank/UPI details.
                        </p>

                        <div className="reminder-action-bar">
                          <a
                            href={`mailto:${clientEmail}?subject=${encodeURIComponent(`Payment Milestone Reminder: ${invoiceId} — VELSPECTRA`)}&body=${encodeURIComponent(
                              `Dear ${clientName || "Valued Client"},\n\n` +
                                `This is a friendly reminder regarding the ${currentRate.label} for ${projectTitle} (${invoiceId}).\n\n` +
                                `• Invoice ID: ${invoiceId}\n` +
                                `• Milestone: ${currentRate.label}\n` +
                                `• Due Amount: ${currency === "INR" ? "₹" : "$"}${dueAmount.toLocaleString("en-IN")}\n\n` +
                                `You can view your digital invoice and settle securely via UPI QR or direct bank transfer here:\n` +
                                `${getShortInvoiceUrl(invoiceId, clientName)}\n\n` +
                                `Settlement UPI ID: ${bankConfig.upiId}\n\n` +
                                `Once the transfer is completed, please reply with your UTR reference so we can issue your payment receipt immediately.\n\n` +
                                `Best regards,\n` +
                                `Vishwanath M M\n` +
                                `Founder, VELSPECTRA\n` +
                                `https://velspectra.in/`,
                            )}`}
                            className="button button-primary"
                          >
                            <Send size={15} /> Send Payment Reminder via Gmail
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: BANK & UPI CONFIGURATION */}
            {activeTab === "bank" && (
              <div className="admin-tab-pane">
                <div className="admin-card">
                  <div className="admin-card-head">
                    <div className="card-head-title">
                      <Landmark size={18} color="#7ad8e8" />
                      <h3>Settlement Bank &amp; UPI Configuration</h3>
                    </div>
                    <span className="card-head-sub">
                      Configure verified accounts displayed on client invoices
                    </span>
                  </div>

                  <form
                    onSubmit={handleSaveBankConfig}
                    className="admin-bank-form"
                  >
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
                          placeholder="e.g. 9999999999"
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
                          setBankConfig({
                            ...bankConfig,
                            upiId: e.target.value,
                          })
                        }
                        placeholder="vishwanathdvgmm@slc"
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
                        <Check size={14} /> Bank details saved and active for
                        new invoices!
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
