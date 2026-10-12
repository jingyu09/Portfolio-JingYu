import "./LogoLoop.css";

// A slow, endless strip of tech logos. The list is rendered twice and the track slides by
// exactly half its width, so the loop is seamless. Pauses on hover; still under reduced motion.
export default function LogoLoop({ logos, speed = 38 }) {
  const row = (suffix, hidden) => (
    <ul className="loop-row" aria-hidden={hidden || undefined} key={suffix}>
      {logos.map((logo) => (
        <li className="loop-item" key={`${suffix}-${logo.name}`}>
          <svg viewBox="0 0 24 24" width="30" height="30" fill={`#${logo.icon.hex}`} aria-hidden="true">
            <path d={logo.icon.path} />
          </svg>
          <span>{logo.name}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <section className="loop" aria-label="Technologies I use">
      <div className="loop-track" style={{ "--loop-time": `${speed}s` }}>
        {row("a", false)}
        {row("b", true)}
      </div>
    </section>
  );
}
