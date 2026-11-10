// Cloudflare Pages Function: POST /api/create-payment
// Secure server-side Cashfree Order Creation (keeps CASHFREE_SECRET_KEY off the frontend)

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const {
      order_id,
      order_amount,
      order_currency = "INR",
      customer_details,
      order_note,
    } = body;

    // Validate request
    if (!order_id || !order_amount) {
      return new Response(
        JSON.stringify({ error: "Missing required order_id or order_amount" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const appId = env?.CASHFREE_APP_ID;
    const secretKey = env?.CASHFREE_SECRET_KEY;
    const isProd = env?.CASHFREE_ENV === "PRODUCTION";

    // Cashfree PG Base URL
    const baseUrl = isProd
      ? "https://api.cashfree.com/pg"
      : "https://sandbox.cashfree.com/pg";

    // If keys are provided in Cloudflare environment secrets:
    if (appId && secretKey) {
      const cfPayload = {
        order_id: String(order_id),
        order_amount: Number(order_amount),
        order_currency: order_currency,
        customer_details: {
          customer_id: customer_details?.customer_id || "client_" + Date.now(),
          customer_name: customer_details?.customer_name || "Valued Customer",
          customer_email:
            customer_details?.customer_email || "vishwanathdvgmm@gmail.com",
          customer_phone: customer_details?.customer_phone || "8310490313",
        },
        order_meta: {
          return_url:
            "https://velspectra.in/payment/status?order_id={order_id}",
          notify_url: "https://velspectra.in/api/cashfree-webhook",
        },
        order_note: order_note || `VELSPECTRA Order ${order_id}`,
      };

      const cfResponse = await fetch(`${baseUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": appId,
          "x-client-secret": secretKey,
          "x-api-version": "2023-08-01",
        },
        body: JSON.stringify(cfPayload),
      });

      const cfData = await cfResponse.json();

      return new Response(JSON.stringify(cfData), {
        status: cfResponse.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fallback simulation mode for testing & onboarding preview
    return new Response(
      JSON.stringify({
        order_id: order_id,
        order_amount: order_amount,
        order_currency: order_currency,
        order_status: "ACTIVE",
        payment_session_id:
          "session_test_" + Math.random().toString(36).substring(2, 15),
        environment: "sandbox",
        message:
          "Cashfree PG integration is ready. Configure CASHFREE_APP_ID and CASHFREE_SECRET_KEY in Cloudflare Pages settings for live settlements.",
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
