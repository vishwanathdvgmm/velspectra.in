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
  AlertCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { sound } from "../utils/sound";

export default function InvoicePortal({ onClose }) {
  // Read invoice parameters from URL query string
  const queryParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );

  const urlInvoiceId = queryParams.get("id") || "VEL-2026-001";
  const urlClientName = queryParams.get("name") || "Valued Client";
  const urlClientEmail = queryParams.get("email") || "";
  const urlClientPhone = queryParams.get("phone") || "";
  const urlProjectTitle =
    queryParams.get("project") || "Custom Website Design & Development";
  const urlTotalAmount = Number(queryParams.get("amount")) || 15000;
  const urlCurrency = queryParams.get("currency") || "INR";
  const urlMilestone = queryParams.get("milestone") || "advance";

  // Check saved invoices in localStorage to populate full record for short links
  const getSavedInvoice = (id) => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("velspectra_saved_invoices");
        if (raw) {
          const list = JSON.parse(raw);
          return list.find((item) => item.id === id) || null;
        }
      } catch (_) {}
    }
    return null;
  };

  const getSavedBankConfig = () => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("velspectra_bank_config");
        if (saved) return JSON.parse(saved);
      } catch (_) {}
    }
    return null;
  };

  const savedRecord = getSavedInvoice(urlInvoiceId);
  const savedBankConfig = getSavedBankConfig();

  // Hydrate from saved vault if available, otherwise from URL parameters
  const [invoiceId] = useState(savedRecord?.id || urlInvoiceId);
  const [clientName] = useState(
    savedRecord?.clientName || urlClientName || "Valued Client",
  );
  const [clientEmail] = useState(
    savedRecord?.clientEmail || urlClientEmail || "client@company.com",
  );
  const [clientPhone] = useState(
    savedRecord?.clientPhone || urlClientPhone || "",
  );
  const [projectTitle] = useState(
    savedRecord?.projectTitle ||
      urlProjectTitle ||
      "Custom Website Design & Development",
  );
  const [totalAmount, setTotalAmount] = useState(
    Number(savedRecord?.totalAmount) || urlTotalAmount || 15000,
  );
  const [currency, setCurrency] = useState(
    savedRecord?.currency || urlCurrency || "INR",
  );
  const [selectedMilestone, setSelectedMilestone] = useState(
    savedRecord?.milestone || urlMilestone || "advance",
  );
  const [paidAmount] = useState(Number(savedRecord?.paidAmount) || 0);
  const [paymentStatus] = useState(
    savedRecord?.status ||
      (paidAmount > 0 ? "50% Advance Received" : "Awaiting Verification"),
  );

  const [copied, setCopied] = useState("");
  const [upiId] = useState(savedBankConfig?.upiId || "vishwanathdvgmm@slc");
  const [accountHolder] = useState(
    savedBankConfig?.accountHolder || "VISHWANATH M M (VELSPECTRA)",
  );
  const [accountNumber] = useState(savedBankConfig?.accountNumber || "");
  const [ifscCode] = useState(savedBankConfig?.ifscCode || "");
  const [bankName] = useState(savedBankConfig?.bankName || "");
  const [accountType] = useState(savedBankConfig?.accountType || "Savings");
  const [utrNumber, setUtrNumber] = useState("");

  const deliverables = [
    "Custom responsive UI/UX design (Mobile & Desktop)",
    "Clean React 19 frontend implementation with sub-second speed",
    "WhatsApp lead enquiry routing & automated forms",
    "Domain setup, SSL certificate & global CDN deployment",
    "100% full source code and asset ownership handover",
  ];

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
  const remainingBalance = Math.max(0, totalAmount - paidAmount);

  // Dynamic UPI Payment deep link
  const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent("VELSPECTRA")}&am=${dueAmount}&tn=${encodeURIComponent(`${invoiceId}-${selectedMilestone.toUpperCase()}`)}&cu=INR`;

  // Dynamic QR Code URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}&color=080910&bgcolor=ffffff&margin=10`;

  // Clean short shareable link
  const generateShareableUrl = () => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://velspectra.in";
    return `${origin}/invoice?id=${invoiceId}&name=${encodeURIComponent(clientName)}`;
  };

  const handleCopy = (text, key) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  // Fixed PDF Download: File name is strictly the invoice number `${invoiceId}.pdf` (lowercase .pdf)
  const handlePrint = () => {
    sound.playClick();
    const originalTitle = document.title;
    document.title = `${invoiceId}.pdf`;
    window.print();
    const restoreTitle = () => {
      document.title = originalTitle;
      window.removeEventListener("afterprint", restoreTitle);
    };
    window.addEventListener("afterprint", restoreTitle);
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

  return (
    <div className="invoice-page-backdrop">
      <div className="invoice-shell">
        {/* Navigation & Actions Top Bar (strictly client-facing / print-ready, NO founder generator tab) */}
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

          <div className="invoice-action-pills">
            <button
              type="button"
              className="action-pill action-pill-primary"
              onClick={handlePrint}
              title="Print or Save PDF as [Invoice ID].pdf"
            >
              <Printer size={15} /> <span>Print / Download PDF</span>
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
              <span>{copied === "url" ? "Copied Link!" : "Share Link"}</span>
            </button>
          </div>
        </div>

        {/* ===============================================================
            OFFICIAL CLIENT INVOICE & PAYMENT PORTAL
            =============================================================== */}
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
                    {savedRecord?.createdAt
                      ? new Date(savedRecord.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : new Date().toLocaleDateString("en-IN", {
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
                  <span
                    className={`val highlight ${
                      paymentStatus.includes("Received") ||
                      paymentStatus.includes("Settled")
                        ? "val-success"
                        : ""
                    }`}
                  >
                    {paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Progress Notice (if partial or advance payment recorded) */}
          {paidAmount > 0 && (
            <div className="invoice-payment-progress-banner">
              <CheckCircle2 size={18} color="#34d399" />
              <div>
                <strong>Payment Verified:</strong>{" "}
                {currency === "INR" ? "₹" : "$"}
                {paidAmount.toLocaleString("en-IN")} credited. Remaining balance
                to complete project:{" "}
                <strong>
                  {currency === "INR" ? "₹" : "$"}
                  {remainingBalance.toLocaleString("en-IN")}
                </strong>
                .
              </div>
            </div>
          )}

          {/* Client Info & Scope */}
          <div className="invoice-bill-grid">
            <div className="bill-to-col">
              <span className="section-eyebrow">BILLED TO (CLIENT)</span>
              <h3 className="client-display-name">{clientName}</h3>
              {clientEmail && <p>{clientEmail}</p>}
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
              <span className="section-eyebrow">AGREED MILESTONE SCHEDULE</span>
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
                    <span>{val.label}</span>
                    <small>({Math.round(val.percent * 100)}%)</small>
                  </button>
                ))}
              </div>
              <p className="milestone-explainer">{currentRate.desc}</p>
            </div>

            <div className="totals-table-col">
              <div className="total-row">
                <span>Total Project Investment:</span>
                <span>
                  {currency === "INR" ? "₹" : "$"}
                  {totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="total-row">
                <span>Taxes (GST Exempt):</span>
                <span>₹0.00</span>
              </div>
              {paidAmount > 0 && (
                <div className="total-row total-row-paid">
                  <span>Previously Paid:</span>
                  <span style={{ color: "#34d399" }}>
                    - {currency === "INR" ? "₹" : "$"}
                    {paidAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
              <div className="total-row total-highlight">
                <div>
                  <strong>
                    {currentRate.label} Due (
                    {Math.round(currentRate.percent * 100)}%):
                  </strong>
                  <div className="total-sub">
                    Payable via UPI or Direct Bank Transfer
                  </div>
                </div>
                <strong className="final-price">
                  {currency === "INR" ? "₹" : "$"}
                  {dueAmount.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          </div>

          {/* Direct Settlement Details (UPI & Bank Transfer) */}
          <div className="invoice-settlement-card">
            <div className="settlement-header">
              <div className="settlement-title">
                <CreditCard size={18} color="#7ad8e8" />
                <h3>Official Payment Instructions (Verified Account)</h3>
              </div>
              <span className="settlement-badge">
                <ShieldCheck size={13} /> Direct Settlement · No Intermediary
                Hold
              </span>
            </div>

            <div className="settlement-body-grid">
              {/* UPI Option */}
              <div className="settlement-col upi-col">
                <div className="settlement-col-head">
                  <QrCode size={16} />
                  <h4>Option 1: Instant UPI Transfer (0% Fee)</h4>
                </div>
                <p className="col-desc">
                  Scan QR with Google Pay, PhonePe, Paytm, BHIM, or any UPI app.
                </p>

                <div className="qr-container">
                  <div className="qr-box">
                    <img
                      src={qrCodeUrl}
                      alt="UPI QR Code"
                      width={160}
                      height={160}
                    />
                  </div>
                  <div className="qr-meta">
                    <div className="qr-amount-pill">
                      Amount: {currency === "INR" ? "₹" : "$"}
                      {dueAmount.toLocaleString("en-IN")}
                    </div>
                    <div className="qr-upi-copy">
                      <code>{upiId}</code>
                      <button
                        type="button"
                        onClick={() => handleCopy(upiId, "upi")}
                        className="mini-copy-btn"
                      >
                        {copied === "upi" ? "Copied!" : "Copy VPA"}
                      </button>
                    </div>
                  </div>
                </div>

                <a
                  href={upiLink}
                  className="mobile-upi-btn no-print"
                  onClick={() => sound.playClick()}
                >
                  <ArrowUpRight size={15} /> Pay Directly via UPI App
                </a>
              </div>

              {/* Bank NEFT / IMPS Option */}
              <div className="settlement-col bank-col">
                <div className="settlement-col-head">
                  <Building size={16} />
                  <h4>Option 2: Direct Bank Transfer (NEFT / IMPS)</h4>
                </div>
                <p className="col-desc">
                  Transfer directly to the founder's verified account.
                </p>

                <div className="bank-details-table">
                  <div className="bank-row">
                    <span className="b-label">Account Holder:</span>
                    <span className="b-val">{accountHolder}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(accountHolder, "holder")}
                      className="inline-copy"
                    >
                      {copied === "holder" ? "Copied" : "Copy"}
                    </button>
                  </div>

                  {bankName && (
                    <div className="bank-row">
                      <span className="b-label">Bank Name:</span>
                      <span className="b-val">{bankName}</span>
                    </div>
                  )}

                  {accountNumber ? (
                    <div className="bank-row">
                      <span className="b-label">Account Number:</span>
                      <span className="b-val bold">{accountNumber}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(accountNumber, "acc")}
                        className="inline-copy"
                      >
                        {copied === "acc" ? "Copied" : "Copy"}
                      </button>
                    </div>
                  ) : (
                    <div className="bank-row">
                      <span className="b-label">Account Number:</span>
                      <span className="b-val muted">
                        Provided upon invoice request
                      </span>
                    </div>
                  )}

                  {ifscCode ? (
                    <div className="bank-row">
                      <span className="b-label">IFSC Code:</span>
                      <span className="b-val bold">{ifscCode}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(ifscCode, "ifsc")}
                        className="inline-copy"
                      >
                        {copied === "ifsc" ? "Copied" : "Copy"}
                      </button>
                    </div>
                  ) : (
                    <div className="bank-row">
                      <span className="b-label">IFSC Code:</span>
                      <span className="b-val muted">
                        Provided upon invoice request
                      </span>
                    </div>
                  )}

                  <div className="bank-row">
                    <span className="b-label">Account Type:</span>
                    <span className="b-val">{accountType}</span>
                  </div>

                  <div className="bank-row">
                    <span className="b-label">Reference Note:</span>
                    <span className="b-val">{invoiceId}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Post-Payment UTR Dispatch */}
            <div className="utr-dispatch-box no-print">
              <div className="utr-left">
                <div className="utr-title">
                  <AlertCircle size={16} color="#7ad8e8" />
                  <strong>Already completed payment?</strong>
                </div>
                <p>
                  Enter your UTR or 12-digit transaction ID and confirm directly
                  with Vishwanath on WhatsApp for immediate receipt generation.
                </p>
              </div>
              <div className="utr-form">
                <input
                  type="text"
                  placeholder="Enter 12-digit UTR / Txn Reference"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="utr-input"
                />
                <a
                  href={getClientPaymentConfirmUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="utr-confirm-btn"
                  onClick={() => sound.playClick()}
                >
                  <MessageSquare size={15} /> Confirm on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Legal Proprietor & MSME Compliance Footer */}
          <div className="invoice-legal-footer">
            <div className="legal-left">
              <strong>VELSPECTRA · Sole Proprietorship</strong>
              <p>
                Legal Proprietor: VISHWANATH MANJUNATH MADURI · Davangere,
                Karnataka, India
              </p>
              <p>
                Government Registration: Udyam MSME:{" "}
                <strong>UDYAM-KR-12-0080220</strong> (Micro Enterprise,
                Services)
              </p>
            </div>
            <div className="legal-right">
              <p>Official Website: https://velspectra.in</p>
              <p>
                Support &amp; Verification: vishwanathdvgmm@gmail.com · +91
                8310490313
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
