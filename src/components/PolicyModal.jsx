import React, { useEffect } from "react";
import {
  X,
  Shield,
  FileText,
  RefreshCw,
  Truck,
  Mail,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { sound } from "../utils/sound";

export default function PolicyModal({ policyType, onClose }) {
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

  if (!policyType) return null;

  const policies = {
    terms: {
      title: "Terms & Conditions",
      subtitle: "Service Agreements & Commercial Terms",
      icon: FileText,
      updated: "November 2026",
      content: (
        <>
          <p>
            Welcome to <strong>VELSPECTRA</strong> (operating at{" "}
            <strong>https://velspectra.in</strong>). By engaging our digital
            agency services, purchasing website packages, or commissioning
            custom digital solutions, you agree to the following terms and
            conditions.
          </p>

          <h4>1. Nature of Services</h4>
          <p>
            VELSPECTRA is an independent productized digital agency specializing
            in website design, frontend development (React 19, Vite, Tailwind
            CSS), e-commerce storefronts, business automation (WhatsApp, CRM,
            email workflows), and digital optimization. All deliverables are
            digital in nature.
          </p>

          <h4>2. Proposals, Quotations & Payment Milestones</h4>
          <ul>
            <li>
              <strong>Standard Payment Structure:</strong> All projects require
              a 50% advance payment before design and development commence. The
              remaining 50% is due upon final review and milestone approval
              prior to domain connection and source code deployment.
            </li>
            <li>
              <strong>Milestone Payments for Large Projects:</strong> For custom
              enterprise projects, billing may follow a 50% advance, 30%
              development milestone, and 20% final deployment structure.
            </li>
            <li>
              <strong>Payment Collection:</strong> Payments are processed via
              approved direct methods (UPI and domestic bank transfer for Indian
              clients; supported international inward bank transfers for
              overseas clients) against an official project invoice. No
              sensitive card credentials are collected or handled on our
              website.
            </li>
          </ul>

          <h4>3. Client Obligations & Content Delivery</h4>
          <p>
            Project timelines depend on the client providing necessary business
            content (logos, high-res photos, text copy, menu/pricing sheets,
            third-party credentials) in a timely manner. Delays in providing
            materials or feedback will adjust the scheduled delivery milestone
            accordingly.
          </p>

          <h4>4. Intellectual Property & 100% Client Ownership</h4>
          <p>
            Upon receipt of full and final project payment, the client receives{" "}
            <strong>100% complete ownership</strong> of their bespoke website
            code, visual design assets, and custom deliverables. VELSPECTRA
            retains no proprietary lock-in. Reusable core open-source frameworks
            (React, Vite, Tailwind) remain governed by their respective
            open-source licenses.
          </p>

          <h4>5. Third-Party Costs & Subscriptions</h4>
          <p>
            Third-party costs including domain registrations (e.g. GoDaddy),
            external hosting subscriptions, paid API tokens, or premium plugin
            licenses are the responsibility of the client unless explicitly
            bundled in the written project proposal.
          </p>

          <h4>6. Governing Law & Dispute Resolution</h4>
          <p>
            These terms are governed by the laws of India. Any disputes arising
            out of service agreements shall be subject to the exclusive
            jurisdiction of the competent courts in India.
          </p>
        </>
      ),
    },

    privacy: {
      title: "Privacy Policy",
      subtitle: "Customer Data Protection & Transparency",
      icon: Shield,
      updated: "November 2026",
      content: (
        <>
          <p>
            At <strong>VELSPECTRA</strong> (
            <strong>https://velspectra.in</strong>), your privacy and data
            security are our highest priorities. This Privacy Policy outlines
            what information we collect, how it is used, and how it is
            protected.
          </p>

          <h4>1. Information We Collect</h4>
          <ul>
            <li>
              <strong>Contact Details:</strong> Name, business email address,
              phone/WhatsApp number provided through enquiry forms.
            </li>
            <li>
              <strong>Project Information:</strong> Business description,
              industry, project requirements, budget preferences, and design
              assets shared during discovery.
            </li>
            <li>
              <strong>Technical Analytics:</strong> Non-personally identifiable
              diagnostic data (browser type, device resolution, anonymous
              traffic statistics) to optimize website performance.
            </li>
          </ul>

          <h4>2. How We Use Your Data</h4>
          <p>
            We use your data solely to prepare quotations, communicate project
            updates, design and develop your digital solutions, and provide
            ongoing technical support.
          </p>

          <h4>3. No Data Selling or Unsolicited Marketing</h4>
          <p>
            <strong>
              VELSPECTRA does not sell, rent, or trade your personal or business
              data to any third party.
            </strong>{" "}
            We do not engage in mass marketing spam. Mutual Non-Disclosure
            Agreements (NDAs) are happily signed upon request prior to project
            kick-off.
          </p>

          <h4>4. Payment Information Security</h4>
          <p>
            VELSPECTRA does not collect, store, or process client credit card
            numbers, UPI PINs, or banking passwords on our servers. All payments
            are executed directly by the client through their own bank or
            trusted UPI application against an official invoice.
          </p>

          <h4>5. Data Retention & Access</h4>
          <p>
            You may request a copy of the business information we hold or ask
            for its deletion at any time by contacting us at{" "}
            <strong>vishwanathdvgmm@gmail.com</strong>.
          </p>
        </>
      ),
    },

    refund: {
      title: "Refund & Cancellation Policy",
      subtitle: "Transparent Service Conditions",
      icon: RefreshCw,
      updated: "November 2026",
      content: (
        <>
          <p>
            As a productized digital service agency, <strong>VELSPECTRA</strong>{" "}
            commits dedicated design hours, engineering bandwidth, and technical
            infrastructure to every client project from the moment an order is
            approved.
          </p>

          <h4>1. Advance Payments</h4>
          <p>
            The initial 50% project advance covers foundational strategy,
            information architecture, Figma wireframes, and dedicated developer
            scheduling. Because labor is expended immediately, advance payments
            are generally non-refundable once design and prototype production
            has commenced.
          </p>

          <h4>2. Cancellation Before Work Begins</h4>
          <p>
            If a client requests cancellation within 24 hours of invoice payment
            and before discovery research or wireframing has begun, a full
            refund will be processed minus any non-refundable bank transfer or
            outward remittance fees incurred.
          </p>

          <h4>3. Revisions & Satisfaction Guarantee</h4>
          <p>
            To ensure complete satisfaction, all VELSPECTRA packages include
            agreed revision rounds (1 round for Starter, 2 rounds for Business,
            3 rounds for Professional). We work closely with you during the
            staging preview phase to refine the design, content layout, and
            responsive styling before final deployment.
          </p>

          <h4>4. Final Milestone Payments</h4>
          <p>
            The final 50% milestone payment is requested only after you have
            reviewed and approved the live staging preview of your website. Once
            the final balance is settled and the live domain deployment and
            source code handover have taken place, the project is deemed
            successfully fulfilled and non-refundable.
          </p>

          <h4>5. Monthly Care Retainers</h4>
          <p>
            Website maintenance retainers (Basic, Standard, Premium Care)
            operate on a month-to-month basis with zero lock-in. You may cancel
            recurring maintenance at any time with 7 days' written notice before
            the next monthly billing cycle.
          </p>
        </>
      ),
    },

    delivery: {
      title: "Digital Delivery & Fulfillment Policy",
      subtitle: "Project Timelines & Transfer of Deliverables",
      icon: Truck,
      updated: "November 2026",
      content: (
        <>
          <p>
            All products and services provided by <strong>VELSPECTRA</strong>{" "}
            are digital goods and professional technical services. No physical
            shipment is involved.
          </p>

          <h4>1. Delivery Method</h4>
          <ul>
            <li>
              <strong>Staging Review:</strong> Interactive preview links hosted
              on secure staging environments (e.g. Cloudflare Pages staging) for
              client testing and inspection.
            </li>
            <li>
              <strong>Live Deployment:</strong> Final DNS configuration, SSL
              certification, and deployment to the client's custom domain (e.g.,
              yourcompany.com).
            </li>
            <li>
              <strong>Asset Handover:</strong> Full source code repository
              transfer (via GitHub or secure ZIP archive) along with
              administrative credentials and handover documentation.
            </li>
          </ul>

          <h4>2. Standard Project Timelines</h4>
          <ul>
            <li>
              <strong>Starter Website:</strong> Delivered within{" "}
              <strong>5 to 7 business days</strong>.
            </li>
            <li>
              <strong>Business Website (Up to 5 Pages):</strong> Delivered
              within <strong>1 to 2 weeks</strong>.
            </li>
            <li>
              <strong>Professional Website:</strong> Delivered within{" "}
              <strong>2 to 3 weeks</strong>.
            </li>
            <li>
              <strong>E-Commerce Storefront:</strong> Delivered within{" "}
              <strong>3 to 5 weeks</strong>.
            </li>
          </ul>

          <h4>3. Timeline Dependencies</h4>
          <p>
            Delivery timelines commence upon receipt of the initial 50% advance
            payment and the required business assets (copy, images, logo,
            business details). Any delay in client feedback or provision of
            credentials will adjust the scheduled delivery date proportionally.
          </p>

          <h4>4. Proof of Delivery</h4>
          <p>
            Delivery is complete upon written email handover confirming live
            domain deployment and the transmission of repository credentials to
            the client.
          </p>
        </>
      ),
    },

    contact: {
      title: "Business Contact & Support Information",
      subtitle: "Operating Identity & Support Channels",
      icon: Mail,
      updated: "November 2026",
      content: (
        <>
          <p>
            <strong>VELSPECTRA</strong> operates as a registered sole
            proprietorship digital solutions agency in India, serving ambitious
            clients across India and globally.
          </p>

          <div className="policy-contact-box">
            <h4>Trade Name & Operating Entity</h4>
            <p>
              <strong>Business Name:</strong> VELSPECTRA
            </p>
            <p>
              <strong>Official Website:</strong> https://velspectra.in
            </p>
            <p>
              <strong>Official Email:</strong> vishwanathdvgmm@gmail.com
            </p>
            <p>
              <strong>Contact & WhatsApp:</strong> +91 8310490313
            </p>
            <p>
              <strong>Business Activity:</strong> IT & Website Design,
              Development & Digital Solutions
            </p>
            <p>
              <strong>Entity Type:</strong> Sole Proprietorship
            </p>
            <p>
              <strong>Settlement Jurisdiction:</strong> India
            </p>
          </div>

          <h4>Customer Support & Inquiries</h4>
          <p>
            For project inquiries, quotations, technical support, or billing
            queries, reach out directly:
          </p>
          <ul>
            <li>
              <strong>Email Support:</strong> vishwanathdvgmm@gmail.com
              (Response within 24 business hours)
            </li>
            <li>
              <strong>Phone / WhatsApp:</strong> +91 8310490313 (Direct founder
              hotline for project clients)
            </li>
            <li>
              <strong>Business Hours:</strong> Monday – Saturday, 9:30 AM – 6:30
              PM IST
            </li>
          </ul>
        </>
      ),
    },

    payment: {
      title: "Payment Process & Workflow",
      subtitle: "Official Manual Collection & Verification Model (v1.0)",
      icon: CheckCircle2,
      updated: "November 2026",
      content: (
        <>
          <p>
            VELSPECTRA follows a structured, quotation-and-invoice-driven
            payment model. We do not require clients to enter sensitive payment
            details on our website; all transactions are executed directly
            through your own bank or UPI application against an official
            invoice.
          </p>

          <h4>1. Customer Payment Workflow</h4>
          <ol>
            <li>
              <strong>Enquiry &amp; Discovery:</strong> You share your business
              goals, required pages, and specifications.
            </li>
            <li>
              <strong>Written Scope &amp; Quotation:</strong> We provide a
              formal written quotation with complete deliverables, inclusions,
              exclusions, and timeline.
            </li>
            <li>
              <strong>Client Approval:</strong> You approve the scope and
              pricing in writing.
            </li>
            <li>
              <strong>Invoice Issuance:</strong> We issue a project invoice with
              a unique invoice ID (e.g. <code>VEL-2026-001</code>) and payment
              instructions.
            </li>
            <li>
              <strong>Payment Transfer:</strong> You pay using the agreed method
              (UPI or domestic bank transfer for India; international bank wire
              for overseas).
            </li>
            <li>
              <strong>Independent Verification:</strong> We verify the actual
              credit in our receiving account before commencing work.
            </li>
            <li>
              <strong>Commencement &amp; Receipts:</strong> We issue an official
              receipt and begin work on your project.
            </li>
            <li>
              <strong>Milestone Handover:</strong> Subsequent milestone payments
              are invoiced and verified at agreed development stages.
            </li>
          </ol>

          <h4>2. Standard Milestone Schedule</h4>
          <ul>
            <li>
              <strong>50% Project Advance:</strong> Due upon quotation approval
              before design or code begins.
            </li>
            <li>
              <strong>30% Development Milestone:</strong> Due upon staging site
              review and core page completion.
            </li>
            <li>
              <strong>20% Final Handover:</strong> Due before final custom
              domain connection and production repository handover.
            </li>
          </ul>

          <h4>3. Accepted Payment Routes</h4>
          <ul>
            <li>
              <strong>Indian Clients:</strong> Direct UPI (GPay, PhonePe, Paytm,
              BHIM) and domestic bank transfers (NEFT, IMPS). Official payment
              UPI ID and banking details are shared exclusively on valid
              invoices.
            </li>
            <li>
              <strong>International Clients:</strong> Direct international
              inward bank transfer (SWIFT wire) to our Indian bank account with
              required service-export purpose codes and documentation.
            </li>
          </ul>

          <h4>4. Verification &amp; Security Controls</h4>
          <p>
            <strong>Operating rule:</strong> No project is marked paid and no
            payment-dependent work begins until funds have been independently
            verified as credited in the receiving account. A payment screenshot
            or transaction ID alone does not constitute verified settlement.
          </p>
        </>
      ),
    },
  };

  const active = policies[policyType] || policies.terms;
  const Icon = active.icon;

  return (
    <div className="policy-modal-backdrop" onClick={onClose}>
      <div
        className="policy-modal-container"
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
          aria-label="Close policy"
        >
          <X size={20} />
        </button>

        <div className="policy-modal-header">
          <div className="policy-icon-wrap">
            <Icon size={24} />
          </div>
          <div>
            <span className="policy-eyebrow">
              VELSPECTRA // COMPLIANCE & LEGAL
            </span>
            <h2>{active.title}</h2>
            <p className="policy-subtitle">
              {active.subtitle} · Last Updated: {active.updated}
            </p>
          </div>
        </div>

        <div className="policy-modal-body">{active.content}</div>

        <div className="policy-modal-footer">
          <div className="compliance-tag">
            <CheckCircle2 size={15} color="#34d399" />
            <span>RBI, Banking & International Commercial Standard</span>
          </div>
          <button
            type="button"
            className="button button-primary"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
          >
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
}
