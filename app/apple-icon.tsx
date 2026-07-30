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
          background: "#F7F2EA",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontFamily: "serif",
            color: "#B5652F",
            fontWeight: 600,
          }}
        >
          H
        </div>
      </div>
    ),
    { ...size },
  );
}
