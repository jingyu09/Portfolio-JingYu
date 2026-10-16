import "./SectionList.css";

// Phone layout: all five sections at once as one frosted-glass list (like an index page).
export default function SectionList({ items, viewed, onOpen }) {
  return (
    <ul className="slist">
      {items.map((item, i) => {
        const seen = Boolean(viewed[item.id]);
        return (
          <li key={item.id}>
            <button className={`srow${seen ? " is-seen" : ""}`} onClick={() => onOpen(item.id)}>
              <span className="srow-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="srow-main">
                <span className="srow-title">{item.title}</span>
                <span className="srow-teaser">{item.teaser}</span>
              </span>
              <span className="srow-state" aria-label={seen ? "Collected" : "Open"}>
                {seen ? "✓" : "→"}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
