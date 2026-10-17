import { useRef, useState } from "react";
import "./StackDeck.css";

const wrap = (value, n) => ((value % n) + n) % n;

// Phone layout: the cards are a stacked deck, like flashcards. Swipe the top card away (or use the
// arrows) to bring up the next one. Tap the top card to open it.
export default function StackDeck({ items, index, onChange, viewed, onOpen }) {
  const n = items.length;
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [fly, setFly] = useState(0); // -1 / 1 while the top card is flying off to a side
  const g = useRef({ x0: 0, dx: 0, moved: false, onTop: false, lastX: 0, lastT: 0, v: 0 }).current;
  const busy = useRef(false);

  const next = (side) => {
    if (busy.current) return;
    busy.current = true;
    setFly(side);
    setTimeout(() => {
      onChange(wrap(index + 1, n));
      setFly(0);
      setDx(0);
      busy.current = false;
    }, 240);
  };

  const previous = () => {
    if (busy.current) return;
    setDx(0);
    onChange(wrap(index - 1, n));
  };

  const onPointerDown = (event) => {
    if (busy.current || event.button > 0) return;
    g.x0 = event.clientX;
    g.dx = 0;
    g.moved = false;
    g.lastX = event.clientX;
    g.lastT = performance.now();
    g.v = 0;
    g.onTop = Boolean(event.target.closest && event.target.closest(".deck-card.is-top"));
    setDragging(true);

    const move = (e) => {
      g.dx = e.clientX - g.x0;
      if (Math.abs(g.dx) > 6) g.moved = true;
      const now = performance.now();
      const dt = now - g.lastT;
      if (dt > 0) g.v = g.v * 0.6 + ((e.clientX - g.lastX) / dt) * 0.4;
      g.lastX = e.clientX;
      g.lastT = now;
      setDx(g.dx);
    };
    const up = (e) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      setDragging(false);
      if (!g.moved) {
        setDx(0);
        if (g.onTop && e.type === "pointerup") onOpen(items[index].id);
        return;
      }
      if (Math.abs(g.dx) > 70 || (Math.abs(g.v) > 0.45 && Math.abs(g.dx) > 24)) {
        next(g.dx >= 0 ? 1 : -1);
      } else {
        setDx(0);
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  const progress = fly ? 1 : Math.min(1, Math.abs(dx) / 160);
  const width = typeof window === "undefined" ? 390 : window.innerWidth;

  return (
    <div className="deckwrap">
      <div className="deck" onPointerDown={onPointerDown}>
        {items.map((item, i) => {
          const k = wrap(i - index, n);
          const seen = Boolean(viewed[item.id]);
          let style;
          if (k === 0) {
            const x = fly ? fly * width * 0.95 : dx;
            const rot = fly ? fly * 14 : dx * 0.05;
            style = {
              transform: `translateX(${x}px) rotate(${rot}deg)`,
              opacity: fly ? 0 : 1,
              transition: dragging && !fly ? "none" : "transform 0.26s ease-in, opacity 0.26s ease-in"
            };
          } else {
            const eff = Math.max(0, k - progress);
            const opacity = eff <= 2 ? 1 - eff * 0.22 : Math.max(0, (3 - eff) * 0.56);
            style = {
              transform: `translateY(${eff * 14}px) scale(${1 - eff * 0.05})`,
              opacity,
              transition: dragging ? "none" : "transform 0.38s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.38s ease"
            };
          }
          style.zIndex = n - k;
          return (
            <div
              key={item.id}
              className={`deck-card${k === 0 ? " is-top" : ""}${k <= 1 ? " has-blur" : ""}${seen ? " is-seen" : ""}`}
              style={style}
              aria-hidden={k !== 0}
            >
              <div className="deck-top">
                <span className="deck-num">{String(i + 1).padStart(2, "0")}</span>
                <span className={`deck-chip${seen ? " is-seen" : ""}`}>{seen ? "Collected" : "New"}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.teaser}</p>
              <div className="deck-foot">
                <span>Tap to open</span>
                <span aria-hidden="true">→</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="deck-controls">
        <button className="deck-btn" onClick={previous} aria-label="Previous card">
          ←
        </button>
        <span className="deck-count">
          {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>
        <button className="deck-btn" onClick={() => next(-1)} aria-label="Next card">
          →
        </button>
      </div>
    </div>
  );
}
