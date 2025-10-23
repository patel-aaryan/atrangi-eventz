import { NextResponse } from "next/server";
import { emailService } from "@/server/services/email.service";

type TemplateType = "verification" | "welcome" | "reset";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, message, template } = body as {
      to?: string;
      subject?: string;
      message?: string;
      template?: TemplateType;
      url?: string;
      name?: string;
    };

    if (!to) {
      return NextResponse.json(
        { success: false, error: "Missing 'to' field" },
        { status: 400 }
      );
    }

    // Template flows
    if (template === "verification") {
      if (!body.url) {
        return NextResponse.json(
          { success: false, error: "Missing 'url' for verification template" },
          { status: 400 }
        );
      }
      await emailService.sendVerificationEmail(to, body.url);
      return NextResponse.json({
        success: true,
        message: "Verification email sent",
      });
    }

    if (template === "reset") {
      if (!body.url) {
        return NextResponse.json(
          { success: false, error: "Missing 'url' for reset template" },
          { status: 400 }
        );
      }
      await emailService.sendPasswordResetEmail(to, body.url);
      return NextResponse.json({
        success: true,
        message: "Password reset email sent",
      });
    }

    if (template === "welcome") {
      await emailService.sendWelcomeEmail(to, body.name || "");
      return NextResponse.json({
        success: true,
        message: "Welcome email sent",
      });
    }

    // Fallback: custom email
    if (!subject || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: subject, message for custom email",
        },
        { status: 400 }
      );
    }

    await emailService.sendEmail({
      to,
      subject,
      text: message,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>${subject}</h2>
        <p>${message}</p>
      </div>`,
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully!",
    });
  } catch (error) {
    console.error("Error sending test email:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      },
      { status: 500 }
    );
  }
}
