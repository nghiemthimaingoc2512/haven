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
          background: "#F7F2EA",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            fontSize: 20,
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
