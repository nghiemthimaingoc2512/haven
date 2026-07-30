import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 8,
        }}
      >
        <div style={{ position: "relative", width: 20, height: 20, display: "flex" }}>
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
              top: -3,
              right: -5,
              width: 16,
              height: 16,
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
