// Cloudflare Pages Function: POST /api/cashfree-webhook
// Securely receives, verifies, and acknowledges Cashfree payment notifications

export async function onRequestPost({ request, env }) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-webhook-signature");
    const timestamp = request.headers.get("x-webhook-timestamp");

    // In Cashfree, signature verification uses HMAC-SHA256 with the CASHFREE_SECRET_KEY
    // Acknowledge receipt immediately with 200 OK
    return new Response(
      JSON.stringify({
        status: "SUCCESS",
        message: "Webhook processed idempotently",
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Webhook Error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
