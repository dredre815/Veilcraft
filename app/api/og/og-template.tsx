interface OgTemplateProps {
  title: string;
  summary: string;
  themes: readonly string[];
  spreadLabel: string;
  spreadTagline: string;
  seed: string | null;
  statusNote: string | null;
}

export function renderOgImage({
  title,
  summary,
  themes,
  spreadLabel,
  spreadTagline,
  seed,
  statusNote,
}: OgTemplateProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "56px 72px",
        fontFamily: "'Plus Jakarta Sans', 'Inter', 'Noto Sans SC', sans-serif",
        color: "#EAECEF",
        backgroundColor: "#05060B",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 160% at 20% 20%, rgba(124,92,255,0.35) 0%, rgba(12,21,45,0) 55%), radial-gradient(80% 120% at 85% 15%, rgba(34,211,238,0.28) 0%, rgba(11,13,16,0) 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(145deg, rgba(10,16,32,0.3) 0%, rgba(5,6,11,0.88) 60%, rgba(5,6,11,1) 100%)",
        }}
      />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{ fontSize: 28, letterSpacing: 8, textTransform: "uppercase", color: "#a8b5ff" }}
          >
            Veilcraft｜幕术
          </div>
          <div
            style={{
              fontSize: 20,
              color: "rgba(234,236,239,0.72)",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <span>{spreadLabel}</span>
            <span style={{ fontSize: 16, color: "rgba(234,236,239,0.54)" }}>{spreadTagline}</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 52, fontWeight: 600, lineHeight: 1.2 }}>{title}</div>
          <div style={{ fontSize: 24, lineHeight: 1.4, color: "rgba(234,236,239,0.78)" }}>
            {summary}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 8 }}>
          {themes.map((theme) => (
            <div
              key={theme}
              style={{
                padding: "8px 18px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.24)",
                background: "rgba(124,92,255,0.18)",
                fontSize: 20,
                fontWeight: 500,
              }}
            >
              {theme}
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "relative", marginTop: "auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 40,
            borderTop: "1px solid rgba(255,255,255,0.16)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 22, color: "rgba(234,236,239,0.72)" }}>证据驱动的塔罗解读</div>
            <div style={{ fontSize: 18, color: "rgba(234,236,239,0.55)" }}>
              {statusNote ?? "点击分享链接即可复盘完整阅读"}
            </div>
          </div>
          {seed ? (
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                padding: "10px 18px",
                borderRadius: 999,
                border: "1px solid rgba(146,148,255,0.38)",
                background: "rgba(146,148,255,0.16)",
                letterSpacing: 2,
              }}
            >
              SEED · {seed}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
