import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@ucomp.com";

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetUrl: string,
) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Reset your Ucomp password",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f172a;">Reset your password</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your Ucomp password. Click the button below to choose a new password.</p>
        <a href="${resetUrl}" style="display: inline-block; background: #0f172a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #64748b; font-size: 14px;">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
        <p style="color: #64748b; font-size: 14px;">— The Ucomp Team</p>
      </div>
    `,
  });
}

export async function sendEmailChangeVerification(
  email: string,
  name: string,
  verifyUrl: string,
) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Verify your new Ucomp email address",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f172a;">Verify your new email</h2>
        <p>Hi ${name},</p>
        <p>You requested to change your Ucomp email address. Click the button below to verify your new email.</p>
        <a href="${verifyUrl}" style="display: inline-block; background: #0f172a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
          Verify Email
        </a>
        <p style="color: #64748b; font-size: 14px;">This link expires in 1 hour. If you didn't request this change, please contact us immediately.</p>
        <p style="color: #64748b; font-size: 14px;">— The Ucomp Team</p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Welcome to Ucomp!",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f172a;">Welcome to Ucomp!</h2>
        <p>Hi ${name},</p>
        <p>Your account has been created successfully. You can now upload documents, queue them for printing, and manage your files securely.</p>
        <a href="${process.env.AUTH_URL}/sign-in" style="display: inline-block; background: #0f172a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
          Sign In to Ucomp
        </a>
        <p style="color: #64748b; font-size: 14px;">— The Ucomp Team</p>
      </div>
    `,
  });
}
