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
          background: "#F7F2EA",
        }}
      >
        <div
          style={{
            fontSize: 108,
            fontFamily: "serif",
            color: "#211D1A",
            fontWeight: 600,
          }}
        >
          Haven
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 34,
            fontFamily: "serif",
            color: "#3E5C58",
          }}
        >
          Somewhere to go.
        </div>
      </div>
    ),
    { ...size },
  );
}
