import React from "react";

interface Props {
  verificationUrl: string;
  name?: string;
}

export default function VerificationEmail({ verificationUrl, name }: Props) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 20 }}>
      <h2>Verify your email</h2>
      <p>Hi {name ?? "there"},</p>
      <p>
        Thanks for signing up. Please verify your email by clicking the link
        below:
      </p>
      <div style={{ margin: "24px 0" }}>
        <a
          href={verificationUrl}
          style={{
            backgroundColor: "#4caf50",
            color: "white",
            padding: "12px 20px",
            textDecoration: "none",
            borderRadius: 6,
          }}
        >
          Verify Email
        </a>
      </div>
      <p>
        If that doesn&apos;t work, copy and paste the following link into your
        browser:
      </p>
      <p style={{ color: "#555", wordBreak: "break-all" }}>{verificationUrl}</p>
      <p style={{ color: "#888", fontSize: 12 }}>
        If you didn&apos;t request this, ignore this email.
      </p>
    </div>
  );
}
