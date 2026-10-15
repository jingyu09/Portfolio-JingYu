import "./Workbench.css";

// Five numbered slots light up as each card is opened; when all are lit they merge
// into the contact ticket.
export default function Workbench({
  sections,
  viewed,
  hintId,
  popId,
  ready,
  crafting,
  crafted,
  onCraft,
  onOpenTicket
}) {
  const count = sections.filter((s) => viewed[s.id]).length;

  let caption = `Collected ${count} of ${sections.length}`;
  if (ready) caption = "Everything collected";
  if (crafting) caption = "Assembling...";
  if (crafted) caption = "Ticket ready. Open it.";

  return (
    <div className="dock-inner">
      <div className={`workbench glass${ready ? " ready" : ""}${crafting ? " crafting" : ""}`}>
        <div className="wb-grid" role="img" aria-label={`Workbench: ${count} of ${sections.length} items collected`}>
          {sections.map((section, i) => {
            const lit = Boolean(viewed[section.id]);
            const classes = ["wb-cell"];
            if (lit) classes.push("lit");
            if (section.id === popId) classes.push("pop");
            if (section.id === hintId && !lit) classes.push("hint");
            return (
              <div key={section.id} className={classes.join(" ")} title={section.title}>
                {String(i + 1).padStart(2, "0")}
              </div>
            );
          })}
        </div>

        <div className="wb-arrow" aria-hidden="true">
          →
        </div>

        <button
          type="button"
          className={`wb-result${crafted ? " done" : ""}${crafting ? " forming" : ""}`}
          onClick={crafted ? onOpenTicket : undefined}
          disabled={!crafted}
          aria-label={crafted ? "Open the contact ticket" : "Contact ticket (locked)"}
        >
          <span className="wb-result-mark">↗</span>
          <span className="wb-result-label">Contact</span>
        </button>
      </div>

      {ready && !crafted && !crafting ? (
        <button className="craft-btn" onClick={onCraft}>
          Craft the ticket
        </button>
      ) : (
        <p className="dock-caption" aria-live="polite">
          {caption}
        </p>
      )}
    </div>
  );
}
