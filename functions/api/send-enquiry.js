// Cloudflare Pages Function: POST /api/send-enquiry
// Dispatches project lead details to vishwanathdvgmm@gmail.com and returns formatted response

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const {
      name,
      email,
      phone,
      package: pkg,
      budget,
      message,
      currency = "INR",
    } = data;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields (name, email, message)",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Forward to FormSubmit API targeted directly at your inbox
    const emailPayload = {
      _subject: `⚡ VELSPECTRA Lead: ${name} (${pkg || "Custom Project"})`,
      _replyto: email,
      "Client Name": name,
      "Client Email": email,
      "Client Phone / WhatsApp": phone || "Not provided",
      "Selected Package": pkg || "Not specified",
      "Target Budget": budget || "Not specified",
      "Project Requirements": message,
      "Submission Timestamp": new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
      _template: "table",
      _captcha: "false",
    };

    let sent = false;
    try {
      const forwardRes = await fetch(
        "https://formsubmit.co/ajax/vishwanathdvgmm@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(emailPayload),
        },
      );
      if (forwardRes.ok) {
        sent = true;
      }
    } catch (fErr) {
      console.warn("FormSubmit transmission warning:", fErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        delivered: sent,
        message: "Enquiry logged and forwarded to vishwanathdvgmm@gmail.com",
        recipient: "vishwanathdvgmm@gmail.com",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal Server Error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
