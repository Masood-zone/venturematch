import nodemailer from "nodemailer";
import { env } from "@/lib/env";

let _transporter: import("nodemailer").Transporter | null = null;

export function getTransporter(): import("nodemailer").Transporter {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpPort === 465,
      auth: env.smtpUser
        ? { user: env.smtpUser, pass: env.smtpPassword }
        : undefined,
    });
  }
  return _transporter;
}

interface MailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendMail(options: MailOptions): Promise<void> {
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: env.smtpFrom,
      ...options,
    });
  } catch (err) {
    console.error("[Mailer] Failed to send email:", err);
    throw err;
  }
}

export function buildVerificationEmail(name: string, url: string): string {
  return `
    <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0B1D3A; padding: 24px; text-align: center;">
        <h1 style="color: #FFFFFF; font-size: 24px; margin: 0;">VentureMatch</h1>
        <p style="color: #0AA08A; margin: 4px 0 0;">Connect Skills. Build Ventures.</p>
      </div>
      <div style="padding: 32px 24px;">
        <h2 style="color: #0B1D3A;">Hi ${name},</h2>
        <p style="color: #5F6B7A; line-height: 1.6;">
          Verify your email address to activate your VentureMatch account.
        </p>
        <a href="${url}" style="display: inline-block; background: #0AA08A; color: #FFFFFF; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; margin: 16px 0;">
          Verify Email
        </a>
        <p style="color: #8A94A6; font-size: 13px;">
          If you did not create an account, you can ignore this email.
        </p>
      </div>
    </div>
  `;
}
