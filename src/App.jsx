import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { profile, sections } from "./data/portfolio";
import Background from "./components/Background";
import Carousel from "./components/Carousel";
import Workbench from "./components/Workbench";
import SectionModal from "./components/SectionModal";
import QuickRead from "./components/QuickRead";
import ContactTicket from "./components/ContactTicket";

const STORAGE_KEY = "jingyu-portfolio-viewed";

function loadViewed() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

export default function App() {
  const [index, setIndex] = useState(0);
  const [viewed, setViewed] = useState(loadViewed);
  const [openId, setOpenId] = useState(null);
  const [popId, setPopId] = useState(null);
  const [quickOpen, setQuickOpen] = useState(false);
  const [crafting, setCrafting] = useState(false);
  const [crafted, setCrafted] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);
  const craftTimer = useRef(null);
  const popTimer = useRef(null);

  const count = sections.filter((s) => viewed[s.id]).length;
  const ready = count === sections.length;
  const modalOpen = openId !== null || quickOpen || ticketOpen;
  const openData = sections.find((s) => s.id === openId) || null;

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(viewed));
    } catch (error) {
      // storage unavailable (private mode): progress just won't survive a refresh
    }
  }, [viewed]);

  useEffect(
    () => () => {
      clearTimeout(craftTimer.current);
      clearTimeout(popTimer.current);
    },
    []
  );

  // Expanding a card is what counts as "seen".
  const openSection = useCallback((id) => {
    setOpenId(id);
    setViewed((previous) => (previous[id] ? previous : { ...previous, [id]: true }));
  }, []);

  // The workbench slot pops once the card is closed, so the visitor actually sees it.
  const closeSection = useCallback(() => {
    setPopId(openId);
    clearTimeout(popTimer.current);
    popTimer.current = setTimeout(() => setPopId(null), 1400);
    setOpenId(null);
  }, [openId]);

  const craft = () => {
    if (crafting || crafted) return;
    setCrafting(true);
    craftTimer.current = setTimeout(() => {
      setCrafting(false);
      setCrafted(true);
      setTicketOpen(true);
    }, 1500);
  };

  return (
    <>
      <Background />
      <div className="app">
        <header className="topbar">
          <div className="brand">
            <span className="brand-name">{profile.name}</span>
            <span className="brand-role">{profile.role}</span>
          </div>
          <div className="topbar-actions">
            <span className="progress-pill" aria-live="polite">
              Workbench {count}/{sections.length}
            </span>
            <button className="pill-btn" onClick={() => setQuickOpen(true)}>
              Quick read
            </button>
          </div>
        </header>

        <main className="stage">
          <p className="stage-hint">
            {ready
              ? "All five items collected. Time to craft!"
              : "Open every card to collect all five items for the workbench."}
          </p>
          <Carousel
            items={sections}
            index={index}
            onChange={setIndex}
            viewed={viewed}
            onOpen={openSection}
            active={!modalOpen}
          />
        </main>

        <footer className="dock">
          <Workbench
            sections={sections}
            viewed={viewed}
            hintId={sections[index].id}
            popId={popId}
            ready={ready}
            crafting={crafting}
            crafted={crafted}
            onCraft={craft}
            onOpenTicket={() => setTicketOpen(true)}
          />
        </footer>
      </div>

      {openData ? <SectionModal section={openData} onClose={closeSection} /> : null}
      {quickOpen ? <QuickRead onClose={() => setQuickOpen(false)} /> : null}
      {ticketOpen ? <ContactTicket onClose={() => setTicketOpen(false)} /> : null}
    </>
  );
}
