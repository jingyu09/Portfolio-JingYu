import { useEffect, useRef } from "react";
import Blocks from "./Blocks";
import { profile, sections } from "../data/portfolio";
import "./SectionModal.css";
import "./QuickRead.css";

// A plain, scrollable version of everything, for visitors who just want the facts.
export default function QuickRead({ onClose }) {
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
      <div className="sheet quick" role="dialog" aria-modal="true" aria-label="Quick read">
        <header className="sheet-head">
          <h2>
            {profile.name}
            <span className="quick-role">{profile.role}</span>
          </h2>
          <button ref={closeRef} className="icon-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        {sections.map((section) => (
          <section key={section.id} className="quick-section">
            <h3>{section.title}</h3>
            <Blocks blocks={section.blocks} />
          </section>
        ))}

        <section className="quick-section">
          <h3>Contact</h3>
          <ul className="b-links">
            <li>
              Email: <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
            {profile.showPhone ? <li>Phone: {profile.phone}</li> : null}
            <li>
              GitHub:{" "}
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                {profile.github.replace("https://", "")}
              </a>
            </li>
            <li>
              LinkedIn:{" "}
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                {profile.linkedin.replace("https://www.", "")}
              </a>
            </li>
            <li>
              <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                Download my CV (PDF)
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
