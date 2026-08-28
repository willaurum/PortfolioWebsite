import { useEffect, useRef, useState } from "react";

import { DEFAULT_CONFIG, DEFAULT_NAMES } from "../lib/arenaConfig.js";
import { simulateArena } from "../lib/arenaEngine.js";
import useDocumentTitle from "../lib/useDocumentTitle.js";
import "../styles/simulation.css";

/* Helpers copied verbatim from the original simulation.html controller. */
function clampCount(value) {
  if (Number.isNaN(value)) return 2;
  return Math.max(2, Math.min(24, value));
}

function parseNames(raw) {
  return raw
    .split(/[\n,]+/)
    .map((name) => name.trim())
    .filter(Boolean);
}

/*
 * Same chip / instruction / button copy as the original setPhase(). The one
 * difference: the original built all four label objects eagerly, so on the
 * final day the `advance` entry dereferenced days[dayIndex + 1].number, which
 * is undefined, and setPhase threw before it could update the tray. Here the
 * copy for the requested phase is built on demand, which is what the original
 * code was clearly written to do.
 */
function buildPhaseCopy(phase, simulation, dayIndex) {
  const totalDays = simulation.days.length;
  const day = simulation.days[dayIndex];
  if (!day) return null;

  switch (phase) {
    case "summary":
      return {
        chip: "Fallen",
        chipClass: "phase-chip summary",
        button: "Show fallen tributes",
        text: "Press Next to view fallen tributes and survivors.",
      };
    case "advance":
      return {
        chip: "Next day",
        chipClass: "phase-chip advance",
        button:
          dayIndex + 1 < totalDays
            ? `Start Day ${simulation.days[dayIndex + 1].number}`
            : "Continue",
        text: `Press Next to continue to Day ${
          simulation.days[dayIndex + 1].number
        }.`,
      };
    case "complete":
      return {
        chip: "Complete",
        chipClass: "phase-chip complete",
        button: "Restart simulation",
        text: "The arena grows silent. Press Next to start over.",
      };
    case "events":
    default:
      return {
        chip: "Events",
        chipClass: "phase-chip events",
        button: day.bloodbath ? "Reveal bloodbath" : "Reveal events",
        text: day.bloodbath
          ? "Bloodbath! Press Next to reveal the opening chaos."
          : `Day ${day.number} of ${totalDays}. Press Next to reveal today's events.`,
      };
  }
}

export default function Simulation() {
  useDocumentTitle("Hunger Games Simulator");

  const configRef = useRef(DEFAULT_CONFIG);
  const countInputRef = useRef(null);
  const namesInputRef = useRef(null);
  const eventsListRef = useRef(null);
  const summaryPanelRef = useRef(null);

  const [requiredNames, setRequiredNames] = useState(8);
  const [setupMessage, setSetupMessage] = useState({
    text: "Press Continue once you're happy with the roster.",
    color: "var(--arena-muted)",
  });

  const [simulation, setSimulation] = useState(null);
  const [dayIndex, setDayIndex] = useState(0);
  const [phase, setPhase] = useState("events");
  const [revealed, setRevealed] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);

  // The simulator had its own dark, centred page shell. Scoping those rules to
  // body.arena-page keeps them off the rest of the site.
  useEffect(() => {
    document.body.classList.add("arena-page");
    return () => document.body.classList.remove("arena-page");
  }, []);

  const prefillNames = (count) => {
    const list = DEFAULT_NAMES.slice(0, count);
    if (namesInputRef.current) {
      namesInputRef.current.value = list.join("\n");
    }
  };

  // init(): seed the roster, sync the hint, load the external event config.
  useEffect(() => {
    prefillNames(Number(countInputRef.current.value));
    setRequiredNames(clampCount(Number(countInputRef.current.value)));

    let cancelled = false;
    const fetchConfig = async () => {
      try {
        const response = await fetch("/theAreanaSim/arena_events.json", {
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          if (!cancelled) {
            configRef.current = { ...DEFAULT_CONFIG, ...data };
          }
        }
      } catch (error) {
        console.warn("Falling back to default config", error);
      }
    };
    fetchConfig();

    return () => {
      cancelled = true;
    };
  }, []);

  // The original listened for the input's native "change" event, so the hint
  // and the clamping only run once the value is committed.
  useEffect(() => {
    const input = countInputRef.current;
    if (!input) return undefined;

    const handleChange = () => {
      input.value = clampCount(Number(input.value));
      setRequiredNames(clampCount(Number(input.value)));
    };

    input.addEventListener("change", handleChange);
    return () => input.removeEventListener("change", handleChange);
  }, []);

  const prepareDay = (nextIndex) => {
    const day = simulation?.days[nextIndex];
    if (!day) return;
    setRevealed(false);
    setSummaryVisible(false);
    if (eventsListRef.current) eventsListRef.current.scrollTop = 0;
    if (summaryPanelRef.current) summaryPanelRef.current.scrollTop = 0;
    setPhase("events");
  };

  const resetToSetup = () => {
    setSimulation(null);
    setPhase("events");
    setDayIndex(0);
    setRevealed(false);
    setSummaryVisible(false);
    prefillNames(clampCount(Number(countInputRef.current.value)));
    setRequiredNames(clampCount(Number(countInputRef.current.value)));
    setSetupMessage({
      text: "Press Continue once you're happy with the roster.",
      color: "var(--arena-muted)",
    });
  };

  const handleSetupSubmit = (event) => {
    event.preventDefault();
    const required = clampCount(Number(countInputRef.current.value));
    const names = parseNames(namesInputRef.current.value);

    if (names.length < required) {
      setSetupMessage({
        text: `Please enter at least ${required} names to begin.`,
        color: "#ff6b6b",
      });
      return;
    }

    setSetupMessage({ text: "Generating arena...", color: "var(--arena-muted)" });

    setSimulation(simulateArena(names.slice(0, required), configRef.current));
    setDayIndex(0);
    setRevealed(false);
    setSummaryVisible(false);
    setPhase("events");
  };

  const handleNext = () => {
    if (!simulation) return;

    switch (phase) {
      case "events":
        setRevealed(true);
        setPhase("summary");
        break;
      case "summary":
        setSummaryVisible(true);
        setPhase(dayIndex === simulation.days.length - 1 ? "complete" : "advance");
        break;
      case "advance": {
        const nextIndex = dayIndex + 1;
        setDayIndex(nextIndex);
        prepareDay(nextIndex);
        break;
      }
      case "complete":
        resetToSetup();
        break;
      default:
        break;
    }
  };

  // Space / Enter advance the simulation unless a field has focus.
  const handleNextRef = useRef(handleNext);
  handleNextRef.current = handleNext;

  useEffect(() => {
    const handleGlobalKey = (event) => {
      if (!simulation) return;
      const activeTag = document.activeElement ? document.activeElement.tagName : "";
      if (activeTag === "INPUT" || activeTag === "TEXTAREA") {
        return;
      }
      if (event.code === "Space" || event.code === "Enter") {
        event.preventDefault();
        handleNextRef.current();
      }
    };

    document.addEventListener("keydown", handleGlobalKey);
    return () => document.removeEventListener("keydown", handleGlobalKey);
  }, [simulation]);

  const day = simulation ? simulation.days[dayIndex] : null;
  const copy = simulation && day ? buildPhaseCopy(phase, simulation, dayIndex) : null;
  const dayHeading = day
    ? day.bloodbath
      ? `Day ${day.number} - Bloodbath`
      : `Day ${day.number}`
    : "Day 1";

  const roster = simulation ? (simulation.tributes ?? []).map((tribute) => tribute.name) : [];
  const survivorsSet = new Set(day ? day.survivors : []);
  const showChampion = Boolean(
    simulation && dayIndex === simulation.days.length - 1 && simulation.winner,
  );

  return (
    <main className="arena-container">
      <section id="setupScreen" className={simulation ? "panel hidden" : "panel"}>
        <h1>Hunger Games Simulator</h1>
        <p>
          First, pick how many tributes you want and enter their names. Press next to begin the games.
        </p>

        <form id="setupForm" className="form-grid" onSubmit={handleSetupSubmit}>
          <label>
            Number of tributes (2-24)
            <input
              type="number"
              id="countInput"
              min="2"
              max="24"
              defaultValue="8"
              required
              ref={countInputRef}
            />
          </label>

          <div>
            <div className="helper-row">
              <label htmlFor="namesInput">Tribute names</label>
              <button
                type="button"
                id="autofillBtn"
                className="btn-ghost"
                onClick={(event) => {
                  event.preventDefault();
                  prefillNames(Number(countInputRef.current.value));
                  setSetupMessage({
                    text: "Roster refreshed with sample names.",
                    color: "var(--arena-muted)",
                  });
                }}
              >
                Autofill
              </button>
            </div>
            <textarea
              id="namesInput"
              placeholder="One name per line or comma separated"
              ref={namesInputRef}
            ></textarea>
            <p id="namesHint" style={{ margin: "8px 0 0", fontSize: "0.85rem" }}>
              {`Enter at least ${requiredNames} names (one per line or separated by commas).`}
            </p>
          </div>

          <p id="setupMessage" style={{ marginBottom: 0, color: setupMessage.color }}>
            {setupMessage.text}
          </p>

          <button type="submit" className="btn-primary">Continue</button>
        </form>
      </section>

      <section
        id="simulationScreen"
        className={simulation ? "panel" : "panel hidden"}
        data-phase={simulation ? phase : undefined}
      >
        <div className="screen-header">
          <div className="header-row">
            <div>
              <p
                className="instruction-text"
                style={{
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontSize: "0.78rem",
                  margin: 0,
                }}
              >
                Arena timeline
              </p>
              <h2 id="dayHeading">{dayHeading}</h2>
            </div>
            <span id="phaseChip" className={copy ? copy.chipClass : "phase-chip"}>
              {copy ? copy.chip : "Events"}
            </span>
          </div>
          <p id="instructionText" className="instruction-text">
            {copy ? copy.text : "Press Next to reveal the first day's events."}
          </p>
        </div>

        <div className="events-wrapper">
          <div id="eventsList" className="events-list" ref={eventsListRef}>
            {revealed && day
              ? day.events.length
                ? day.events.map((event, index) => (
                    <p
                      key={index}
                      className={`event-line${event.type ? ` ${event.type}` : ""}`}
                    >
                      <span className="event-dot"></span>
                      <span>{event.text}</span>
                    </p>
                  ))
                : (
                    <p className="event-line">
                      <span className="event-dot"></span>
                      <span>A quiet day passes without incident.</span>
                    </p>
                  )
              : null}
          </div>

          <div
            id="summaryPanel"
            className={summaryVisible ? "summary-block" : "summary-block hidden"}
            ref={summaryPanelRef}
          >
            {summaryVisible && day ? (
              <>
                <div>
                  <h3>{day.bloodbath ? "Bloodbath casualties" : "Fallen tributes"}</h3>
                  {day.fallen.length ? (
                    <ul>
                      {day.fallen.map((name) => (
                        <li key={name}>{name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No fallen tributes today.</p>
                  )}
                </div>

                {roster.length ? (
                  <div className="status-board">
                    <h3>Status board</h3>
                    <ul>
                      {roster.map((name) => {
                        const alive = survivorsSet.has(name);
                        return (
                          <li key={name} className={`status-entry ${alive ? "alive" : "dead"}`}>
                            <span className="icon">{alive ? "✓" : "✕"}</span>
                            <span>{name}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}

                {showChampion ? (
                  <div
                    style={{
                      marginTop: "18px",
                      borderTop: "1px solid rgba(224,174,62,0.2)",
                      paddingTop: "12px",
                    }}
                  >
                    <h3>Champion</h3>
                    <p>{simulation.winner}</p>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </div>

        <div className="control-tray">
          <button id="nextButton" className="btn-primary btn-full" onClick={handleNext}>
            {copy ? copy.button : "Next"}
          </button>
          <p className="tray-hint">Shortcut: press Space or Enter to advance.</p>
        </div>
      </section>
    </main>
  );
}
