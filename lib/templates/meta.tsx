import { BRAND } from "@/lib/brand";
import type { PromoInput } from "@/lib/types";

/** Full-bleed artwork layout with a radial scrim for the headline. Used for Facebook + Instagram feed. */
export function MetaTemplate({ data, logoDataUri }: { data: PromoInput; logoDataUri: string }) {
  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        display: "flex",
        position: "relative",
        backgroundColor: BRAND.navyDeep,
        fontFamily: "Inter",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={data.imageDataUrl}
        width={1080}
        height={1080}
        alt=""
        style={{ position: "absolute", inset: 0, width: 1080, height: 1080, objectFit: "cover" }}
      />

      <div
        style={{
          position: "absolute",
          top: -120,
          left: -120,
          width: 820,
          height: 620,
          display: "flex",
          backgroundImage: "radial-gradient(circle, rgba(6,7,19,0.72) 0%, rgba(6,7,19,0) 70%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "9px 20px 9px 9px",
          borderRadius: 999,
          backgroundColor: "rgba(6,7,19,0.6)",
          border: `1px solid ${BRAND.line}`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoDataUri} width={36} height={36} alt="" style={{ borderRadius: 8 }} />
        <div style={{ display: "flex", fontSize: 17, fontWeight: 700, color: BRAND.ink, fontFamily: "Inter" }}>
          {BRAND.name}
        </div>
      </div>

      <div style={{ display: "flex", position: "absolute", top: 0, right: 0, width: 190, height: 190, overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: 40,
            right: -64,
            width: 260,
            transform: "rotate(45deg)",
            backgroundImage: `linear-gradient(135deg, ${BRAND.accent} 0%, ${BRAND.accentDeep} 100%)`,
            boxShadow: "0 10px 18px rgba(0,0,0,0.35)",
            padding: "10px 0",
          }}
        >
          <div style={{ display: "flex", fontSize: 30, fontWeight: 900, color: "#ffffff", lineHeight: 1, fontFamily: "Poppins" }}>
            {data.badge}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "absolute", top: 150, left: 40, right: 40 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            alignSelf: "flex-start",
            padding: "6px 16px",
            borderRadius: 999,
            backgroundColor: "rgba(74,168,232,0.16)",
            border: `1px solid ${BRAND.accentDeep}`,
          }}
        >
          <div style={{ display: "flex", width: 7, height: 7, borderRadius: 999, backgroundColor: BRAND.accent }} />
          <div style={{ display: "flex", fontSize: 15, fontWeight: 700, color: BRAND.accent, letterSpacing: 2, textTransform: "uppercase", fontFamily: "Inter" }}>
            Oferta por tiempo limitado
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ display: "flex", fontSize: 54, fontWeight: 900, color: BRAND.ink, lineHeight: 1, letterSpacing: -1.5, fontFamily: "Poppins" }}>
            {data.title}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", position: "absolute", left: 0, right: 0, bottom: 0 }}>
        <div style={{ display: "flex", height: 56, backgroundImage: `linear-gradient(180deg, rgba(6,7,19,0) 0%, ${BRAND.navyDeep} 100%)` }} />
        <div style={{ display: "flex", flexDirection: "column", backgroundColor: BRAND.navyDeep, padding: "0 48px 0" }}>
          <div style={{ display: "flex", paddingBottom: 24, borderBottom: `1px solid ${BRAND.line}` }}>
            {data.prices.map((row, i) => (
              <div key={row.label} style={{ display: "flex", flex: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 4 }}>
                  <div style={{ display: "flex", fontSize: 13, fontWeight: 700, color: BRAND.muted, letterSpacing: 1.2, fontFamily: "Inter" }}>
                    {row.label.toUpperCase()}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ display: "flex", fontSize: 19, color: BRAND.muted, textDecoration: "line-through", fontFamily: "Inter" }}>
                      {row.before}
                    </span>
                    <span style={{ display: "flex", fontSize: 32, fontWeight: 900, color: BRAND.ink, fontFamily: "Poppins" }}>{row.after}</span>
                  </div>
                </div>
                {i < data.prices.length - 1 && <div style={{ display: "flex", width: 1, backgroundColor: BRAND.line, marginRight: 32, marginLeft: 16 }} />}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "0 -48px",
              padding: "22px 48px",
              backgroundImage: `linear-gradient(120deg, ${BRAND.accent} 0%, ${BRAND.accentDeep} 100%)`,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={{ display: "flex", fontSize: 12, fontWeight: 700, color: "rgba(6,7,19,0.6)", letterSpacing: 1, fontFamily: "Inter" }}>
                VÁLIDO
              </div>
              <div style={{ display: "flex", fontSize: 20, fontWeight: 800, color: BRAND.navyDeep, fontFamily: "Poppins" }}>
                {data.validText}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", fontSize: 20, fontWeight: 800, color: BRAND.navyDeep, fontFamily: "Poppins" }}>
                {data.phone}
              </div>
              <div style={{ display: "flex", width: 0, height: 0, borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderLeft: `11px solid ${BRAND.navyDeep}` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
