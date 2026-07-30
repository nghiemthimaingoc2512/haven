import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FCFBFF",
        }}
      >
        <div style={{ position: "relative", width: 104, height: 104, display: "flex" }}>
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
              top: -14,
              right: -22,
              width: 84,
              height: 84,
              borderRadius: "50%",
              background: "#FCFBFF",
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
