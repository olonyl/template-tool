import type { ChikiTechInput } from "@/lib/types";

const INK = "#f5f8ff";
const ACCENT = "#ff8a3d";
const ACCENT_DEEP = "#c75a12";

// Plain inline SVGs — lucide-react components are "use client" and can't render
// inside a server route used by next/og's ImageResponse.
function CpuIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="6" y="6" width="12" height="12" rx="1.5" stroke={color} strokeWidth="2" />
      <rect x="9" y="9" width="6" height="6" rx="1" stroke={color} strokeWidth="2" />
      <line x1="12" y1="1" x2="12" y2="4" stroke={color} strokeWidth="2" />
      <line x1="12" y1="20" x2="12" y2="23" stroke={color} strokeWidth="2" />
      <line x1="1" y1="12" x2="4" y2="12" stroke={color} strokeWidth="2" />
      <line x1="20" y1="12" x2="23" y2="12" stroke={color} strokeWidth="2" />
    </svg>
  );
}

function GiftIcon({ color }: { color: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="9" width="18" height="11" rx="1" stroke={color} strokeWidth="2" />
      <line x1="12" y1="9" x2="12" y2="20" stroke={color} strokeWidth="2" />
      <rect x="2" y="6" width="20" height="4" rx="1" stroke={color} strokeWidth="2" />
      <path d="M12 6c0-2 -2-4 -4-4s-2 4 4 4" stroke={color} strokeWidth="2" />
      <path d="M12 6c0-2 2-4 4-4s2 4 -4 4" stroke={color} strokeWidth="2" />
    </svg>
  );
}

function PhoneIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 5c0 8 7 15 15 15l2-4-5-2-2 2c-3-1-5-3-6-6l2-2-2-5H4Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Product-catalog layout: fixed tech background, floating product cutout, specs list, price badge. */
export function ChikiTechTemplate({
  data,
  logoDataUri,
  bgDataUri,
}: {
  data: ChikiTechInput;
  logoDataUri: string;
  bgDataUri: string;
}) {
  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        display: "flex",
        position: "relative",
        backgroundColor: "#061a3a",
        fontFamily: "Inter",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={bgDataUri} width={1080} height={1080} alt="" style={{ position: "absolute", inset: 0, width: 1080, height: 1080, objectFit: "cover" }} />

      {/* Brand chip */}
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 36,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "8px 18px 8px 8px",
          borderRadius: 999,
          backgroundColor: "rgba(6,7,19,0.55)",
          border: "1px solid rgba(255,255,255,0.18)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoDataUri} width={44} height={44} alt="" style={{ borderRadius: 999 }} />
        <div style={{ display: "flex", fontSize: 18, fontWeight: 800, color: INK, letterSpacing: 0.5 }}>CHIKI TECH</div>
      </div>

      {/* Model plaque — bordered rectangle, like a product nameplate */}
      <div
        style={{
          position: "absolute",
          top: 44,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "14px 36px",
            borderRadius: 10,
            backgroundColor: "rgba(6,20,45,0.8)",
            border: "2px solid rgba(255,255,255,0.55)",
            boxShadow: "0 10px 20px rgba(0,0,0,0.35)",
          }}
        >
          <div style={{ display: "flex", fontSize: 24, fontWeight: 900, color: INK, letterSpacing: 0.5 }}>{data.model}</div>
        </div>
      </div>

      {/* Gift badge — icon in circle, caption below (not crammed inside) */}
      {data.giftBadge && (
        <div
          style={{
            position: "absolute",
            top: 118,
            right: 56,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            width: 150,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 92,
              height: 92,
              borderRadius: 999,
              backgroundImage: `linear-gradient(145deg, #ffd3a8 0%, ${ACCENT} 50%, ${ACCENT_DEEP} 100%)`,
              boxShadow: "0 14px 24px rgba(0,0,0,0.4)",
              border: "3px solid rgba(255,255,255,0.5)",
            }}
          >
            <GiftIcon color="#2b1300" />
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 14,
              fontWeight: 800,
              color: ACCENT,
              letterSpacing: 0.3,
              textAlign: "center",
              lineHeight: 1.25,
              textShadow: "0 2px 6px rgba(0,0,0,0.6)",
            }}
          >
            {data.giftBadge}
          </div>
        </div>
      )}

      {/* Specs column — boxed icon tiles, matching the reference's bordered spec cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "absolute", top: 240, left: 44 }}>
        {data.specs.map((spec) => (
          <div
            key={spec}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 16px 10px 10px",
              borderRadius: 12,
              backgroundColor: "rgba(6,20,45,0.55)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 8,
                border: `1.5px solid ${ACCENT}`,
              }}
            >
              <CpuIcon color={ACCENT} />
            </div>
            <div style={{ display: "flex", fontSize: 16, fontWeight: 700, color: INK }}>{spec}</div>
          </div>
        ))}
      </div>

      {/* Product cutout */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={data.imageDataUrl}
        alt=""
        style={{
          position: "absolute",
          left: 240,
          right: 240,
          top: 300,
          bottom: 260,
          width: 600,
          height: 520,
          objectFit: "contain",
        }}
      />

      {/* Curved arrow pointing from the price badge toward the product */}
      <svg
        width="140"
        height="100"
        viewBox="0 0 140 100"
        style={{ position: "absolute", right: 150, bottom: 200, display: "flex" }}
      >
        <path
          d="M 120 20 C 60 10, 20 50, 30 85"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path d="M 18 78 L 30 85 L 38 72" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* Price badge */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          right: 56,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: 150,
          height: 150,
          borderRadius: 999,
          backgroundImage: "linear-gradient(145deg, #bfe3ff 0%, #4aa8e8 45%, #15649f 100%)",
          boxShadow: "0 18px 30px rgba(0,0,0,0.4)",
          border: "3px solid rgba(255,255,255,0.5)",
        }}
      >
        <div style={{ display: "flex", fontSize: 13, fontWeight: 700, color: "#eaf6ff" }}>PRECIO</div>
        <div style={{ display: "flex", fontSize: 28, fontWeight: 900, color: "#ffffff" }}>{data.price}</div>
      </div>

      {/* Contact — compact corner chip, not a full-width bar */}
      <div
        style={{
          position: "absolute",
          left: 44,
          bottom: 40,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 18px",
          borderRadius: 999,
          backgroundColor: "rgba(6,20,45,0.65)",
          border: "1px solid rgba(255,255,255,0.25)",
        }}
      >
        <PhoneIcon color={ACCENT} />
        <div style={{ display: "flex", fontSize: 20, fontWeight: 800, color: INK }}>{data.phone}</div>
      </div>
    </div>
  );
}

