import React from "react";

interface Props {
  name?: string;
  appUrl?: string;
}

export default function WelcomeEmail({ name, appUrl }: Props) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 20 }}>
      <h2>Welcome to Atrangi Eventz!</h2>
      <p>Hi {name ?? "there"},</p>
      <p>
        We&apos;re glad you joined. Explore events and connect with sponsors.
      </p>
      <div style={{ margin: "24px 0" }}>
        <a
          href={appUrl ?? "http://localhost:3000/events"}
          style={{
            backgroundColor: "#ff5722",
            color: "white",
            padding: "12px 20px",
            textDecoration: "none",
            borderRadius: 6,
          }}
        >
          Explore Events
        </a>
      </div>
      <p style={{ color: "#888", fontSize: 12 }}>
        Questions? Reply to this email.
      </p>
    </div>
  );
}
