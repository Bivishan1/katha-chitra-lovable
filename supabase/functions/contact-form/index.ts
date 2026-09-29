type ContactFormPayload = {
  name: string;
  company: string;
  email: string;
  phone: string;
  type: string;
  budget: string;
  message: string;
  recaptchaToken: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parsePayload(value: unknown): ContactFormPayload | null {
  if (
    !isRecord(value) ||
    typeof value.name !== "string" ||
    typeof value.company !== "string" ||
    typeof value.email !== "string" ||
    typeof value.phone !== "string" ||
    typeof value.type !== "string" ||
    typeof value.budget !== "string" ||
    typeof value.message !== "string" ||
    typeof value.recaptchaToken !== "string"
  ) {
    return null;
  }

  if (
    !value.name.trim() ||
    !value.email.trim() ||
    !value.message.trim() ||
    !value.recaptchaToken
  ) {
    return null;
  }

  return {
    name: value.name,
    company: value.company,
    email: value.email,
    phone: value.phone,
    type: value.type,
    budget: value.budget,
    message: value.message,
    recaptchaToken: value.recaptchaToken,
  };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ success: false, message: "Method not allowed." }, 405);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      { success: false, message: "Invalid request body." },
      400,
    );
  }

  const payload = parsePayload(body);
  if (!payload) {
    return jsonResponse(
      { success: false, message: "Please complete all required fields." },
      400,
    );
  }

  const recaptchaSecret = Deno.env.get("RECAPTCHA_SECRET_KEY");
  const web3formsAccessKey = Deno.env.get("WEB3FORMS_ACCESS_KEY");
  if (!recaptchaSecret || !web3formsAccessKey) {
    console.error("Contact form secrets are not configured.");
    return jsonResponse({
      success: false,
      message: "The contact form is temporarily unavailable.",
    }, 500);
  }

  try {
    const verificationResponse = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: recaptchaSecret,
          response: payload.recaptchaToken,
        }),
      },
    );

    if (!verificationResponse.ok) {
      console.error("Google reCAPTCHA verification request failed.");
      return jsonResponse(
        {
          success: false,
          message: "Unable to verify reCAPTCHA. Please try again.",
        },
        502,
      );
    }

    const verificationResult: unknown = await verificationResponse.json();
    if (!isRecord(verificationResult) || verificationResult.success !== true) {
      return jsonResponse(
        {
          success: false,
          message: "reCAPTCHA verification failed. Please try again.",
        },
        400,
      );
    }

    const web3formsResponse = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: web3formsAccessKey,
        name: payload.name,
        company: payload.company,
        phone: payload.phone,
        email: payload.email,
        budget: payload.budget,
        type: payload.type,
        message: payload.message,
        subject: `[${payload.type}] ${payload.name} — ${payload.company || "Inquiry"}`,
      }),
    });

    const web3formsResult: unknown = await web3formsResponse.json();
    if (
      !web3formsResponse.ok ||
      !isRecord(web3formsResult) ||
      web3formsResult.success !== true
    ) {
      console.error(
        "Web3Forms rejected the contact form submission.",
        web3formsResponse.status,
      );
      return jsonResponse(
        {
          success: false,
          message: "The enquiry could not be delivered. Please try again later.",
        },
        502,
      );
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error("Contact form submission failed.", error);
    return jsonResponse({
      success: false,
      message: "Unable to send your enquiry. Please try again later.",
    }, 502);
  }
});
