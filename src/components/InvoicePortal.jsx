import React, { useState, useEffect } from "react";
import {
  FileText,
  QrCode,
  Check,
  Copy,
  ExternalLink,
  Printer,
  Share2,
  ArrowLeft,
  ArrowUpRight,
  MessageSquare,
  ShieldCheck,
  Building,
  CreditCard,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Send,
} from "lucide-react";
import { sound } from "../utils/sound";

export default function InvoicePortal({ onClose }) {
  // Read invoice parameters from URL query string if provided
  const queryParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );

  const initialInvoiceId = queryParams.get("id") || "VEL-2026-001";
  const initialClientName = queryParams.get("name") || "Client Business";
  const initialClientEmail = queryParams.get("email") || "client@company.com";
  const initialClientPhone = queryParams.get("phone") || "";
  const initialProjectTitle =
    queryParams.get("project") || "Custom Website Design & Development";
  const initialTotalAmount = Number(queryParams.get("amount")) || 15000;
  const initialCurrency = queryParams.get("currency") || "INR";
  const initialMilestone = queryParams.get("milestone") || "advance";

  const getSavedBankConfig = () => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("velspectra_bank_config");
        if (saved) return JSON.parse(saved);
      } catch (_) {}
    }
    return null;
  };

  const savedConfig = getSavedBankConfig();
  const isAdmin =
    typeof window !== "undefined" &&
    (localStorage.getItem("velspectra_admin_auth") === "true" ||
      queryParams.get("mode") === "admin");

  // State
  const [activeTab, setActiveTab] = useState("invoice");
  const [invoiceId, setInvoiceId] = useState(initialInvoiceId);
  const [clientName, setClientName] = useState(initialClientName);
  const [clientEmail, setClientEmail] = useState(initialClientEmail);
  const [clientPhone, setClientPhone] = useState(initialClientPhone);
  const [projectTitle, setProjectTitle] = useState(initialProjectTitle);
  const [totalAmount, setTotalAmount] = useState(initialTotalAmount);
  const [currency, setCurrency] = useState(initialCurrency);
  const [selectedMilestone, setSelectedMilestone] = useState(initialMilestone);
  const [copied, setCopied] = useState("");
  const [upiId, setUpiId] = useState(
    savedConfig?.upiId || "vishwanathdvgmm@slc",
  );
  const [accountHolder, setAccountHolder] = useState(
    savedConfig?.accountHolder || "VISHWANATH M M (VELSPECTRA)",
  );
  const [accountNumber, setAccountNumber] = useState(
    savedConfig?.accountNumber || "",
  );
  const [ifscCode, setIfscCode] = useState(savedConfig?.ifscCode || "");
  const [bankName, setBankName] = useState(savedConfig?.bankName || "");
  const [accountType, setAccountType] = useState(
    savedConfig?.accountType || "Savings",
  );
  const [utrNumber, setUtrNumber] = useState("");
  const [deliverables, setDeliverables] = useState([
    "Custom responsive UI/UX design (Mobile & Desktop)",
    "Clean React 19 frontend implementation",
    "WhatsApp lead enquiry routing & automated forms",
    "Domain setup, speed optimization & global CDN deployment",
    "100% full source code and asset ownership handover",
  ]);

  // Currency conversion handler
  const handleCurrencyChange = (newCurrency) => {
    if (newCurrency === currency) return;
    sound.playClick();
    if (newCurrency === "USD" && currency === "INR") {
      const usdVal = Math.max(50, Math.round(totalAmount / 85));
      setTotalAmount(usdVal);
    } else if (newCurrency === "INR" && currency === "USD") {
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
      desc: "20% due before custom domain launch & code transfer",
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

  // Generate UPI payment deep link
  const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent("VELSPECTRA")}&am=${dueAmount}&tn=${encodeURIComponent(`${invoiceId}-${selectedMilestone.toUpperCase()}`)}&cu=INR`;

  // Dynamic QR Code URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}&color=080910&bgcolor=ffffff&margin=10`;

  // Generate shareable link
  const generateShareableUrl = () => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://velspectra.in";
    const params = new URLSearchParams({
      id: invoiceId,
      name: clientName,
      email: clientEmail,
      phone: clientPhone,
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
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  // WhatsApp Confirmation for Client
  const getClientPaymentConfirmUrl = () => {
    const msg =
      `*Payment Completed — ${invoiceId}*\n\n` +
      `*Client:* ${clientName}\n` +
      `*Project:* ${projectTitle}\n` +
      `*Milestone:* ${currentRate.label} (${currency === "INR" ? "₹" : "$"}${dueAmount.toLocaleString("en-IN")})\n` +
      `*UTR / Transaction Reference:* ${utrNumber || "[Please type UTR here]"}\n\n` +
      `Hi Vishwanath, I have completed the transfer. Please verify the credit and confirm receipt so we can proceed!`;
    return `https://wa.me/918310490313?text=${encodeURIComponent(msg)}`;
  };

  // WhatsApp Quotation sender for Founder
  const getFounderWhatsAppQuoteUrl = () => {
    const shareUrl = generateShareableUrl();
    const msg =
      `*Official Quotation & Invoice — VELSPECTRA*\n\n` +
      `Dear ${clientName},\n\n` +
      `Thank you for your enquiry. We have reviewed your requirements for *${projectTitle}*.\n\n` +
      `*Invoice Reference:* ${invoiceId}\n` +
      `*Total Project Investment:* ${currency === "INR" ? "₹" : "$"}${totalAmount.toLocaleString("en-IN")}\n` +
      `*Advance Due to Begin (50%):* ${currency === "INR" ? "₹" : "$"}${Math.round(totalAmount * 0.5).toLocaleString("en-IN")}\n\n` +
      `*View & Pay Official Digital Invoice Online:*\n${shareUrl}\n\n` +
      `You can pay directly via UPI (Google Pay, PhonePe, Paytm, BHIM) or Bank Transfer (NEFT/IMPS) using the link above.\n\n` +
      `Best regards,\n` +
      `*Vishwanath M M*\n` +
      `Founder, VELSPECTRA\n` +
      `https://velspectra.in`;
    return `https://wa.me/${clientPhone.replace(/[^0-9]/g, "") || "918310490313"}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="invoice-page-backdrop">
      <div className="invoice-shell">
        {/* Navigation & Controls */}
        <div className="invoice-top-actions no-print">
          <button
            type="button"
            className="invoice-back-btn"
            onClick={() => {
              sound.playClick();
              if (onClose) onClose();
              else {
                window.history.pushState(null, "", "/");
                window.location.href = "/";
              }
            }}
          >
            <ArrowLeft size={16} /> Back to VELSPECTRA
          </button>

          {isAdmin && (
            <div className="invoice-mode-tabs">
              <button
                type="button"
                className={`mode-tab ${activeTab === "invoice" ? "is-active" : ""}`}
                onClick={() => {
                  sound.playClick();
                  setActiveTab("invoice");
                }}
              >
                <FileText size={14} /> Official Invoice
              </button>
              <button
                type="button"
                className={`mode-tab ${activeTab === "create" ? "is-active" : ""}`}
                onClick={() => {
                  sound.playClick();
                  setActiveTab("create");
                }}
              >
                <Sparkles size={14} /> Founder Invoice Generator
              </button>
            </div>
          )}

          <div className="invoice-action-pills">
            <button
              type="button"
              className="action-pill"
              onClick={handlePrint}
              title="Print or Save PDF"
            >
              <Printer size={15} /> <span>Print / PDF</span>
            </button>
            <button
              type="button"
              className="action-pill"
              onClick={() => handleCopy(generateShareableUrl(), "url")}
            >
              {copied === "url" ? (
                <Check size={15} color="#34d399" />
              ) : (
                <Share2 size={15} />
              )}
              <span>{copied === "url" ? "Copied!" : "Share Link"}</span>
            </button>
          </div>
        </div>

        {activeTab === "create" ? (
          /* ===============================================================
             FOUNDER INVOICE GENERATOR FORM
             =============================================================== */
          <div className="invoice-generator-card">
            <div className="gen-header">
              <span className="eyebrow">FOUNDER BILLING ENGINE</span>
              <h2>Generate Client Invoice &amp; Payment Link</h2>
              <p>
                Create a formal quotation invoice for any client enquiry in 30
                seconds. Generates a live digital payment page with instant UPI
                QR &amp; bank transfer instructions.
              </p>
            </div>

            <div className="gen-form-grid">
              <div className="gen-field">
                <label>Invoice Number / ID</label>
                <input
                  value={invoiceId}
                  onChange={(e) => setInvoiceId(e.target.value)}
                  placeholder="e.g. VEL-2026-001"
                />
              </div>

              <div className="gen-field">
                <label>Client / Business Name</label>
                <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Acme Studio / Rahul Sharma"
                />
              </div>

              <div className="gen-field">
                <label>Client Email Address</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@company.com"
                />
              </div>

              <div className="gen-field">
                <label>Client WhatsApp / Phone</label>
                <input
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="gen-field gen-span-2">
                <label>Project Scope &amp; Deliverables Summary</label>
                <input
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. College Website with Admissions Form &amp; Events Portal"
                />
              </div>

              <div className="gen-field">
                <label>Total Agreed Amount</label>
                <div className="gen-amount-wrap">
                  <select
                    value={currency}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    className="gen-curr-select"
                  >
                    <option value="INR">₹ INR</option>
                    <option value="USD">$ USD</option>
                  </select>
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    placeholder="15000"
                  />
                </div>
              </div>

              <div className="gen-field">
                <label>Default Payment Milestone</label>
                <select
                  value={selectedMilestone}
                  onChange={(e) => setSelectedMilestone(e.target.value)}
                >
                  <option value="advance">
                    50% Advance (Before Work Begins)
                  </option>
                  <option value="milestone">30% Development Milestone</option>
                  <option value="final">20% Final Launch &amp; Handover</option>
                  <option value="full">100% Full Payment</option>
                </select>
              </div>

              <div className="gen-field">
                <label>Receiving UPI ID</label>
                <input
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="8310490313@ybl"
                />
              </div>

              <div className="gen-field">
                <label>Bank Account / IFSC</label>
                <input
                  value={`${accountNumber} / ${ifscCode}`}
                  onChange={(e) => {
                    const [acc, ifsc] = e.target.value.split("/");
                    if (acc) setAccountNumber(acc.trim());
                    if (ifsc) setIfscCode(ifsc.trim());
                  }}
                  placeholder="Account Number / IFSC"
                />
              </div>
            </div>

            <div className="gen-output-box">
              <div className="gen-output-title">
                <strong>Instant Shareable Client Link:</strong>
                <a
                  href={generateShareableUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="gen-view-link"
                >
                  Open Live View <ExternalLink size={13} />
                </a>
              </div>
              <div className="gen-url-bar">
                <code>{generateShareableUrl()}</code>
                <button
                  type="button"
                  className="copy-url-btn"
                  onClick={() => handleCopy(generateShareableUrl(), "gen_url")}
                >
                  {copied === "gen_url" ? "Copied!" : "Copy URL"}
                </button>
              </div>

              <div className="gen-dispatch-actions">
                <a
                  href={getFounderWhatsAppQuoteUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="gen-whatsapp-btn"
                  onClick={() => sound.playClick()}
                >
                  <MessageSquare size={16} /> Send Invoice to Client on WhatsApp
                </a>

                <button
                  type="button"
                  className="gen-preview-btn"
                  onClick={() => {
                    sound.playClick();
                    setActiveTab("invoice");
                  }}
                >
                  Preview Formal Invoice &rarr;
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ===============================================================
             OFFICIAL CLIENT INVOICE & PAYMENT PORTAL
             =============================================================== */
          <div className="invoice-paper" id="printable-invoice">
            {/* Invoice Header */}
            <div className="invoice-header">
              <div className="invoice-brand">
                <div className="invoice-logo">
                  <img src="/velspectra-v-icon.png" alt="V" />
                  <span>VELSPECTRA</span>
                </div>
                <p className="invoice-agency-desc">
                  Independent Digital Solutions Studio
                  <br />
                  Website Design · Development · Digital Integrations
                  <br />
                  Operating from India · Serving Worldwide
                </p>
                <div className="invoice-contact-meta">
                  <span>
                    <strong>Email:</strong> vishwanathdvgmm@gmail.com
                  </span>
                  <span>
                    <strong>Phone / WhatsApp:</strong> +91 8310490313
                  </span>
                  <span>
                    <strong>Website:</strong> velspectra.in
                  </span>
                </div>
              </div>

              <div className="invoice-meta-block">
                <div className="invoice-status-pill">
                  <span className="pulse-dot" /> PROFORMA INVOICE
                </div>
                <h1 className="invoice-number">{invoiceId}</h1>
                <div className="invoice-date-rows">
                  <div>
                    <span className="label">Issue Date:</span>
                    <span className="val">
                      {new Date().toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="label">Payment Terms:</span>
                    <span className="val">Due on Scope Approval</span>
                  </div>
                  <div>
                    <span className="label">Status:</span>
                    <span className="val highlight">Awaiting Verification</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Info & Scope */}
            <div className="invoice-bill-grid">
              <div className="bill-to-col">
                <span className="section-eyebrow">BILLED TO (CLIENT)</span>
                <h3 className="client-display-name">{clientName}</h3>
                <p>{clientEmail}</p>
                {clientPhone && <p>{clientPhone}</p>}
                <span className="billing-flag">
                  Commercial Project Engagement
                </span>
              </div>

              <div className="bill-project-col">
                <span className="section-eyebrow">PROJECT ENGAGEMENT</span>
                <h3 className="project-display-title">{projectTitle}</h3>
                <p className="project-desc">
                  Full lifecycle custom digital development, 60fps
                  high-performance interface, mobile responsiveness, and
                  production handover.
                </p>
                <div className="tax-exemption-tag">
                  <ShieldCheck size={13} color="#34d399" />
                  <span>
                    Sole Proprietorship · GST Threshold Exempt (Model.md §5)
                  </span>
                </div>
              </div>
            </div>

            {/* Scope Deliverables Table */}
            <div className="invoice-table-wrap">
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Deliverable &amp; Scope Description</th>
                    <th>Timeline</th>
                    <th className="tar">Amount ({currency})</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>01</td>
                    <td>
                      <strong>{projectTitle}</strong>
                      <ul className="invoice-deliverable-bullets">
                        {deliverables.map((item, idx) => (
                          <li key={idx}>✓ {item}</li>
                        ))}
                      </ul>
                    </td>
                    <td>1 – 2 Weeks</td>
                    <td className="tar bold">
                      {currency === "INR" ? "₹" : "$"}
                      {totalAmount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Financial Summary & Milestone Breakdown */}
            <div className="invoice-totals-grid">
              <div className="milestone-schedule-col">
                <span className="section-eyebrow">
                  AGREED MILESTONE SCHEDULE
                </span>
                <div className="milestone-options-pills no-print">
                  {Object.entries(milestoneRates).map(([key, val]) => (
                    <button
                      key={key}
                      type="button"
                      className={`milestone-pill-btn ${selectedMilestone === key ? "is-active" : ""}`}
                      onClick={() => {
                        sound.playClick();
                        setSelectedMilestone(key);
                      }}
                    >
                      <span className="pill-title">{val.label}</span>
                      <span className="pill-pct">
                        {Math.round(val.percent * 100)}% (
                        {currency === "INR" ? "₹" : "$"}
                        {Math.round(totalAmount * val.percent).toLocaleString(
                          "en-IN",
                        )}
                        )
                      </span>
                    </button>
                  ))}
                </div>

                <p className="milestone-explainer">
                  <strong>Currently Selected for Payment:</strong>{" "}
                  {currentRate.label} ({Math.round(currentRate.percent * 100)}
                  %). {currentRate.desc}.
                </p>
              </div>

              <div className="invoice-summary-card">
                <div className="summary-line">
                  <span>Total Project Investment:</span>
                  <span>
                    {currency === "INR" ? "₹" : "$"}
                    {totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="summary-line">
                  <span>Selected Milestone Share:</span>
                  <span>{Math.round(currentRate.percent * 100)}%</span>
                </div>
                <div className="summary-line">
                  <span>Taxes / Extra Charges:</span>
                  <span>₹0 (None)</span>
                </div>
                <div className="summary-line total-line">
                  <span>AMOUNT DUE NOW:</span>
                  <span className="due-highlight">
                    {currency === "INR" ? "₹" : "$"}
                    {dueAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Execution Block (UPI & Bank Transfer) */}
            <div className="invoice-payment-section">
              <div className="pay-section-header">
                <div className="pay-sec-badge">
                  <CreditCard size={16} /> OFFICIAL PAYMENT INSTRUCTIONS
                </div>
                <h3>Choose your preferred payment method</h3>
                <p>
                  Work commences once the advance amount is credited and
                  verified. Share your UTR / transaction ID after payment.
                </p>
              </div>

              <div className="pay-methods-grid">
                {/* Method 1: Instant UPI (India) */}
                <div className="pay-method-card upi-card">
                  <div className="method-top">
                    <span className="method-tag">RECOMMENDED (ZERO FEES)</span>
                    <h4>Instant UPI (GPay / PhonePe / Paytm / BHIM)</h4>
                  </div>

                  <div className="upi-qr-flex">
                    <div className="qr-wrapper">
                      <img
                        src={qrCodeUrl}
                        alt="UPI QR Code"
                        className="upi-qr-img"
                      />
                      <span className="qr-scan-label">
                        Scan with any UPI App
                      </span>
                    </div>

                    <div className="upi-details-col">
                      <div className="detail-item">
                        <span className="detail-label">Exact Amount:</span>
                        <strong className="detail-val-highlight">
                          ₹{dueAmount.toLocaleString("en-IN")}
                        </strong>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">UPI ID / VPA:</span>
                        <div className="copy-field">
                          <code>{upiId}</code>
                          <button
                            type="button"
                            className="copy-btn"
                            onClick={() => handleCopy(upiId, "upi")}
                          >
                            {copied === "upi" ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">
                          Payment Note / Reference:
                        </span>
                        <code>
                          {invoiceId}-{selectedMilestone.toUpperCase()}
                        </code>
                      </div>

                      {/* Mobile Deep Link */}
                      <a
                        href={upiLink}
                        className="pay-with-upi-app-btn no-print"
                        onClick={() => sound.playClick()}
                      >
                        <ExternalLink size={14} /> Open in UPI App (Mobile)
                      </a>
                    </div>
                  </div>
                </div>

                {/* Method 2: Domestic NEFT / IMPS Bank Transfer */}
                <div className="pay-method-card bank-card">
                  <div className="method-top">
                    <span className="method-tag">DOMESTIC &amp; BUSINESS</span>
                    <h4>Direct Bank Transfer (NEFT / IMPS)</h4>
                  </div>

                  <div className="bank-details-list">
                    {accountNumber ? (
                      <>
                        <div className="bank-row">
                          <span className="b-lbl">Account Beneficiary:</span>
                          <strong className="b-val">{accountHolder}</strong>
                        </div>
                        {bankName && (
                          <div className="bank-row">
                            <span className="b-lbl">Bank Name:</span>
                            <span className="b-val">{bankName}</span>
                          </div>
                        )}
                        <div className="bank-row">
                          <span className="b-lbl">Account Number:</span>
                          <div className="copy-field">
                            <code>{accountNumber}</code>
                            <button
                              type="button"
                              className="copy-btn"
                              onClick={() => handleCopy(accountNumber, "acc")}
                            >
                              {copied === "acc" ? "Copied!" : "Copy"}
                            </button>
                          </div>
                        </div>
                        {ifscCode && (
                          <div className="bank-row">
                            <span className="b-lbl">IFSC Code:</span>
                            <div className="copy-field">
                              <code>{ifscCode}</code>
                              <button
                                type="button"
                                className="copy-btn"
                                onClick={() => handleCopy(ifscCode, "ifsc")}
                              >
                                {copied === "ifsc" ? "Copied!" : "Copy"}
                              </button>
                            </div>
                          </div>
                        )}
                        <div className="bank-row">
                          <span className="b-lbl">Account Type:</span>
                          <span className="b-val">{accountType}</span>
                        </div>
                        <div className="bank-row">
                          <span className="b-lbl">Transfer Remark:</span>
                          <code>{invoiceId}</code>
                        </div>
                      </>
                    ) : (
                      <div
                        className="bank-notice-empty"
                        style={{
                          padding: "16px 0",
                          fontSize: 13,
                          color: "#d1cedb",
                          lineHeight: 1.6,
                        }}
                      >
                        <p>
                          Domestic NEFT/IMPS bank transfer details are verified
                          against active project agreements.
                        </p>
                        <p
                          style={{
                            marginTop: 8,
                            color: "#8c8998",
                            fontSize: 12,
                          }}
                        >
                          Scan the dynamic UPI QR code above for instant
                          payment, or contact Vishwanath on WhatsApp (
                          <strong>+91 8310490313</strong>) for direct corporate
                          wire instructions.
                        </p>
                      </div>
                    )}
                  </div>

                  {currency === "USD" && (
                    <div className="swift-international-note">
                      <span className="intl-tag">
                        INTERNATIONAL SWIFT WIRE (USD)
                      </span>
                      <p>
                        For overseas inward remittances, use Purpose Code:{" "}
                        <strong>
                          P0802 (Software &amp; Website Development Services)
                        </strong>
                        . Contact us on WhatsApp for SWIFT/BIC routing.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Payment Notification & UTR Submission */}
              <div className="payment-confirmation-strip no-print">
                <div className="confirm-icon">
                  <MessageSquare size={22} color="#25d366" />
                </div>
                <div className="confirm-content">
                  <h4>Already transferred the funds?</h4>
                  <p>
                    Enter your UTR number or bank reference below and notify
                    Vishwanath on WhatsApp to confirm receipt and begin work
                    immediately:
                  </p>
                  <div className="utr-input-row">
                    <input
                      type="text"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="Paste 12-digit UTR or Transaction ID here..."
                      className="utr-input"
                    />
                    <a
                      href={getClientPaymentConfirmUrl()}
                      target="_blank"
                      rel="noreferrer"
                      className="utr-notify-btn"
                      onClick={() => sound.playClick()}
                    >
                      Notify on WhatsApp (+91 8310490313){" "}
                      <ArrowUpRight size={15} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Verification Notice */}
            <div className="invoice-footer-terms">
              <h4>
                Terms &amp; Independent Verification Notice (Payment_Model.md
                §8)
              </h4>
              <ol>
                <li>
                  <strong>Verification Requirement:</strong> Project
                  commencement begins only after funds have cleared and been
                  independently confirmed in the receiving bank account.
                  Transaction screenshots alone do not constitute settlement.
                </li>
                <li>
                  <strong>Client Code Ownership:</strong> Upon settlement of the
                  final milestone, 100% full source code, custom design assets,
                  and credentials are unconditionally handed over to the client.
                </li>
                <li>
                  <strong>Cancellation &amp; Refunds:</strong> Advance payments
                  cover upfront developer scheduling and Figma wireframing.
                  Please refer to our official Refund Policy at{" "}
                  <code>velspectra.in/refund</code>.
                </li>
              </ol>
              <div className="invoice-bottom-sign">
                <div>
                  <strong>VELSPECTRA</strong> · Legal Proprietor: VISHWANATH
                  MANJUNATH MADURI
                  <br />
                  Digital Agency Operations · Karnataka, India
                </div>
                <div className="invoice-seal">
                  <span>AUTHORIZED PROFORMA INVOICE</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
