import { Resend } from "resend"

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

export type ContactNotificationPayload = {
  name: string
  email: string
  message: string
}

function buildContactNotificationHtml(payload: {
  name: string
  email: string
  message: string
}): string {
  const { name, email, message } = payload
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message)

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New inquiry</title>
  </head>
  <body style="margin:0;padding:0;background-color:#e8e6e3;-webkit-font-smoothing:antialiased;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#e8e6e3;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;border-collapse:collapse;">
            <tr>
              <td style="background:linear-gradient(135deg,#141414 0%,#1f1f1f 100%);border-radius:12px 12px 0 0;padding:28px 28px 24px;">
                <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:600;letter-spacing:0.02em;color:#faf9f7;line-height:1.2;">
                  Wizard Films
                </p>
                <p style="margin:8px 0 0;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:#a8a29e;">
                  New inquiry
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color:#ffffff;padding:0 1px 1px;border-radius:0 0 12px 12px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background-color:#ffffff;border-radius:0 0 11px 11px;overflow:hidden;">
                  <tr>
                    <td style="padding:24px 28px 8px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                      <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#78716c;">Name</p>
                      <p style="margin:0;font-size:16px;color:#1c1917;line-height:1.5;">${safeName}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px 28px 8px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                      <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#78716c;">Email</p>
                      <p style="margin:0;font-size:16px;line-height:1.5;">
                        <a href="mailto:${safeEmail}" style="color:#b45309;text-decoration:none;font-weight:500;">${safeEmail}</a>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px 28px 28px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                      <p style="margin:0 0 10px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#78716c;">Message</p>
                      <div style="margin:0;padding:16px 18px;background-color:#fafaf9;border:1px solid #e7e5e4;border-radius:8px;font-size:15px;color:#292524;line-height:1.6;white-space:pre-wrap;">${safeMessage}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 8px 0;text-align:center;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;color:#78716c;line-height:1.5;">
                You can reply directly to this email to reach the sender.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function buildContactNotificationText(payload: {
  name: string
  email: string
  message: string
}): string {
  return [
    "Wizard Films — new website inquiry",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    "",
    "Message:",
    payload.message,
    "",
    "Reply to this email to respond to the sender.",
  ].join("\n")
}

/**
 * Sends a notification email for a new contact form submission.
 * Requires RESEND_API_KEY, CONTACT_NOTIFICATION_EMAIL, and RESEND_FROM (verified sender).
 */
export async function sendContactNotification(
  payload: ContactNotificationPayload
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_NOTIFICATION_EMAIL
  const from = process.env.RESEND_FROM

  if (!apiKey?.trim()) {
    throw new Error(
      "Email is not configured: set RESEND_API_KEY. See .env.example."
    )
  }
  if (!to?.trim()) {
    throw new Error(
      "Email is not configured: set CONTACT_NOTIFICATION_EMAIL. See .env.example."
    )
  }
  if (!from?.trim()) {
    throw new Error(
      "Email is not configured: set RESEND_FROM (e.g. Wizard Films <mail@yourdomain.com>). See .env.example."
    )
  }

  const name = payload.name.trim()
  const email = payload.email.trim()
  const message = payload.message.trim()

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: from.trim(),
    to: [to.trim()],
    replyTo: email,
    subject: "New Inquiry for Wizard Films",
    html: buildContactNotificationHtml({ name, email, message }),
    text: buildContactNotificationText({ name, email, message }),
  })

  if (error) {
    throw new Error(error.message || "Failed to send notification email.")
  }
}
