import PixelIcon from "./PixelIcon";
import "./Workbench.css";

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
  const cells = Array.from({ length: 9 }, (_, i) => sections.find((s) => s.slot === i) || null);
  const count = sections.filter((s) => viewed[s.id]).length;

  let caption = `Collected ${count} of ${sections.length}`;
  if (ready) caption = "Everything collected!";
  if (crafting) caption = "Crafting...";
  if (crafted) caption = "Ticket crafted. Click it to open.";

  return (
    <div className="dock-inner">
      {ready && !crafted && !crafting ? (
        <button className="craft-btn" onClick={onCraft}>
          Craft the ticket!
        </button>
      ) : null}

      <div className={`workbench${ready ? " ready" : ""}${crafting ? " crafting" : ""}`}>
        <div className="wb-grid" role="img" aria-label={`Workbench: ${count} of ${sections.length} items collected`}>
          {cells.map((section, i) => {
            const lit = Boolean(section && viewed[section.id]);
            const classes = ["wb-cell"];
            if (lit) classes.push("lit");
            if (section && section.id === popId) classes.push("pop");
            if (section && section.id === hintId && !lit) classes.push("hint");
            return (
              <div key={i} className={classes.join(" ")} title={section ? section.title : undefined}>
                {section ? <PixelIcon name={section.icon} size={34} dim={!lit} /> : null}
              </div>
            );
          })}
        </div>

        <div className="wb-arrow" aria-hidden="true">
          ➜
        </div>

        <button
          type="button"
          className={`wb-result${crafted ? " done" : ""}${crafting ? " forming" : ""}`}
          onClick={crafted ? onOpenTicket : undefined}
          disabled={!crafted}
          aria-label={crafted ? "Open the contact ticket" : "Crafting result (locked)"}
        >
          <PixelIcon name="ticket" size={46} dim={!crafted} />
        </button>
      </div>

      <p className="dock-caption" aria-live="polite">
        {caption}
      </p>
    </div>
  );
}
