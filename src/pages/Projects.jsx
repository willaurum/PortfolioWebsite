import { Link } from "react-router-dom";

import ProjectCard from "../components/ProjectCard.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import SiteHeader from "../components/SiteHeader.jsx";
import SkipLink from "../components/SkipLink.jsx";
import useDocumentTitle from "../lib/useDocumentTitle.js";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Experience", to: "/", hash: "#experience" },
  { label: "Projects", to: "/projects", current: true },
  { label: "Lessons", to: "/learnPython" },
  { label: "Contact", to: "/", hash: "#contact" },
];

export default function Projects() {
  useDocumentTitle("Projects | William Cook");

  return (
    <>
      <SkipLink href="#main-content" />

      <SiteHeader brandStrong="William Cook" links={NAV_LINKS} />

      <main id="main-content">
        <section className="page-hero projects-hero">
          <div className="container">
            <p className="eyebrow">Selected Work</p>
            <h1>Projects</h1>
            <p className="hero-description">
              Practical software projects across desktop tools, games,
              simulations, infrastructure, and frontend development.
            </p>
            <div className="project-pill-list" aria-label="Project categories">
              <span>Python</span>
              <span>Web Dev</span>
              <span>Linux / DevOps</span>
              <span>Desktop Apps</span>
              <span>Full-Stack</span>
              <span>APIs</span>
              <span>Automation</span>
              <span>OOP</span>
            </div>
          </div>
        </section>

        <section className="section projects-section">
          <div className="container projects-grid">
            <ProjectCard
              media={
                <figure className="project-media site-preview">
                  <img
                    src="/assets/japanese-language-club.png"
                    alt="Liberty Japanese Language Club website preview"
                    loading="lazy"
                  />
                </figure>
              }
              title="Liberty Japanese Language Club Website"
              meta={["Web", "Nginx", "Self-Hosted"]}
              description={
                <p>
                  A self-hosted website built as a centralized hub for Liberty
                  University's Japanese Language Club information, resources, and
                  community engagement.
                </p>
              }
            >
              <ul>
                <li>
                  Designed and developed a multi-page website for club
                  information, meetings, and member resources
                </li>
                <li>
                  Deployed the site on a self-managed Raspberry Pi server
                  using Nginx for full infrastructure control
                </li>
                <li>
                  Configured <code>lujapanese.com</code> with HTTPS through
                  Let's Encrypt for secure production access
                </li>
                <li>
                  Integrated GitHub version control and pull workflows for
                  maintainable content updates
                </li>
                <li>
                  Built a themed UI focused on readability, meeting details,
                  leadership information, and resources
                </li>
                <li>
                  Applied real-world DevOps concepts including server
                  management, DNS configuration, SSL setup, and deployment
                  workflows
                </li>
              </ul>
              <a
                className="text-link"
                href="https://lujapanese.com"
                target="_blank"
                rel="noreferrer"
              >View on Website</a>
            </ProjectCard>

            <ProjectCard
              title="Self-Hosted Server Infrastructure"
              meta={["Linux", "Networking", "Automation"]}
              description={
                <p>
                  Designed, deployed, and maintained a headless Linux server using
                  a Raspberry Pi Compute Module 5 with NVMe storage, optimized for
                  remote access and long-running services.
                </p>
              }
            >
              <ul>
                <li>
                  Configured Raspberry Pi OS (64-bit) on a Raspberry Pi
                  Compute Module 5 with NVMe SSD root filesystem
                </li>
                <li>
                  Customized EEPROM boot order to prioritize NVMe over
                  on-module storage
                </li>
                <li>
                  Diagnosed and resolved boot conflicts caused by residual
                  storage on previously used CM5 hardware
                </li>
                <li>
                  Set up secure key-based SSH access and Ethernet-first
                  networking for stable remote administration
                </li>
                <li>
                  Disabled Wi-Fi via NetworkManager to reduce attack surface
                  and improve reliability
                </li>
                <li>
                  Installed and configured Tailscale for secure remote access
                  across restrictive networks
                </li>
                <li>
                  Monitored system health including CPU temperature, memory
                  usage, zram swap, and storage mounts
                </li>
                <li>
                  Deployed and administered two modded Minecraft servers that
                  run simultaneously.
                </li>
                <li>
                  Automated maintenance with cron jobs for daily backups,
                  retention policies, and permission management
                </li>
                <li>
                  Performed routine Linux server administration including
                  service management and scheduled reboots
                </li>
              </ul>
            </ProjectCard>

            <ProjectCard
              className="featured-media"
              media={
                <figure className="project-media">
                  <img
                    src="/assets/CheckMate.png"
                    alt="CheckMate icon"
                    loading="lazy"
                  />
                </figure>
              }
              title="CheckMate"
              meta={["Desktop App", "Python", "Windows"]}
              description={
                <p>
                  A clean desktop to-do list built around multiple lists, task
                  notes, drag-friendly organization, and no ads.
                </p>
              }
            >
              <ul>
                <li>
                  I created checkmate because I could not find a to do list
                  that allowed me to have several lists, let me make notes on
                  my tasks, and let me move my tasks around between lists. I
                  decided that creating my own app would benefit me so I took
                  a weekend to develop this.
                </li>
                <li>
                  I had been using it for about a week when my friend
                  approached me asking if she could use it too and I decided
                  to give it to anyone interested in using it for free on this
                  website.
                </li>
              </ul>
              <a
                className="text-link"
                href="/assets/CheckMate.exe"
                download="CheckMate.exe"
              >
                Download for Yourself (Windows)
              </a>
            </ProjectCard>

            <ProjectCard
              media={
                <figure className="project-media">
                  <img
                    src="/gifs/websitegenGIF.gif"
                    alt="Generator demo"
                    loading="lazy"
                  />
                </figure>
              }
              title="Static Website Generator"
              meta={["Tooling", "Tkinter", "Hackathon"]}
              description={
                <p>
                  A Tkinter-based GUI tool for generating fully customizable,
                  responsive static websites without writing a single line of HTML
                  or CSS.
                </p>
              }
            >
              <ul>
                <li>
                  Intuitive GUI interface&mdash;build pages visually with
                  input fields and buttons.
                </li>
                <li>
                  Customizable content: titles, headings, paragraphs, embedded
                  images &amp; YouTube videos, footers, and optional banners.
                </li>
                <li>
                  Responsive design: outputs mobile-friendly HTML5 and CSS3
                  layouts.
                </li>
                <li>
                  Nine built-in themes including Light Minimalist, Dark Mode,
                  Cyberpunk Neon, Vintage, and more.
                </li>
                <li>
                  Live preview: instantly render your site in the browser as
                  you work.
                </li>
                <li>
                  Export options: save separate HTML and CSS files to any
                  directory.
                </li>
              </ul>
              <p>
                Developed during Liberty University's Software Development
                Club hackathon (2nd place), this tool streamlines website
                creation with multimedia support and theme switching&mdash;all
                powered by Python and Tkinter.
              </p>
              <a
                className="text-link"
                href="https://github.com/willaurum/Static-Website-Generator"
                target="_blank"
                rel="noreferrer"
              >View on GitHub</a>
            </ProjectCard>

            <ProjectCard
              title="This Website"
              meta={["Frontend", "HTML", "CSS"]}
              description={
                <p>
                  This portfolio website was designed and developed from scratch
                  using HTML, CSS, and JavaScript. It showcases my technical
                  skills, projects, and experience in a responsive and visually
                  appealing layout.
                </p>
              }
            >
              <ul>
                <li>
                  Built with semantic HTML and modern CSS for clean structure
                  and maintainability
                </li>
                <li>
                  Uses JavaScript for interactive components like expandable
                  project descriptions
                </li>
                <li>
                  Styled to match a professional dark theme with animation
                  support
                </li>
                <li>Optimized for desktop and mobile devices</li>
              </ul>
              <p>
                Developing this site helped solidify my frontend development
                abilities and provided a real-world context for applying
                responsive design, accessibility, and component-based
                thinking.
              </p>
              <a
                className="text-link"
                href="https://github.com/willaurum/Willaurum.github.io"
                target="_blank"
                rel="noreferrer"
              >View on GitHub</a>
            </ProjectCard>

            <ProjectCard
              title="Hunger Games Simulator"
              meta={["Simulation", "Python", "JavaScript"]}
              description={
                <p>
                  A fully interactive, browser-based Hunger Games simulation
                  engine featuring dynamic event generation, inventory systems,
                  and day-by-day storytelling.
                </p>
              }
            >
              <ul>
                <li>
                  Built a complete front-end simulation viewer with custom UI
                  for events, fallen tributes, and survivor tracking
                </li>
                <li>
                  Developed a Python backend that procedurally generates arena
                  events using configurable probabilities and item systems
                </li>
                <li>
                  Implemented lethal, non-lethal, loot, inventory, and
                  special-item events with multi-victim and placeholder-driven
                  templates
                </li>
                <li>
                  Designed a JSON-based simulation format enabling repeatable
                  runs and external configuration through
                  {" "}
                  <code>arena_events.json</code>
                </li>
                <li>
                  Created a polished simulation flow including Bloodbath
                  logic, death pacing, mandatory eliminations, and victory
                  generation
                </li>
              </ul>
              <Link className="text-link" to="/theAreanaSim/simulation">View on Website</Link>
            </ProjectCard>

            <ProjectCard
              media={
                <figure className="project-media">
                  <img
                    src="/gifs/astroCombat.gif"
                    alt="AstroCombat gameplay demo"
                    loading="lazy"
                  />
                </figure>
              }
              title="AstroCombat"
              meta={["Game", "Pygame", "Collaboration"]}
              description={
                <p>
                  A fast-paced two-player space shooter built with Pygame,
                  developed in collaboration with Ethan Works.
                </p>
              }
            >
              <ul>
                <li>
                  Built core gameplay loop featuring real-time ship movement,
                  projectile firing, and hit detection
                </li>
                <li>
                  Implemented player-vs-player combat mechanics including
                  health tracking and responsive controls
                </li>
                <li>
                  Designed dynamic background movement and visual effects to
                  enhance game feel
                </li>
                <li>
                  Structured game architecture for readability and modularity,
                  enabling future expansion
                </li>
              </ul>
              <a
                className="text-link"
                href="https://github.com/willaurum/AstroCombat"
                target="_blank"
                rel="noreferrer"
              >View on GitHub</a>
            </ProjectCard>

            <ProjectCard
              media={
                <figure className="project-media">
                  <img
                    src="/gifs/blockBreaker.gif"
                    alt="Block Breaker gameplay demo"
                    loading="lazy"
                  />
                </figure>
              }
              title="Block Breaker"
              meta={["Game", "Pygame", "State Logic"]}
              description={
                <p>
                  A drag-and-drop puzzle game built with Pygame where players
                  place random block shapes onto a grid and score by clearing full
                  rows or columns.
                </p>
              }
            >
              <ul>
                <li>
                  Developed dynamic block spawning using a library of over 30
                  unique shapes
                </li>
                <li>
                  Implemented mouse-based interaction to move, place, and
                  validate blocks on a grid
                </li>
                <li>
                  Built collision and fit-checking logic for accurate
                  placement and scoring
                </li>
                <li>
                  Designed a scoring system that rewards clearing full rows or
                  columns
                </li>
              </ul>
              <p>
                This project enhanced my ability to structure interactive
                systems, manage game state efficiently, and apply core
                programming principles like modularity and reusability within
                a graphical framework.
              </p>
              <a
                className="text-link"
                href="https://github.com/willaurum/block-breaker"
                target="_blank"
                rel="noreferrer"
              >View on GitHub</a>
            </ProjectCard>

            <ProjectCard
              media={
                <figure className="project-media">
                  <img
                    src="/gifs/snakeVideo.gif"
                    alt="Snake gameplay demo"
                    loading="lazy"
                  />
                </figure>
              }
              title="Snake Game"
              meta={["Game", "Tkinter", "Python"]}
              description={
                <p>
                  A classic Snake game built with Python and Tkinter, expanding on
                  my foundational skills from my first project by adding real-time
                  input handling, dynamic rendering, and collision logic.
                </p>
              }
            >
              <ul>
                <li>
                  Implemented real-time game loop using Tkinter's
                  {" "}
                  <code>after()</code> method
                </li>
                <li>
                  Designed a grid-based canvas for snake movement and apple
                  generation
                </li>
                <li>
                  Handled directional controls via keyboard events with input
                  validation
                </li>
                <li>
                  Created visual feedback for game state and scoring display
                </li>
              </ul>
              <p>
                This project helped me deepen my understanding of animation
                timing, event-driven programming, and basic game mechanics
                while solidifying my comfort with Python GUI development.
              </p>
              <a
                className="text-link"
                href="https://github.com/willaurum/Snake-Game"
                target="_blank"
                rel="noreferrer"
              >View on GitHub</a>
            </ProjectCard>

            <ProjectCard
              title="Eclipse RPG Toolkit"
              meta={["Game", "OOP", "Python"]}
              description={
                <p>
                  Designed and developed a text-based RPG using object-oriented
                  programming (OOP), focusing on game mechanics, file handling,
                  and scalable code structure.
                </p>
              }
            >
              <ul>
                <li>
                  Modular OOP design for Weapons, Armor, Items, and Enemies
                </li>
                <li>Turn-based combat system with inventory management</li>
                <li>Procedural enemy generation based on difficulty</li>
                <li>Dynamic file handling for loading game assets</li>
              </ul>
              <a
                className="text-link"
                href="https://github.com/willaurum/EclipseRPGToolkit"
                target="_blank"
                rel="noreferrer"
              >View on GitHub</a>
            </ProjectCard>

            <ProjectCard
              media={
                <figure className="project-media">
                  <img
                    src="/gifs/Trackervideo.gif"
                    alt="Tracker gameplay demo"
                    loading="lazy"
                  />
                </figure>
              }
              title="Tracker"
              meta={["Game", "Tkinter", "Reflex"]}
              description={
                <p>
                  A fast-paced reflex game where you must click rapidly spawning
                  "X" buttons before they overcrowd the screen.
                </p>
              }
            >
              <ul>
                <li>
                  New "X" buttons appear every 0.25 seconds at random
                  positions with spatial constraints.
                </li>
                <li>Click and remove 100 X's to win the game.</li>
                <li>
                  Game over if 10 or more X's accumulate on screen at once.
                </li>
                <li>
                  Dynamic challenge ramps up as targets steadily multiply.
                </li>
              </ul>
              <p>
                Built with Python and Tkinter, Tracker is a fun game that
                tests your speed and hand-eye coordination.
              </p>
              <a
                className="text-link"
                href="https://github.com/willaurum/tracker"
                target="_blank"
                rel="noreferrer"
              >View Code on GitHub</a>
            </ProjectCard>

            <ProjectCard
              title="Discord Bot"
              meta={["Bot", "Async Python", "APIs"]}
              description={
                <p>
                  A Python Discord bot delivering random GIFs, witty moderation,
                  and spontaneous voice-channel antics through async event
                  handling.
                </p>
              }
            >
              <ul>
                <li>
                  Mastered asynchronous I/O with discord.py and aiohttp for
                  seamless command handling and API requests.
                </li>
                <li>
                  Integrated Tenor GIF API to fetch and post trending media
                  using randomized search terms.
                </li>
                <li>
                  Implemented moderation: forbidden-word detection, message
                  deletion, dynamic nicknaming, and embedded logs.
                </li>
                <li>
                  Leveraged discord.ext.tasks for scheduled voice-channel
                  joins and background task loops.
                </li>
                <li>Employed randomness for GIF posts, and reactions.</li>
                <li>
                  Configured Discord intents, structured commands, and robust
                  error handling for production readiness.
                </li>
              </ul>
              <p>
                Developing this bot was a fun request from a friend. I enjoyed
                making it and it continues to entertain the members of the
                servers it is in.
              </p>
            </ProjectCard>

            <ProjectCard
              title="Tic-Tac-Toe Game"
              meta={["First Project", "Tkinter", "Python"]}
              description={
                <p>
                  My first ever programming project: a simple two-player
                  Tic-Tac-Toe game built in Python using Tkinter, this project is
                  what sparked my interest in making new things and eventually led
                  me to move from a cybersecurity focus to a software engineering
                  and data science focus.
                </p>
              }
            >
              <ul>
                <li>
                  Created a functional 3x3 game board using Tkinter widgets
                </li>
                <li>
                  Implemented turn-based mechanics with win and draw
                  conditions
                </li>
                <li>Used message boxes to communicate game outcomes</li>
                <li>
                  Learned core programming concepts like functions,
                  conditionals, and loops
                </li>
              </ul>
              <p>
                This project marked my entry into software development and
                helped me gain confidence in Python, problem-solving, and
                building user interfaces.
              </p>
              <a
                className="text-link"
                href="https://github.com/willaurum/Tic-Tac-Toe-with-a-UI"
                target="_blank"
                rel="noreferrer"
              >View on GitHub</a>
            </ProjectCard>
          </div>
        </section>
      </main>

      <SiteFooter mark="Projects" />
    </>
  );
}
