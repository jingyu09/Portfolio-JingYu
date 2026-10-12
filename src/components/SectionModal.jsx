import { useEffect, useRef } from "react";
import PixelIcon from "./PixelIcon";
import Blocks from "./Blocks";
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
          <PixelIcon name={section.icon} size={44} />
          <h2>{section.title}</h2>
          <button ref={closeRef} className="icon-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <Blocks blocks={section.blocks} />
        <div className="sheet-foot">
          <button className="solid-btn" onClick={onClose}>
            Got it — back to the workbench
          </button>
        </div>
      </div>
    </div>
  );
}
