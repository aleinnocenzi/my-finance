import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const EMAIL_FROM = Deno.env.get("EMAIL_FROM")!;
const EMAIL_TO = Deno.env.get("EMAIL_TO")!;

Deno.serve(async () => {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: "MyFinance reminder",
      text: "Hi Alessio, don't forget to add new expenses you made today",
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    return new Response(error, { status: res.status });
  }

  return new Response("sent", { status: 200 });
});
