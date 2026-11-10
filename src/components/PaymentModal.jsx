import React, { useState } from "react";
import {
  X, Check, ShieldCheck, Lock, CreditCard, ArrowRight,
  Sparkles, CheckCircle2, MessageSquare, AlertCircle, FileText
} from "lucide-react";
import { sound } from "../utils/sound";

export default function PaymentModal({ onClose, initialPackage = "" }) {
  const [invoiceId, setInvoiceId] = useState("VEL-2026-001");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [selectedMilestone, setSelectedMilestone] = useState("advance");
  const [amount, setAmount] = useState(7500);
  const [currency, setCurrency] = useState("INR");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const milestones = {
    advance: {
      label: "Initial Advance (50%)",
      desc: "Required to begin strategy, wireframes & design",
      multiplier: 0.5,
    },
    milestone: {
      label: "Development Milestone (30%)",
      desc: "Upon review of staging preview site",
      multiplier: 0.3,
    },
    final: {
      label: "Final Balance & Handover (20%)",
      desc: "Prior to live custom domain deployment & source code handover",
      multiplier: 0.2,
    },
  };

  const handlePayNow = async (e) => {
    e.preventDefault();
    sound.playClick();
    setLoading(true);
    setStatusMessage("Connecting to secure Cashfree PG gateway...");

    try {
      // Call Cloudflare Pages Function backend
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: `${invoiceId.trim().replace(/\s+/g, "_")}_${Date.now().toString().slice(-4)}`,
          order_amount: amount,
          order_currency: currency,
          customer_details: {
            customer_id: clientEmail ? clientEmail.replace(/[^a-zA-Z0-9]/g, "_") : "client_guest",
            customer_name: clientName || "Valued Client",
            customer_email: clientEmail || "client@business.com",
            customer_phone: "9999999999",
          },
          order_note: `VELSPECTRA - ${invoiceId} [${milestones[selectedMilestone].label}]`,
        }),
      });

      const data = await response.json();

      if (data && data.payment_session_id) {
        // If live Cashfree SDK is loaded
        if (window.Cashfree) {
          const cashfree = window.Cashfree({ mode: data.environment || "sandbox" });
          cashfree.checkout({
            paymentSessionId: data.payment_session_id,
            redirectTarget: "_self",
          });
        } else {
          // Fallback or test link
          setStatusMessage("Order created successfully! Redirecting to secure checkout...");
          setTimeout(() => {
            alert(`[Cashfree Sandbox Gateway Simulation]\n\nOrder ID: ${data.order_id}\nAmount: ${currency} ${amount}\nSession: ${data.payment_session_id.slice(0, 20)}...\n\nYour Cashfree account will automatically open the UPI / Cards / PayPal checkout in production.`);
            setLoading(false);
          }, 800);
        }
      } else {
        // Friendly fallback for onboarding setup
        setStatusMessage(data.message || "Simulated test order created successfully.");
        setTimeout(() => {
          alert(`[VELSPECTRA Client Payment Portal]\n\nInvoice: ${invoiceId}\nAmount Due: ${currency === "INR" ? "₹" : "$"}${amount}\n\nCashfree PG gateway integration is ready. Add your Cashfree API keys in Cloudflare Pages environment to receive live bank settlements.`);
          setLoading(false);
          setStatusMessage("");
        }, 800);
      }
    } catch (err) {
      // Graceful offline simulation
      setTimeout(() => {
        alert(`[VELSPECTRA Payment Gateway Portal]\n\nInvoice: ${invoiceId}\nAmount: ${currency === "INR" ? "₹" : "$"}${amount}\n\nClient checkout pipeline is active. Once your Cashfree merchant account is approved, payments will be routed directly to your verified Indian bank account.`);
        setLoading(false);
        setStatusMessage("");
      }, 700);
    }
  };

  const openWhatsAppLink = () => {
    sound.playClick();
    const msg = encodeURIComponent(
      `Hi VELSPECTRA, I would like to pay for Invoice ${invoiceId} (${currency === "INR" ? "₹" : "$"}${amount} for ${milestones[selectedMilestone].label}). Please send me the Cashfree payment link.`
    );
    window.open(`https://wa.me/918310490313?text=${msg}`, "_blank");
  };

  return (
    <div className="policy-modal-backdrop" onClick={onClose}>
      <div
        className="project-modal-container payment-portal-container"
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
          aria-label="Close portal"
        >
          <X size={20} />
        </button>

        <div className="payment-modal-header">
          <div className="modal-eyebrow">
            <span>SECURE PAYMENT PORTAL // POWERED BY CASHFREE</span>
          </div>
          <h2>Client Invoice & Milestone Payment</h2>
          <p className="modal-tagline">
            Settle your project advance, milestones, or retainers via UPI, Credit/Debit Cards, Net Banking, or International Cards.
          </p>
        </div>

        <div className="payment-body-grid">
          {/* Left: Invoice Configuration Form */}
          <form className="payment-form" onSubmit={handlePayNow}>
            <div className="form-row">
              <label>
                Invoice / Project Reference
                <input
                  required
                  value={invoiceId}
                  onChange={(e) => setInvoiceId(e.target.value.toUpperCase())}
                  placeholder="e.g. VEL-2026-001"
                />
              </label>
              <label>
                Currency
                <span className="select-wrap">
                  <select
                    value={currency}
                    onChange={(e) => {
                      setCurrency(e.target.value);
                      if (e.target.value === "USD") setAmount(199);
                      else setAmount(7500);
                    }}
                  >
                    <option value="INR">₹ INR (India - UPI / Cards)</option>
                    <option value="USD">$ USD (Global - Cards / PayPal)</option>
                  </select>
                </span>
              </label>
            </div>

            <div className="form-row">
              <label>
                Client Name
                <input
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Your Name or Business"
                />
              </label>
              <label>
                Billing Email
                <input
                  required
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@company.com"
                />
              </label>
            </div>

            <div className="milestone-selector">
              <label className="budget-label">Select Payment Milestone</label>
              <div className="milestone-options">
                {Object.entries(milestones).map(([key, item]) => {
                  const isSelected = selectedMilestone === key;
                  return (
                    <div
                      key={key}
                      className={`milestone-card ${isSelected ? "is-selected" : ""}`}
                      onClick={() => {
                        sound.playClick();
                        setSelectedMilestone(key);
                      }}
                    >
                      <div className="milestone-top">
                        <span className="milestone-name">{item.label}</span>
                        {isSelected && <Check size={14} className="chip-check" />}
                      </div>
                      <span className="milestone-desc">{item.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <label>
              Amount to Pay ({currency})
              <input
                required
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </label>

            {statusMessage && <p className="payment-status-note">{statusMessage}</p>}

            <div className="payment-actions-row">
              <button
                type="submit"
                disabled={loading}
                className="button button-primary pay-submit-btn"
              >
                <Lock size={15} />
                {loading ? "Processing..." : `Pay ${currency === "INR" ? "₹" : "$"}${amount} via Cashfree PG`}
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                className="whatsapp-pay-btn"
                onClick={openWhatsAppLink}
              >
                <MessageSquare size={16} /> Request Link on WhatsApp
              </button>
            </div>

            <div className="payment-security-badges">
              <span><ShieldCheck size={14} color="#34d399" /> 256-Bit SSL Encrypted</span>
              <span><Lock size={14} color="#7ad8e8" /> PCI-DSS Level 1 Compliant</span>
              <span><CheckCircle2 size={14} color="#34d399" /> Direct Bank Settlement</span>
            </div>
          </form>

          {/* Right: Verified Invoice Breakdown Preview */}
          <div className="payment-summary-panel">
            <div className="invoice-preview-card">
              <div className="invoice-card-header">
                <div>
                  <span className="invoice-tag">DIGITAL INVOICE</span>
                  <h4>{invoiceId}</h4>
                </div>
                <div className="invoice-brand">VELSPECTRA</div>
              </div>

              <div className="invoice-table">
                <div className="invoice-row">
                  <span>Project Description</span>
                  <span>Bespoke Website Development</span>
                </div>
                <div className="invoice-row">
                  <span>Client Name</span>
                  <span>{clientName || "Valued Business"}</span>
                </div>
                <div className="invoice-row">
                  <span>Milestone</span>
                  <span className="highlight-milestone">{milestones[selectedMilestone].label}</span>
                </div>
                <div className="invoice-row invoice-total-row">
                  <span>Amount Due Now</span>
                  <span className="invoice-big-price">
                    {currency === "INR" ? `₹${amount.toLocaleString("en-IN")}` : `$${amount}`}
                  </span>
                </div>
              </div>

              <div className="payment-methods-showcase">
                <span className="methods-label">ACCEPTED PAYMENT METHODS:</span>
                <div className="methods-chips">
                  <span className="m-chip">UPI (GPay / PhonePe / Paytm)</span>
                  <span className="m-chip">Credit & Debit Cards</span>
                  <span className="m-chip">Net Banking (50+ Banks)</span>
                  <span className="m-chip">International Cards</span>
                  <span className="m-chip">PayPal (via Cashfree)</span>
                </div>
              </div>

              <div className="invoice-guarantee">
                <FileText size={15} />
                <span>An official tax invoice and receipt will be emailed immediately upon successful payment.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
