import { useState } from "react";
import "./Background.css";

// A calm warm gradient by default. If a photo exists at /public/bg.jpg it fades in on top,
// like a visionOS environment, with a soft shade over it so the text stays readable.
export default function Background() {
  const [scene, setScene] = useState("loading");

  return (
    <div className="bg" aria-hidden="true">
      <div className="bg-glow g1" />
      <div className="bg-glow g2" />
      <div className="bg-glow g3" />
      <img
        className={`bg-scene${scene === "ready" ? " is-ready" : ""}`}
        src="/bg.jpg"
        alt=""
        decoding="async"
        onLoad={() => setScene("ready")}
        onError={() => setScene("none")}
      />
      <div className="bg-shade" />
    </div>
  );
}
