import "./Background.css";

// A soft, blurred scene: blue sky, drifting white clouds and green grassy hills.
// Pure CSS, no image files.
export default function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg-art">
        <div className="bg-sun" />
        <div className="bg-cloud c1" />
        <div className="bg-cloud c2" />
        <div className="bg-cloud c3" />
        <div className="bg-cloud c4" />
        <div className="bg-hill h1" />
        <div className="bg-hill h2" />
        <div className="bg-hill h3" />
      </div>
      <div className="bg-veil" />
    </div>
  );
}
