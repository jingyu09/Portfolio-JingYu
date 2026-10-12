import { useEffect, useRef, useState } from "react";

const GLYPHS = "01{}[]<>/;=+*#&%$";

function scrambled(text, resolved) {
  return Array.from(text)
    .map((ch, i) => {
      if (ch === " " || i < resolved) return ch;
      return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    })
    .join("");
}

// Text that "decodes" from random code glyphs into the real letters, left to right.
export default function TechText({ text, delay = 0, duration = 1000, onDone, className = "" }) {
  const reduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [shown, setShown] = useState(reduced ? text : "");
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (reduced) {
      if (doneRef.current) doneRef.current();
      return undefined;
    }
    let raf = 0;
    let startTimer = 0;
    let last = 0;
    const length = text.length;
    const begin = () => {
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const resolved = Math.floor(progress * length);
        if (now - last > 45 || progress === 1) {
          last = now;
          setShown(progress === 1 ? text : scrambled(text, resolved));
        }
        if (progress < 1) raf = requestAnimationFrame(tick);
        else if (doneRef.current) doneRef.current();
      };
      raf = requestAnimationFrame(tick);
    };
    startTimer = setTimeout(begin, delay);
    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(raf);
    };
  }, [text, delay, duration, reduced]);

  return (
    <span className={`tech-text ${className}`} aria-label={text}>
      <span aria-hidden="true">{shown || "\u00A0"}</span>
    </span>
  );
}
