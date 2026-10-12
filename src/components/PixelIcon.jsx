import { useMemo } from "react";
import { ICONS, PALETTE } from "./icons";

export default function PixelIcon({ name, size = 48, dim = false, className = "" }) {
  const rects = useMemo(() => {
    const rows = ICONS[name] || [];
    const list = [];
    rows.forEach((row, y) => {
      Array.from(row).forEach((ch, x) => {
        if (ch !== "." && PALETTE[ch]) {
          list.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={PALETTE[ch]} />);
        }
      });
    });
    return list;
  }, [name]);

  const rows = ICONS[name] || [];
  const width = rows[0] ? rows[0].length : 12;
  const height = rows.length || 12;

  return (
    <svg
      className={`pixel-icon${dim ? " is-dim" : ""}${className ? ` ${className}` : ""}`}
      viewBox={`0 0 ${width} ${height}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {rects}
    </svg>
  );
}
