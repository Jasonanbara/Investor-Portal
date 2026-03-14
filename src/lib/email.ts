import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "NorthLend Financial <noreply@northlend.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ─── Email Template Wrapper ─────────────────────────────────────────────────

function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#1a1b23;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1b23;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#282A35;border-radius:12px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid rgba(198,171,78,0.2);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:24px;font-weight:700;color:#C6AB4E;letter-spacing:0.5px;">NorthLend</span>
                    <span style="font-size:24px;font-weight:300;color:#CFD2E5;letter-spacing:0.5px;"> Financial</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;border-top:1px solid rgba(198,171,78,0.1);">
              <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.5;">
                This email was sent by NorthLend Financial. If you did not request this email, please disregard it.
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#6b7280;">
                &copy; ${new Date().getFullYear()} NorthLend Financial. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buttonHtml(text: string, href: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:32px 0;">
      <tr>
        <td style="background-color:#C6AB4E;border-radius:8px;padding:14px 32px;">
          <a href="${href}" style="color:#1a1b23;text-decoration:none;font-size:16px;font-weight:600;display:inline-block;">
            ${text}
          </a>
        </td>
      </tr>
    </table>`;
}

// ─── Email Functions ────────────────────────────────────────────────────────

export async function sendVerificationEmail(
  email: string,
  token: string,
  name: string
): Promise<void> {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;

  const html = emailWrapper(`
    <h1 style="margin:0 0 16px;font-size:22px;font-weight:600;color:#CFD2E5;">
      Verify Your Email Address
    </h1>
    <p style="margin:0 0 8px;font-size:15px;color:#9ca3af;line-height:1.6;">
      Hello ${name},
    </p>
    <p style="margin:0 0 8px;font-size:15px;color:#9ca3af;line-height:1.6;">
      Thank you for registering with NorthLend Financial. Please verify your email address by clicking the button below.
    </p>
    ${buttonHtml("Verify Email", verifyUrl)}
    <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.5;">
      This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.
    </p>
  `);

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Verify your email - NorthLend Financial",
    html,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  name: string
): Promise<void> {
  const resetUrl = `${APP_URL}/forgot-password?token=${token}`;

  const html = emailWrapper(`
    <h1 style="margin:0 0 16px;font-size:22px;font-weight:600;color:#CFD2E5;">
      Reset Your Password
    </h1>
    <p style="margin:0 0 8px;font-size:15px;color:#9ca3af;line-height:1.6;">
      Hello ${name},
    </p>
    <p style="margin:0 0 8px;font-size:15px;color:#9ca3af;line-height:1.6;">
      We received a request to reset your password. Click the button below to create a new password.
    </p>
    ${buttonHtml("Reset Password", resetUrl)}
    <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.5;">
      This link will expire in 1 hour. If you did not request a password reset, please ignore this email or contact support if you have concerns.
    </p>
  `);

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Reset your password - NorthLend Financial",
    html,
  });
}

export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<void> {
  const dashboardUrl = `${APP_URL}/dashboard`;

  const html = emailWrapper(`
    <h1 style="margin:0 0 16px;font-size:22px;font-weight:600;color:#CFD2E5;">
      Welcome to NorthLend Financial
    </h1>
    <p style="margin:0 0 8px;font-size:15px;color:#9ca3af;line-height:1.6;">
      Hello ${name},
    </p>
    <p style="margin:0 0 8px;font-size:15px;color:#9ca3af;line-height:1.6;">
      Your account has been created successfully. You can now access the investor portal to view mortgage investment opportunities.
    </p>
    <p style="margin:0 0 8px;font-size:15px;color:#9ca3af;line-height:1.6;">
      To get started, you will need to complete the following steps:
    </p>
    <ul style="margin:0 0 16px;padding-left:20px;font-size:15px;color:#9ca3af;line-height:1.8;">
      <li>Complete your investor profile</li>
      <li>Submit accreditation documentation</li>
      <li>Sign the Non-Disclosure Agreement</li>
    </ul>
    ${buttonHtml("Go to Dashboard", dashboardUrl)}
  `);

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Welcome to NorthLend Financial",
    html,
  });
}

export async function send2FACodeEmail(
  email: string,
  code: string,
  name: string
): Promise<void> {
  const html = emailWrapper(`
    <h1 style="margin:0 0 16px;font-size:22px;font-weight:600;color:#CFD2E5;">
      Your Verification Code
    </h1>
    <p style="margin:0 0 8px;font-size:15px;color:#9ca3af;line-height:1.6;">
      Hello ${name},
    </p>
    <p style="margin:0 0 24px;font-size:15px;color:#9ca3af;line-height:1.6;">
      Use the following code to complete your sign-in:
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <td style="background-color:rgba(198,171,78,0.1);border:1px solid rgba(198,171,78,0.3);border-radius:8px;padding:16px 32px;">
          <span style="font-size:32px;font-weight:700;color:#C6AB4E;letter-spacing:8px;font-family:'Courier New',monospace;">
            ${code}
          </span>
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.5;">
      This code will expire in 5 minutes. If you did not attempt to sign in, please change your password immediately.
    </p>
  `);

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Your verification code - NorthLend Financial",
    html,
  });
}

export async function sendDealCommitmentNotification(
  email: string,
  name: string,
  dealTitle: string,
  amount: number
): Promise<void> {
  const dashboardUrl = `${APP_URL}/dashboard`;
  const formattedAmount = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(amount);

  const html = emailWrapper(`
    <h1 style="margin:0 0 16px;font-size:22px;font-weight:600;color:#CFD2E5;">
      Investment Commitment Confirmed
    </h1>
    <p style="margin:0 0 8px;font-size:15px;color:#9ca3af;line-height:1.6;">
      Hello ${name},
    </p>
    <p style="margin:0 0 24px;font-size:15px;color:#9ca3af;line-height:1.6;">
      Your investment commitment has been successfully recorded. Here are the details:
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;background-color:rgba(198,171,78,0.05);border:1px solid rgba(198,171,78,0.15);border-radius:8px;">
      <tr>
        <td style="padding:20px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:8px 0;font-size:14px;color:#6b7280;">Deal</td>
              <td style="padding:8px 0;font-size:14px;color:#CFD2E5;text-align:right;font-weight:600;">${dealTitle}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-size:14px;color:#6b7280;border-top:1px solid rgba(198,171,78,0.1);">Amount</td>
              <td style="padding:8px 0;font-size:14px;color:#C6AB4E;text-align:right;font-weight:600;border-top:1px solid rgba(198,171,78,0.1);">${formattedAmount}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-size:14px;color:#6b7280;border-top:1px solid rgba(198,171,78,0.1);">Status</td>
              <td style="padding:8px 0;font-size:14px;color:#10b981;text-align:right;font-weight:600;border-top:1px solid rgba(198,171,78,0.1);">Committed</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 8px;font-size:15px;color:#9ca3af;line-height:1.6;">
      Our team will review your commitment and provide next steps. You can track the status of your investment from your dashboard.
    </p>
    ${buttonHtml("View Dashboard", dashboardUrl)}
  `);

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Investment Committed: ${dealTitle} - NorthLend Financial`,
    html,
  });
}
