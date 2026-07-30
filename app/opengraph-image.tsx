import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse 120% 80% at 50% 0%, #E9E2FF, #FCFBFF 60%)",
        }}
      >
        <div style={{ position: "relative", width: 140, height: 140, display: "flex" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #C8B7FF, #A49AF9)",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: -18,
              right: -28,
              width: 112,
              height: 112,
              borderRadius: "50%",
              background: "#FCFBFF",
              display: "flex",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 108,
            fontFamily: "serif",
            color: "#2B2640",
            fontWeight: 600,
          }}
        >
          Haven
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 34,
            fontFamily: "serif",
            color: "#8477F2",
          }}
        >
          A space that listens.
        </div>
      </div>
    ),
    { ...size },
  );
}
