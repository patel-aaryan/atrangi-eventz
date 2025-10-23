import React from "react";

interface Props {
  resetUrl: string;
}

export default function PasswordResetEmail({ resetUrl }: Props) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 20 }}>
      <h2>Reset your password</h2>
      <p>
        You requested a password reset. Click the button below to reset your
        password:
      </p>
      <div style={{ margin: "24px 0" }}>
        <a
          href={resetUrl}
          style={{
            backgroundColor: "#2196F3",
            color: "white",
            padding: "12px 20px",
            textDecoration: "none",
            borderRadius: 6,
          }}
        >
          Reset Password
        </a>
      </div>
      <p>If you didn&apos;t request this, ignore this email.</p>
      <p style={{ color: "#555", wordBreak: "break-all" }}>{resetUrl}</p>
    </div>
  );
}
