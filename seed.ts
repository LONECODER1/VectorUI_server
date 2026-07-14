import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Component from "./models/components.model.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("Connected to MongoDB for seeding");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
};

// ── Sandbox-compatible overrides ───────────────────────────────────────────────
// Components listed here will use this custom code in the preview instead of
// their source .tsx file (which uses CSS modules, TS types etc that break react-live)
const SANDBOX_OVERRIDES: Record<string, string> = {
  Button: `import React, { useState } from "react";

// Inline SVG icons (no external deps needed)
const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const SpinnerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ animation: "vuiSpin 0.8s linear infinite" }}>
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
);

export const Button = ({
  children = "Click Me",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  onClick = () => {}
}) => {
  const [hovered, setHovered] = useState(false);

  const variantStyles = {
    primary:  { background: hovered && !disabled && !loading ? "#4f46e5" : "#6366f1", color: "#fff", border: "1px solid #6366f1" },
    secondary:{ background: hovered && !disabled && !loading ? "#e5e7eb" : "#f3f4f6", color: "#1f2937", border: "1px solid #e5e7eb" },
    outline:  { background: hovered && !disabled && !loading ? "rgba(99,102,241,0.08)" : "transparent", color: "#6366f1", border: "1px solid #6366f1" },
    ghost:    { background: hovered && !disabled && !loading ? "rgba(99,102,241,0.08)" : "transparent", color: "#6366f1", border: "1px solid transparent" },
  };

  const sizeStyles = {
    sm: { padding: "6px 12px", fontSize: "12px", gap: "5px" },
    md: { padding: "8px 16px", fontSize: "14px", gap: "6px" },
    lg: { padding: "11px 22px", fontSize: "16px", gap: "8px" },
  };

  const vStyle = variantStyles[variant] || variantStyles.primary;
  const sStyle = sizeStyles[size] || sizeStyles.md;

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: sStyle.gap,
    borderRadius: "8px",
    fontWeight: "500",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled || loading ? 0.5 : 1,
    transition: "all 0.15s ease",
    fontFamily: "system-ui, -apple-system, sans-serif",
    outline: "none",
    padding: sStyle.padding,
    fontSize: sStyle.fontSize,
    lineHeight: "1",
    background: vStyle.background,
    color: vStyle.color,
    border: vStyle.border,
  };

  const icons = { ArrowRight: ArrowRightIcon, Download: DownloadIcon };
  const LeftIconComp = leftIcon ? icons[leftIcon] : null;
  const RightIconComp = rightIcon ? icons[rightIcon] : null;

  return (
    <>
      <style>{"@keyframes vuiSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }"}</style>
      <button
        style={base}
        disabled={disabled || loading}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {loading ? <SpinnerIcon /> : LeftIconComp ? <LeftIconComp /> : null}
        <span>{loading ? "Loading..." : children}</span>
        {!loading && RightIconComp ? <RightIconComp /> : null}
      </button>
    </>
  );
};`,
  Card: `import React, { useState } from "react";

export const Card = ({
  title = "Performance",
  description = "Real-time metrics with live dashboard updates every second.",
  icon = "⚡",
  tag = "Active",
  variant = "default",
  onClick = null
}) => {
  const [hovered, setHovered] = useState(false);
  const isClickable = !!onClick;

  const baseStyles = {
    position: "relative",
    overflow: "hidden",
    borderRadius: "12px",
    padding: "20px",
    width: "260px",
    boxSizing: "border-box",
    fontFamily: "system-ui, -apple-system, sans-serif",
    transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
    display: "flex",
    flexDirection: "column",
    cursor: isClickable ? "pointer" : "default",
    transform: hovered && isClickable ? "translateY(-4px)" : "translateY(0)",
    boxShadow: hovered && isClickable ? "0 10px 15px -3px rgba(0,0,0,0.1)" : "none"
  };

  const variantStyles = {
    default: {
      backgroundColor: "#ffffff",
      color: "#1f2937",
      border: \`1px solid \${hovered ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.08)"}\`
    },
    primary: {
      backgroundColor: "#1e1b4b",
      color: "#f9fafb",
      border: \`1px solid \${hovered ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.08)"}\`
    },
    outline: {
      backgroundColor: "transparent",
      border: "2px dashed #6366f1",
      color: "#f3f4f6"
    },
    glass: {
      background: "rgba(255, 255, 255, 0.03)",
      backdropFilter: "blur(12px)",
      border: \`1px solid \${hovered ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.08)"}\`,
      color: "#f3f4f6"
    }
  };

  const selectedVariant = variantStyles[variant] || variantStyles.default;

  const titleColor = variant === "default" ? "#111827" : "#ffffff";
  const descColor = variant === "default" ? "#6b7280" : "#9ca3af";
  const accentColor = variant === "primary" || variant === "outline" ? "#6366f1" : variant === "glass" ? "rgba(255, 255, 255, 0.2)" : "#1d9e75";
  const iconBg = variant === "primary" ? "rgba(99, 102, 241, 0.15)" : variant === "outline" ? "rgba(99, 102, 241, 0.1)" : variant === "glass" ? "rgba(255, 255, 255, 0.05)" : "#e1f5ee";
  const iconColor = variant === "primary" ? "#818cf8" : variant === "outline" ? "#6366f1" : variant === "glass" ? "#e5e7eb" : "#1d9e75";
  const tagBg = variant === "default" ? "#e1f5ee" : "rgba(255, 255, 255, 0.1)";
  const tagColor = variant === "default" ? "#0f6e56" : "#f3f4f6";

  return (
    <div
      style={{ ...baseStyles, ...selectedVariant }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "4px", backgroundColor: accentColor,
        borderRadius: "12px 12px 0 0",
      }} />
      
      {icon && (
        <div style={{
          width: "40px", height: "40px", borderRadius: "8px",
          backgroundColor: iconBg, color: iconColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", marginBottom: "14px",
        }}>
          {icon}
        </div>
      )}
      
      {title && <h3 style={{ fontSize: "15px", fontWeight: 700, color: titleColor, margin: "0 0 6px 0", lineHeight: 1.25 }}>{title}</h3>}
      {description && <p style={{ fontSize: "13px", color: descColor, lineHeight: 1.5, margin: "0 0 16px 0", flexGrow: 1 }}>{description}</p>}
      
      <div style={{
        display: "flex", alignItems: "center", justifyStyle: "space-between",
        borderTop: \`1px solid \${variant === "default" ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.08)"}\`,
        paddingTop: "12px", marginTop: "auto", width: "100%", justifyContent: "space-between"
      }}>
        {tag && (
          <span style={{
            fontSize: "11px", fontWeight: 600, padding: "3px 9px",
            borderRadius: "9999px", backgroundColor: tagBg, color: tagColor,
          }}>{tag}</span>
        )}
        <span style={{
          fontSize: "14px", color: "#9ca3af",
          transition: "transform 0.2s ease",
          transform: hovered && isClickable ? "translateX(3px)" : "translateX(0)",
        }}>→</span>
      </div>
    </div>
  );
};`,
  AvatarCard: `import React, { useState } from "react";

export const AvatarCard = ({
  name = "Aryan Sharma",
  role = "Frontend Developer",
  followers = 2400,
  following = 180,
  projects = 34,
  bio = "Building beautiful UIs one component at a time.",
  avatar = "",
  accent = "#6366f1",
  bg = "#0f172a",
  radius = "20px",
}) => {
  const [followed, setFollowed] = useState(false);

  const alpha = (hex, op) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return \`rgba(\${r},\${g},\${b},\${op})\`;
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const stats = [
    { label: "Followers", value: followed ? followers + 1 : followers },
    { label: "Following", value: following },
    { label: "Projects",  value: projects },
  ];

  return (
    <div style={{
      background: bg,
      borderRadius: radius,
      padding: "24px 20px",
      width: "280px",
      color: "#fff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
      border: "1px solid rgba(255,255,255,0.08)",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "3px",
        background: \`linear-gradient(90deg, \${accent}, \${alpha(accent, 0.3)})\`,
      }} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "16px" }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: avatar ? \`url(\${avatar}) center/cover\` : \`linear-gradient(135deg, \${accent}, \${alpha(accent, 0.5)})\`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "24px", fontWeight: "800", color: "#fff",
          border: \`3px solid \${alpha(accent, 0.4)}\`,
          marginBottom: "12px",
        }}>
          {!avatar && initials}
        </div>

        <div style={{ fontSize: "16px", fontWeight: "700", marginBottom: "3px" }}>{name}</div>
        <div style={{
          fontSize: "12px", fontWeight: "600",
          color: accent, background: alpha(accent, 0.12),
          padding: "2px 10px", borderRadius: "20px",
          border: \`1px solid \${alpha(accent, 0.3)}\`,
        }}>
          {role}
        </div>
      </div>

      <p style={{
        fontSize: "12px", color: "rgba(255,255,255,0.45)",
        textAlign: "center", lineHeight: 1.6,
        marginBottom: "18px", padding: "0 4px",
      }}>
        {bio}
      </p>

      <div style={{
        display: "flex", justifyContent: "space-around",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "12px", padding: "12px 8px",
        marginBottom: "16px",
      }}>
        {stats.map((s) => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "18px", fontWeight: "800" }}>
              {s.value >= 1000 ? (s.value / 1000).toFixed(1) + "k" : s.value}
            </div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setFollowed(!followed)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: \`1.5px solid \${accent}\`,
          fontWeight: "600",
          fontSize: "13px",
          cursor: "pointer",
          backgroundColor: followed ? "transparent" : accent,
          color: followed ? accent : "#ffffff",
          transition: "all 0.2s ease"
        }}
      >
        {followed ? "Following" : "Follow"}
      </button>
    </div>
  );
};`,
  BackgoundImageSlider: `import React, { useState, useEffect, useCallback } from "react";

export const BackgoundImageSlider = ({
  images = [
    {
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80",
      tag: "Travel",
      title: "Hidden Peaks of the Himalayas",
      description: "A breathtaking journey through untouched landscapes and ancient monasteries.",
    },
    {
      src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1400&q=80",
      tag: "Urban",
      title: "City Lights at Night",
      description: "Explore the vibrant energy of the world's most iconic skylines after dark.",
    },
    {
      src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1400&q=80",
      tag: "Nature",
      title: "Tropical Beach Paradise",
      description: "Crystal clear waters and white sand beaches that feel like the edge of the world.",
    },
    {
      src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&q=80",
      tag: "Adventure",
      title: "Starry Mountain Night",
      description: "Where silence meets the cosmos — a night sky like you've never seen before.",
    },
  ],
  width = "100%",
  height = "320px",
  accent = "#6366f1",
  radius = "12px",
  showDots = true,
  autoPlay = false,
  autoPlayInterval = 4000,
}) => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const alpha = (hex, op) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return \`rgba(\${r},\${g},\${b},\${op})\`;
  };

  const go = useCallback((index) => {
    if (animating) return;
    setAnimating(true);
    setCurrent((index + images.length) % images.length);
    setTimeout(() => setAnimating(false), 400);
  }, [animating, images.length]);

  const prev = () => go(current - 1);
  const next = () => go(current + 1);

  useEffect(() => {
    if (!autoPlay) return;
    const t = setInterval(() => go(current + 1), autoPlayInterval);
    return () => clearInterval(t);
  }, [autoPlay, autoPlayInterval, current, go]);

  const img = images[current] || images[0];

  return (
    <div style={{
      position: "relative",
      width: width,
      height: height,
      borderRadius: radius,
      overflow: "hidden",
      fontFamily: "system-ui, -apple-system, sans-serif",
      userSelect: "none",
    }}>
      <style>{"@keyframes hs-fade { from { opacity: 0; transform: scale(1.04); } to { opacity: 1; transform: scale(1); } } @keyframes hs-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }"}</style>
      <img
        key={current}
        src={img.src}
        alt={img.title}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          animation: "hs-fade 0.4s ease",
        }}
      />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)",
      }} />

      {img.tag && (
        <div
          key={current + "-tag"}
          style={{
            position: "absolute", top: "16px", left: "20px",
            padding: "4px 10px", borderRadius: "20px",
            background: alpha(accent, 0.85),
            fontSize: "10px", fontWeight: "700",
            color: "#fff", letterSpacing: "0.6px", textTransform: "uppercase",
            animation: "hs-up 0.4s ease",
          }}
        >
          {img.tag}
        </div>
      )}

      <div style={{
        position: "absolute", top: "16px", right: "20px",
        padding: "4px 10px", borderRadius: "20px",
        background: "rgba(0,0,0,0.45)",
        fontSize: "10px", fontWeight: "600", color: "rgba(255,255,255,0.7)",
      }}>
        {current + 1} / {images.length}
      </div>

      <button
        onClick={prev}
        style={{
          position: "absolute", left: "12px", top: "50%",
          transform: "translateY(-50%)",
          width: "36px", height: "36px", borderRadius: "50%",
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s", padding: 0, zIndex: 10,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        onClick={next}
        style={{
          position: "absolute", right: "12px", top: "50%",
          transform: "translateY(-50%)",
          width: "36px", height: "36px", borderRadius: "50%",
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s", padding: 0, zIndex: 10,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div style={{
        position: "absolute", bottom: showDots ? "44px" : "20px",
        left: "20px", right: "20px",
        zIndex: 5,
      }}>
        <h2
          key={current + "-title"}
          style={{
            fontSize: "18px",
            fontWeight: "800", color: "#fff",
            margin: "0 0 4px", lineHeight: 1.25,
            textShadow: "0 2px 12px rgba(0,0,0,0.4)",
            animation: "hs-up 0.45s ease",
            maxWidth: "600px",
          }}
        >
          {img.title}
        </h2>
        <p
          key={current + "-desc"}
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.7)",
            margin: 0, lineHeight: 1.5,
            textShadow: "0 1px 6px rgba(0,0,0,0.5)",
            animation: "hs-up 0.5s ease",
            maxWidth: "500px",
          }}
        >
          {img.description}
        </p>
      </div>

      {showDots && (
        <div style={{
          position: "absolute", bottom: "16px", left: 0, right: 0,
          display: "flex", justifyContent: "center",
          gap: "6px", zIndex: 5,
        }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              style={{
                width: i === current ? "20px" : "6px",
                height: "6px",
                borderRadius: "3px",
                border: "none", padding: 0, cursor: "pointer",
                background: i === current ? accent : "rgba(255,255,255,0.4)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};`,
};

const seedDatabase = async () => {
  await connectDB();

  const componentsDir = path.join(process.cwd(), "../vector-ui-lib/src/components");
  const folders = fs.readdirSync(componentsDir);

  let seededCount = 0;

  for (const folder of folders) {
    if (folder === "slot") continue; // Skip slot controls

    const componentPath = path.join(componentsDir, folder);
    const files = fs.readdirSync(componentPath);

    // Find .tsx or .jsx
    const componentFile = files.find(f => f.endsWith(".tsx") || f.endsWith(".jsx"));

    if (componentFile) {
      // Use sandbox override if available, else read the source file
      const code = SANDBOX_OVERRIDES[folder]
        ?? fs.readFileSync(path.join(componentPath, componentFile), "utf-8");

      let variations: any[] = [];
      let props: string[] = [];
      if (folder === "Button") {
        props = ["variant", "size", "loading", "disabled", "leftIcon", "rightIcon"];
        variations = [
          {
            name: "variant",
            options: ["primary", "secondary", "outline", "ghost"]
          },
          {
            name: "size",
            options: ["sm", "md", "lg"]
          },
          {
            name: "states",
            options: [
              { label: 'loading={true}', injectedProps: { loading: true } },
              { label: 'disabled={true}', injectedProps: { disabled: true } },
            ]
          },
          {
            name: "with icons",
            options: [
              { label: 'leftIcon="ArrowRight"', injectedProps: { leftIcon: "ArrowRight", children: "Continue" } },
              { label: 'rightIcon="ArrowRight"', injectedProps: { rightIcon: "ArrowRight", children: "Next" } },
              { label: 'leftIcon="Download"', injectedProps: { leftIcon: "Download", children: "Download" } },
              { label: 'variant="outline" + rightIcon', injectedProps: { variant: "outline", rightIcon: "ArrowRight", children: "Learn More" } },
            ]
          },
        ];
      } else if (folder === "Card") {
        props = ["title", "description", "icon", "tag", "variant", "onClick"];
        variations = [
          {
            name: "variant",
            options: ["default", "primary", "outline", "glass"]
          },
          {
            name: "states",
            options: [
              { label: "Default (Static)", injectedProps: {} },
              { label: "Clickable (with onClick)", injectedProps: { onClick: true } }
            ]
          },
          {
            name: "custom badges",
            options: [
              { label: 'tag="Active"', injectedProps: { tag: "Active", title: "Active Project", description: "This project is currently active and receiving updates." } },
              { label: 'tag="Beta"', injectedProps: { tag: "Beta", title: "New Feature", description: "Testing new capabilities under restricted rollout." } },
              { label: 'tag="Archived"', injectedProps: { tag: "Archived", title: "Legacy System", description: "Deprecated system maintained for historical read-only access." } }
            ]
          }
        ];
      } else if (folder === "AvatarCard") {
        props = ["name", "role", "followers", "following", "projects", "bio", "avatar", "accent", "bg", "radius"];
        variations = [
          {
            name: "roles",
            options: [
              { label: 'role="Frontend Developer"', injectedProps: { name: "Aryan Sharma", role: "Frontend Developer", followers: 2400, following: 180, projects: 34 } },
              { label: 'role="UI/UX Designer"', injectedProps: { name: "Neha Patel", role: "UI/UX Designer", followers: 4200, following: 320, projects: 58, accent: "#10b981" } },
              { label: 'role="Product Manager"', injectedProps: { name: "Raj Malhotra", role: "Product Manager", followers: 1500, following: 95, projects: 12, accent: "#f59e0b" } }
            ]
          },
          {
            name: "accents",
            options: [
              { label: "Indigo Accent (#6366f1)", injectedProps: { accent: "#6366f1" } },
              { label: "Emerald Accent (#10b981)", injectedProps: { accent: "#10b981" } },
              { label: "Amber Accent (#f59e0b)", injectedProps: { accent: "#f59e0b" } },
              { label: "Rose Accent (#ef4444)", injectedProps: { accent: "#ef4444" } }
            ]
          }
        ];
      } else if (folder === "BackgoundImageSlider") {
        props = ["images", "width", "height", "accent", "radius", "showDots", "autoPlay", "autoPlayInterval"];
        variations = [
          {
            name: "auto play & dot indicators",
            options: [
              { label: "showDots={true} (Default)", injectedProps: { showDots: true, autoPlay: false, height: "300px" } },
              { label: "showDots={false}", injectedProps: { showDots: false, autoPlay: false, height: "300px" } },
              { label: "autoPlay={true}", injectedProps: { autoPlay: true, autoPlayInterval: 2500, showDots: true, height: "300px" } }
            ]
          },
          {
            name: "radius styling",
            options: [
              { label: 'radius="0px" (Sharp)', injectedProps: { radius: "0px", height: "300px" } },
              { label: 'radius="16px" (Rounded)', injectedProps: { radius: "16px", height: "300px" } },
              { label: 'radius="32px" (Extra Rounded)', injectedProps: { radius: "32px", height: "300px" } }
            ]
          }
        ];
      }

      await Component.findOneAndUpdate(
        { name: folder, visibility: "public" },
        {
          name: folder,
          code: code,
          visibility: "public",
          props: props,
          variations: variations
        },
        { upsert: true, returnDocument: "after" }
      );
      console.log(`Seeded/Updated component: ${folder}`);
      seededCount++;
    }
  }

  console.log(`Finished seeding ${seededCount} components.`);
  process.exit(0);
};

seedDatabase();

