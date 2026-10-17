import { useEffect, useLayoutEffect, useRef, useState } from "react";
import TearTicket from "./reactbits/TearTicket";
import PeekRating from "./reactbits/PeekRating";
import { profile } from "../data/portfolio";
import { sendMessage } from "../lib/sendMessage";
import "./ContactTicket.css";

const DEFAULT_MESSAGE = "Hi Jing Yu! I visited your portfolio and wanted to say hello.";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATING_LABELS = ["Needs work", "Okay", "Good", "Great", "Excellent"];

export default function ContactTicket({ onClose }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [trap, setTrap] = useState("");
  const [torn, setTorn] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [hint, setHint] = useState("");
  const [errorText, setErrorText] = useState("");
  const [demo, setDemo] = useState(false);
  const [copied, setCopied] = useState(false);
  const closeRef = useRef(null);
  const wrapRef = useRef(null);
  const copyTimer = useRef(null);

  const emailValid = EMAIL_PATTERN.test(email.trim());

  useEffect(() => {
    if (closeRef.current) closeRef.current.focus();
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  // Scale the whole ticket to fit the screen, so it is never cropped or off-centre.
  useLayoutEffect(() => {
    const fit = () => {
      const el = wrapRef.current;
      if (!el) return;
      const vv = window.visualViewport;
      const vw = vv ? vv.width : window.innerWidth;
      const vh = vv ? vv.height : window.innerHeight;
      const f = Math.min(0.96, (vw - 16) / el.offsetWidth, (vh - 16) / el.offsetHeight);
      el.style.setProperty("--fit", String(Math.max(0.4, f)));
    };
    fit();
    window.addEventListener("resize", fit);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", fit);
    return () => {
      window.removeEventListener("resize", fit);
      if (window.visualViewport) window.visualViewport.removeEventListener("resize", fit);
    };
  }, []);

  // Tearing the stub (or pressing the fallback button) sends the message.
  const submit = async () => {
    if (status === "sending") return;
    setTorn(true);
    setErrorText("");
    if (trap) {
      // The hidden field is only ever filled by bots: pretend it worked, send nothing.
      setStatus("sent");
      return;
    }
    setStatus("sending");
    try {
      const result = await sendMessage({
        email: email.trim(),
        message: message.trim() || DEFAULT_MESSAGE,
        rating
      });
      setDemo(Boolean(result.demo));
      setStatus("sent");
    } catch (error) {
      setErrorText(error.message);
      setStatus("error");
      setTorn(false); // put the stub back so they can try again
    }
  };

  const fallbackSend = () => {
    if (!emailValid) {
      setHint("Enter a valid email first.");
      return;
    }
    submit();
  };

  const writeAnother = () => {
    setTorn(false);
    setStatus("idle");
    setMessage("");
    setRating(0);
    setHint("");
  };

  // Only the dashed handle may start a tear, and only once the email is valid.
  const onStubPointerDown = (event) => {
    const onHandle = event.target.closest && event.target.closest(".tear-handle");
    if (onHandle) {
      if (emailValid && status !== "sending") return; // let the ticket start tearing
      if (!emailValid) setHint("Enter a valid email first, then tear the ticket.");
    }
    event.stopPropagation();
  };

  // Keyboard users: Enter/Space on the stub itself must not bypass the email check.
  const guardKeys = (event) => {
    const isStub = event.target.classList && event.target.classList.contains("tear-ticket__piece--stub");
    if (isStub && (event.key === "Enter" || event.key === " ") && (!emailValid || status === "sending")) {
      event.preventDefault();
      event.stopPropagation();
      setHint("Enter your email first, then tear the ticket.");
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch (error) {
      // clipboard not available: the address is still visible and selectable
    }
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1800);
  };

  const stub = (
    <div className="stub-ui" onPointerDown={onStubPointerDown} onKeyDown={(event) => event.stopPropagation()}>
      <label className="f-label" htmlFor="ticket-email">
        Your email <span>(required, so I can reply)</span>
      </label>
      <input
        id="ticket-email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        className={hint && !emailValid ? "invalid" : ""}
        onChange={(event) => {
          setEmail(event.target.value);
          if (hint) setHint("");
        }}
      />

      <label className="f-label" htmlFor="ticket-message">
        Message <span>(optional)</span>
      </label>
      <textarea
        id="ticket-message"
        rows={3}
        maxLength={600}
        placeholder="Say hi... leave it empty and I'll send a friendly default."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />

      <div className="rate-row">
        <span className="f-label">Rate my portfolio</span>
        <PeekRating
          value={rating}
          onChange={setRating}
          labels={RATING_LABELS}
          activeColor="#1c1915"
          idleColor="rgba(28, 25, 21, 0.2)"
          tipColor="#1c1915"
          tipTextColor="#e7dfcf"
          size={26}
          lift={5}
          ariaLabel="Rate my portfolio"
        />
      </div>

      <input
        className="hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        name="website"
        value={trap}
        onChange={(event) => setTrap(event.target.value)}
      />

      <div className={`tear-handle${emailValid ? " ready" : ""}`}>
        {emailValid ? "Pull here to tear off and send" : "Enter your email to unlock the tear"}
      </div>
      <button type="button" className="send-fallback" onClick={fallbackSend}>
        or send without tearing
      </button>
    </div>
  );

  return (
    <div
      className="overlay ticket-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div ref={wrapRef} className="ticket-wrap" role="dialog" aria-modal="true" aria-label="Contact ticket" onKeyDownCapture={guardKeys}>
        <button ref={closeRef} className="icon-close ticket-close" onClick={onClose} aria-label="Close ticket">
          ×
        </button>

        <TearTicket
          canStart={(event) =>
            emailValid && status !== "sending" && Boolean(event.target.closest && event.target.closest(".tear-handle"))
          }
          orientation="vertical"
          width={460}
          height={800}
          stubSize={410}
          radius={18}
          holes={14}
          holeSize={6}
          notch={4}
          rotate={1}
          tiltMax={4}
          tiltReach={200}
          resistance={0.35}
          background="#e7dfcf"
          stubBackground="#ddd4c1"
          color="#1c1915"
          borderColor="rgba(28, 25, 21, 0.3)"
          torn={torn}
          onTear={submit}
          stub={stub}
          ariaLabel="Tear off the stub to send your message"
        >
          <div className="ticket-body">
            <div className="ticket-top">
              <span>Admit one</span>
              <span>No. 0001</span>
            </div>
            <h3 className="ticket-name">{profile.name}</h3>
            <p className="ticket-role">{profile.role}</p>
            <ul className="contact-list">
              <li>
                <span className="c-label">Email</span>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
                <button type="button" className="copy-btn" onClick={copyEmail}>
                  {copied ? "Copied" : "Copy"}
                </button>
              </li>
              {profile.showPhone ? (
                <li>
                  <span className="c-label">Phone</span>
                  <span>{profile.phone}</span>
                </li>
              ) : null}
              <li>
                <span className="c-label">GitHub</span>
                <a href={profile.github} target="_blank" rel="noopener noreferrer">
                  {profile.github.replace("https://", "")}
                </a>
              </li>
              <li>
                <span className="c-label">LinkedIn</span>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                  Heng Jing Yu
                </a>
              </li>
              <li>
                <span className="c-label">CV</span>
                <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                  Download PDF
                </a>
              </li>
            </ul>
            <div className="ticket-barcode" aria-hidden="true" />
          </div>
        </TearTicket>

        <div className="ticket-status" role="status" aria-live="polite">
          {status === "sending" ? <p>Sending...</p> : null}
          {status === "sent" ? (
            <div className="ok">
              <p>
                {demo
                  ? "Demo mode: nothing was really sent, because no access key is set yet."
                  : "Message sent. Thank you, I'll reply by email!"}
              </p>
              <button type="button" className="solid-btn small" onClick={writeAnother} style={{ position: 'relative', zIndex: 50 }}>
                Write another
              </button>
            </div>
          ) : null}
          {status === "error" ? (
            <p className="bad">
              {errorText} You can also email me at <a href={`mailto:${profile.email}`}>{profile.email}</a>.
            </p>
          ) : null}
          {hint && status !== "sent" ? <p className="hint-text">{hint}</p> : null}
          <p className="privacy">Your email is only used to reply to you.</p>
        </div>
      </div>
    </div>
  );
}
