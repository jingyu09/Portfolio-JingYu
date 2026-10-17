import { useEffect, useRef } from "react";
import Blocks from "./Blocks";
import LogoLoop from "./LogoLoop";
import { logos } from "../data/logos";
import "./FlowPage.css";

// Phone layout: no cards. Everything is one long scrolling page, section after section, and at the
// very bottom the ticket is unlocked. A section counts as "seen" once it has scrolled into view.
export default function FlowPage({ sections, viewed, onSeen, crafting, crafted, onCraft, onOpenTicket }) {
  const refs = useRef([]);

  // A section is "seen" once its top has come up into the screen. This uses the scroll position
  // (not IntersectionObserver) so a fast scroll that skips past sections still counts them.
  useEffect(() => {
    const nodes = refs.current.filter(Boolean);
    let raf = 0;
    const check = () => {
      raf = 0;
      nodes.forEach((node) => {
        if (node.getBoundingClientRect().top < window.innerHeight * 0.88) {
          node.classList.add("in");
          if (node.dataset.id) onSeen(node.dataset.id);
        }
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    check();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, [onSeen]);

  const count = sections.filter((s) => viewed[s.id]).length;

  return (
    <div className="flow">
      {sections.map((section, i) => (
        <section
          key={section.id}
          id={`sec-${section.id}`}
          data-id={section.id}
          className="flow-section"
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <header className="flow-head">
            <span className="flow-num">
              {String(i + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")}
            </span>
            <h2>{section.title}</h2>
          </header>
          <Blocks blocks={section.blocks} />
        </section>
      ))}

      <div className="flow-logos">
        <LogoLoop logos={logos} />
      </div>

      <section
        id="flow-ticket"
        className={`flow-section flow-ticket${crafting ? " crafting" : ""}${crafted ? " crafted" : ""}`}
        ref={(el) => {
          refs.current[sections.length] = el;
        }}
      >
        <p className="flow-ticket-kicker">The end of the page</p>
        <h2>Let&apos;s talk.</h2>
        <div className="flow-cells" aria-label={`${count} of ${sections.length} sections read`}>
          {sections.map((section, i) => (
            <span key={section.id} className={`flow-cell${viewed[section.id] ? " lit" : ""}`}>
              {String(i + 1).padStart(2, "0")}
            </span>
          ))}
        </div>
        <button className="flow-unlock" onClick={crafted ? onOpenTicket : onCraft} disabled={crafting}>
          {crafting ? "Assembling…" : crafted ? "Open the ticket" : "Unlock the ticket"}
        </button>
        <p className="flow-ticket-note">The ticket has my contact details and a short message form.</p>
      </section>
    </div>
  );
}
