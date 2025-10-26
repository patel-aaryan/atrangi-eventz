import { mg } from "../config/mailgun";
import { render } from "@react-email/render";
import VerificationEmail from "../emails/VerificationEmail";
import WelcomeEmail from "../emails/WelcomeEmail";
import PasswordResetEmail from "../emails/PasswordResetEmail";

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

export class EmailService {
  private domain: string;
  private defaultFrom: string;

  constructor() {
    this.domain = process.env.MAILGUN_DOMAIN || "";
    this.defaultFrom =
      process.env.MAILGUN_FROM_EMAIL || `noreply@${this.domain}`;

    if (!this.domain) {
      console.warn("MAILGUN_DOMAIN is not set in environment variables");
    }
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const messageData = {
        from: options.from || this.defaultFrom,
        to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
        subject: options.subject,
        ...(options.text && { text: options.text }),
        ...(options.html && { html: options.html }),
      };

      const response = await mg.messages.create(
        this.domain,
        messageData as Parameters<typeof mg.messages.create>[1]
      );
      console.log("Email sent successfully:", response);
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }

  async sendVerificationEmail(
    to: string,
    verificationUrl: string
  ): Promise<void> {
    const html = await render(
      <VerificationEmail verificationUrl={verificationUrl} />
    );
    const text = `Please verify your email by visiting: ${verificationUrl}`;

    await this.sendEmail({
      to,
      subject: "Verify Your Email - Atrangi Eventz",
      html,
      text,
    });
  }

  async sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
    const html = await render(<PasswordResetEmail resetUrl={resetUrl} />);
    const text = `Reset your password by visiting: ${resetUrl}`;

    await this.sendEmail({
      to,
      subject: "Reset Your Password - Atrangi Eventz",
      html,
      text,
    });
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const html = await render(<WelcomeEmail name={name} appUrl={appUrl} />);
    const text = `Hi ${name},\n\nWelcome to Atrangi Eventz! We're excited to have you on board.`;

    await this.sendEmail({
      to,
      subject: "Welcome to Atrangi Eventz! 🎉",
      html,
      text,
    });
  }
}

// Export a singleton instance
export const emailService = new EmailService();
