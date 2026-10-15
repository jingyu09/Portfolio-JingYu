import { useEffect, useRef } from "react";
import Blocks from "./Blocks";
import { sections } from "../data/portfolio";
import "./SectionModal.css";

export default function SectionModal({ section, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (closeRef.current) closeRef.current.focus();
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="sheet" role="dialog" aria-modal="true" aria-label={section.title}>
        <header className="sheet-head">
          <span className="sheet-num">{String(sections.findIndex((x) => x.id === section.id) + 1).padStart(2, "0")}</span>
          <h2>{section.title}</h2>
          <button ref={closeRef} className="icon-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <Blocks blocks={section.blocks} />
        <div className="sheet-foot">
          <button className="solid-btn" onClick={onClose}>
            Back to the workbench
          </button>
        </div>
      </div>
    </div>
  );
}
