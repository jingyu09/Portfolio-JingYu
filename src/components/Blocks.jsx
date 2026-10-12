import "./Blocks.css";

function Block({ block }) {
  switch (block.type) {
    case "text":
      return <p className="b-text">{block.text}</p>;
    case "list":
      return (
        <ul className="b-list">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "facts":
      return (
        <dl className="b-facts">
          {block.items.map((fact) => (
            <div className="fact" key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      );
    case "tags":
      return (
        <div className="b-tags">
          {block.groups.map((group) => (
            <div className="tag-group" key={group.title}>
              <h4>{group.title}</h4>
              <div className="tag-row">
                {group.items.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    case "timeline":
      return (
        <div className="b-timeline">
          {block.items.map((item, i) => (
            <article className="t-item" key={i}>
              <header>
                <h4>{item.title}</h4>
                <span className="t-period">{item.period}</span>
              </header>
              {item.org ? <p className="t-org">{item.org}</p> : null}
              {item.bullets ? (
                <ul className="b-list">
                  {item.bullets.map((bullet, j) => (
                    <li key={j}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      );
    case "links":
      return (
        <ul className="b-links">
          {block.items.map((link) => (
            <li key={link.url}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
              {link.desc ? <span> — {link.desc}</span> : null}
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

export default function Blocks({ blocks }) {
  return (
    <div className="blocks">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
