import { useCallback, useEffect, useRef, useState } from "react";
import TechText from "./TechText";
import { profile } from "../data/portfolio";
import "./IntroSplash.css";

// Opening animation: the name and role decode on screen, then the splash fades away.
// Click, tap or press any key to skip.
export default function IntroSplash({ onFinish }) {
  const [leaving, setLeaving] = useState(false);
  const [roleDone, setRoleDone] = useState(false);
  const finished = useRef(false);

  const leave = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setLeaving(true);
    setTimeout(onFinish, 500);
  }, [onFinish]);

  useEffect(() => {
    window.addEventListener("keydown", leave);
    return () => window.removeEventListener("keydown", leave);
  }, [leave]);

  useEffect(() => {
    if (!roleDone) return undefined;
    const t = setTimeout(leave, 800);
    return () => clearTimeout(t);
  }, [roleDone, leave]);

  return (
    <div className={`intro${leaving ? " is-leaving" : ""}`} onClick={leave} role="presentation">
      <div className="intro-inner">
        <p className="intro-kicker">hello, world</p>
        <h1 className="intro-name">
          <TechText text={profile.name.toUpperCase()} duration={1100} delay={200} />
        </h1>
        <p className="intro-role">
          <TechText text={profile.role.toUpperCase()} duration={900} delay={1200} onDone={() => setRoleDone(true)} />
        </p>
        <p className="intro-skip">click anywhere to skip</p>
      </div>
    </div>
  );
}
