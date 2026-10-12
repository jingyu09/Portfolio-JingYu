import { useEffect, useRef } from "react";
import PixelIcon from "./PixelIcon";
import "./Carousel.css";

export default function Carousel({ items, index, onChange, viewed, onOpen, active }) {
  const n = items.length;
  const startX = useRef(null);
  const swiped = useRef(false);

  const go = (step) => onChange((index + step + n) % n);

  useEffect(() => {
    if (!active) return undefined;
    const onKey = (event) => {
      if (event.key === "ArrowLeft") onChange((index - 1 + n) % n);
      if (event.key === "ArrowRight") onChange((index + 1) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, index, n, onChange]);

  const offsetOf = (i) => {
    let d = i - index;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d;
  };

  const onPointerDown = (event) => {
    startX.current = event.clientX;
    swiped.current = false;
  };
  const onPointerUp = (event) => {
    if (startX.current === null) return;
    const dx = event.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 50) {
      swiped.current = true;
      go(dx < 0 ? 1 : -1);
    }
  };
  const onPointerCancel = () => {
    startX.current = null;
  };

  const activate = (i) => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    if (i === index) onOpen(items[i].id);
    else onChange(i);
  };

  return (
    <div className="carousel" aria-roledescription="carousel" aria-label="Portfolio sections">
      <div
        className="carousel-track"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        {items.map((item, i) => {
          const off = offsetOf(i);
          const abs = Math.abs(off);
          const isCenter = off === 0;
          const seen = Boolean(viewed[item.id]);
          return (
            <div
              key={item.id}
              className={`card${isCenter ? " is-center" : ""}${seen ? " is-seen" : ""}`}
              style={{
                "--off": off,
                "--abs": abs,
                zIndex: 10 - abs,
                opacity: abs > 2 ? 0 : 1 - abs * 0.2,
                filter: `blur(${abs * 1.2}px)`,
                pointerEvents: abs > 2 ? "none" : "auto"
              }}
              role="button"
              tabIndex={isCenter ? 0 : -1}
              aria-label={isCenter ? `Open ${item.title}` : `Show ${item.title}`}
              onClick={() => activate(i)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  activate(i);
                }
              }}
            >
              <div className="card-icon">
                <PixelIcon name={item.icon} size={64} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.teaser}</p>
              <div className="card-foot">
                <span className={`chip${seen ? " chip-seen" : ""}`}>{seen ? "Collected ✓" : "New"}</span>
                <span className="cta">{isCenter ? "Open ▸" : "View"}</span>
              </div>
            </div>
          );
        })}
      </div>

      <button className="nav prev" onClick={() => go(-1)} aria-label="Previous card">
        ‹
      </button>
      <button className="nav next" onClick={() => go(1)} aria-label="Next card">
        ›
      </button>

      <div className="dots" role="tablist" aria-label="Choose a card">
        {items.map((item, i) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={i === index}
            aria-label={item.title}
            className={`dot${i === index ? " on" : ""}${viewed[item.id] ? " seen" : ""}`}
            onClick={() => onChange(i)}
          />
        ))}
      </div>
    </div>
  );
}
