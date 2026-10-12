import { useEffect, useRef } from "react";
import { profile, sections } from "../data/portfolio";
import "./PixelMenu.css";

// Slide-in menu: two coloured layers sweep in first, then the panel, then the items stagger up.
export default function PixelMenu({ open, onClose, onPickSection, onQuickRead, onTicket, crafted }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    closeRef.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  let n = 0;
  const step = () => ({ "--i": n++ });

  return (
    <div className={`sm${open ? " is-open" : ""}`} aria-hidden={!open}>
      <div className="sm-backdrop" onClick={onClose} />
      <div className="sm-layer sm-layer-1" />
      <div className="sm-layer sm-layer-2" />
      <nav className="sm-panel" aria-label="Menu" inert={!open ? "" : undefined}>
        <button ref={closeRef} className="sm-close" onClick={onClose} aria-label="Close menu">
          ×
        </button>
        <ul className="sm-list">
          {sections.map((section, index) => (
            <li key={section.id} style={step()}>
              <button className="sm-item" onClick={() => onPickSection(section.id)}>
                <span className="sm-num">{String(index + 1).padStart(2, "0")}</span>
                {section.title}
              </button>
            </li>
          ))}
          <li style={step()}>
            <button className="sm-item sm-item-alt" onClick={onQuickRead}>
              <span className="sm-num">+</span>
              Quick read
            </button>
          </li>
          <li style={step()}>
            <button className="sm-item sm-item-alt" onClick={onTicket} disabled={!crafted}>
              <span className="sm-num">@</span>
              Contact
              {crafted ? null : <small className="sm-lock">craft the ticket first</small>}
            </button>
          </li>
        </ul>
        <div className="sm-social" style={step()}>
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`}>Email</a>
          <a href={profile.resume} target="_blank" rel="noopener noreferrer">
            CV
          </a>
        </div>
      </nav>
    </div>
  );
}
