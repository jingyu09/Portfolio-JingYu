import "./Background.css";

// A dark base with two slow, soft colour glows and a faint grid. Pure CSS, no images.
// The frosted-glass panels on top pick the colour up through their blur.
export default function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg-glow g1" />
      <div className="bg-glow g2" />
      <div className="bg-glow g3" />
      <div className="bg-grid" />
    </div>
  );
}
