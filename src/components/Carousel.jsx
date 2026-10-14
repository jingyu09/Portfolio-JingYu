import { useEffect, useLayoutEffect, useRef } from "react";
import PixelIcon from "./PixelIcon";
import "./Carousel.css";

const wrap = (value, n) => ((value % n) + n) % n;

// A draggable "disc" of cards. Drag or swipe with mouse or finger: the cards follow your pointer,
// keep gliding with inertia after release, then ease to the nearest card. Arrows, dots and the
// keyboard use the same glide. Positions are written straight to the DOM every frame (no React
// re-render per frame) so it stays smooth on phones.
export default function Carousel({ items, index, onChange, viewed, onOpen, openId, active }) {
  const n = items.length;
  const cardRefs = useRef([]);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const s = useRef({
    pos: index,
    target: index,
    dragging: false,
    moved: false,
    startX: 0,
    startPos: 0,
    lastX: 0,
    lastT: 0,
    vel: 0,
    raf: 0,
    lastFrame: 0,
    lastIdx: index
  }).current;

  const cardWidth = () => (cardRefs.current[0] ? cardRefs.current[0].offsetWidth : 340);

  const paint = () => {
    const cardW = cardWidth();
    const radius = cardW * 1.05;
    const theta = 0.52;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const d = wrap(i - s.pos + n / 2, n) - n / 2;
      const abs = Math.abs(d);
      const a = Math.max(-1.6, Math.min(1.6, d * theta));
      const x = Math.sin(a) * radius;
      const z = (Math.cos(a) - 1) * radius * 0.9;
      const rot = -a * 36;
      let opacity;
      if (abs <= 1) opacity = 1 - abs * 0.2;
      else if (abs <= 2) opacity = 0.8 - (abs - 1) * 0.35;
      else opacity = Math.max(0, 0.45 - (abs - 2) * 1.1);
      el.style.transform = `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${rot}deg) scale(${
        1 - Math.min(abs, 3) * 0.07
      })`;
      el.style.opacity = String(opacity);
      el.style.zIndex = String(100 - Math.round(abs * 10));
      el.style.pointerEvents = abs > 2.4 ? "none" : "auto";
      el.classList.toggle("is-center", abs < 0.5);
    });
  };

  const sync = () => {
    const idx = wrap(Math.round(s.pos), n);
    if (idx !== s.lastIdx) {
      s.lastIdx = idx;
      onChangeRef.current(idx);
    }
  };

  const tick = (now) => {
    const dt = Math.min(0.05, (now - s.lastFrame) / 1000 || 0.016);
    s.lastFrame = now;
    if (!s.dragging) {
      s.pos += (s.target - s.pos) * (1 - Math.exp(-dt * 9));
      if (Math.abs(s.target - s.pos) < 0.0006) s.pos = s.target;
    }
    paint();
    sync();
    if (s.dragging || s.pos !== s.target) {
      s.raf = requestAnimationFrame(tick);
    } else {
      s.raf = 0;
      const shift = Math.floor(s.pos / n) * n; // keep the numbers small
      s.pos -= shift;
      s.target -= shift;
    }
  };

  const kick = () => {
    if (!s.raf) {
      s.lastFrame = performance.now();
      s.raf = requestAnimationFrame(tick);
    }
  };

  useLayoutEffect(() => {
    paint();
    const onResize = () => paint();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(s.raf);
      s.raf = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Arrows, dots and keys change `index`; glide there the short way round.
  useEffect(() => {
    if (s.dragging) return;
    if (wrap(Math.round(s.target), n) === index) return;
    s.target += wrap(index - s.target + n / 2, n) - n / 2;
    kick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    if (!active) return undefined;
    const onKey = (event) => {
      if (event.key === "ArrowLeft") onChange(wrap(index - 1, n));
      if (event.key === "ArrowRight") onChange(wrap(index + 1, n));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, index, n, onChange]);

  const spacing = () => cardWidth() * 0.55;

  const onPointerDown = (event) => {
    if (event.button > 0) return;
    s.dragging = true;
    s.moved = false;
    s.startX = event.clientX;
    s.startPos = s.pos;
    s.lastX = event.clientX;
    s.lastT = performance.now();
    s.vel = 0;
    s.target = s.pos;
    kick();

    const move = (e) => {
      const dx = e.clientX - s.startX;
      if (Math.abs(dx) > 6) s.moved = true;
      s.pos = s.startPos - dx / spacing();
      const now = performance.now();
      const dt = now - s.lastT;
      if (dt > 0) s.vel = s.vel * 0.7 + ((e.clientX - s.lastX) / dt) * 0.3;
      s.lastX = e.clientX;
      s.lastT = now;
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      if (!s.dragging) return;
      s.dragging = false;
      const perSecond = (-s.vel / spacing()) * 1000;
      const projected = s.pos + perSecond * 0.22;
      s.target = Math.round(Math.max(s.pos - 2, Math.min(s.pos + 2, projected)));
      kick();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  const activate = (i) => {
    if (s.moved) {
      s.moved = false;
      return;
    }
    if (i === index) onOpen(items[i].id);
    else onChange(i);
  };

  return (
    <div className="carousel" aria-roledescription="carousel" aria-label="Portfolio sections">
      <div className="carousel-track" onPointerDown={onPointerDown}>
        {items.map((item, i) => {
          const isCenter = i === index;
          const seen = Boolean(viewed[item.id]);
          return (
            <div
              key={item.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`card${seen ? " is-seen" : ""}${openId === item.id ? " is-open" : ""}`}
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

      <button className="nav prev" onClick={() => onChange(wrap(index - 1, n))} aria-label="Previous card">
        ‹
      </button>
      <button className="nav next" onClick={() => onChange(wrap(index + 1, n))} aria-label="Next card">
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
