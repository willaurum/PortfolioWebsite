import { Link } from "react-router-dom";

import LeetCodeCount from "../components/LeetCodeCount.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import SiteHeader from "../components/SiteHeader.jsx";
import SkipLink from "../components/SkipLink.jsx";
import useDocumentTitle from "../lib/useDocumentTitle.js";

const NAV_LINKS = [
  { label: "Home", to: "/", current: true },
  { label: "Experience", hash: "#experience" },
  { label: "Projects", to: "/projects" },
  { label: "Lessons", to: "/learnPython" },
  { label: "Contact", hash: "#contact" },
];

export default function Home() {
  useDocumentTitle("William Cook | Portfolio");

  return (
    <>
      <SkipLink href="#main-content" />

      <SiteHeader brandStrong="William Cook" links={NAV_LINKS} />

      <main id="main-content">
        <section className="hero hero-home" id="home" aria-label="William Cook introduction">
          <img
            className="hero-image"
            src="/Portrait.PNG"
            alt="Portrait of William Cook"
          />
          <div className="hero-shade" aria-hidden="true"></div>
          <div className="container hero-content">
            <p className="eyebrow">CS Student &bull; Liberty University</p>
            <h1>Hi, I'm William Cook</h1>
            <p className="hero-subtitle">
              Full-Stack Developer &bull; Systems Engineer &bull; Computer Science Student
            </p>
            <p className="hero-description">
              I'm a Computer Science student and software engineer who enjoys building systems from the hardware up. My experience spans embedded software, full-stack web development, self-hosted infrastructure, and developer tools. Whether it's extending firmware-connected applications, designing APIs, or deploying services on Linux servers, I focus on creating reliable software that solves real problems.
            </p>
            <div className="hero-actions" aria-label="Portfolio links">
              <Link className="button primary" to="/projects">View Projects</Link>
              <a className="button secondary" href="https://www.linkedin.com/in/willaurum" target="_blank" rel="noreferrer">LinkedIn</a>
              <a className="button secondary" href="https://github.com/willaurum" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
        </section>

        <section className="section alt" id="experience">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Background</p>
              <h2 className="section-title">Experience</h2>
            </div>

            <div className="experience-grid">
              <article className="info-card">
                <h3>
                  <a href="https://coledd.com/" target="_blank" rel="noopener noreferrer">
                    Cole Design &amp; Development LLC (ColeDD)
                  </a>
                </h3>
                <p className="role-line">
                  Software Engineering Intern | Hudson, OH | Dec 2025 - Present
                </p>
                <ul>
                  <li>
                    Developed <strong>ColeCloud</strong>, a production IoT management platform for monitoring,
                    controlling, and securing connected devices
                  </li>
                  <li>
                    Built the backend, React dashboard, database schema, cloud infrastructure, and MQTT communication
                    stack, deploying the platform to AWS with Docker
                  </li>
                  <li>
                    Implemented real-time telemetry, device provisioning, server-side alerting, reporting,
                    and certificate-based mutual TLS authentication for connected devices
                  </li>
                  <li>
                    Additional internship work included embedded systems development using Rust, Tauri, and React,
                    improving device configuration workflows and frontend/backend integration
                  </li>
                </ul>
              </article>

              <article className="info-card">
                <h3>Software Development Club</h3>
                <ul>
                  <li>
                    Participate in weekly hands-on projects to build and refine
                    software development skills
                  </li>
                  <li>
                    Collaborate with groups needing support in areas such as
                    artificial intelligence, web development, and beta testing
                  </li>
                  <li>
                    Won the club-hosted hackathon with a custom-built static website
                    generator
                  </li>
                  <li>
                    Engage in real-world applications and teamwork to expand
                    practical programming experience
                  </li>
                </ul>
              </article>

              <article className="info-card">
                <h3>Liberty University's Competitive Programming Team</h3>
                <ul>
                  <li>Served as Outreach Officer during the 2025-26 academic year</li>
                  <li>
                    Helped lead Liberty to 6th place among 61 teams at the 2024
                    ICPC Mid-Atlantic Regional
                  </li>
                  <li>Solved 100+ algorithmic problems on Kattis</li>
                  <li>
                    Strengthened skills in data structures, algorithms, and
                    performance-focused problem solving
                  </li>
                </ul>
              </article>

              <article className="info-card">
                <h3>LeetCode</h3>
                <p>
                  I have currently completed{" "}
                  <LeetCodeCount /> LeetCode problems.
                  This number updates live thanks to a custom JavaScript script I
                  wrote that fetches my latest stats automatically whenever you load
                  this page.
                </p>
                <p>
                  Practicing these problems regularly has helped me improve my
                  problem-solving skills and strengthen my understanding of data
                  structures and algorithms.
                </p>
                <p>
                  <a className="text-link" href="https://github.com/willaurum/LeetCode-Solutions" target="_blank" rel="noreferrer">
                    View on GitHub
                  </a>
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="section" id="projects">
          <div className="container split">
            <div>
              <div className="section-heading">
                <p className="eyebrow">Pinned Project</p>
                <h2 className="section-title">Self-Hosted Server Infrastructure</h2>
              </div>
              <p className="section-subtitle">
                Designed, deployed, and maintained a headless Linux server using a
                Raspberry Pi Compute Module 5 with NVMe storage, optimized for
                remote access and long-running services.
              </p>
              <div className="section-actions">
                <Link className="button primary" to="/projects">View All Projects</Link>
              </div>
            </div>

            <article className="project-card compact-project">
              <p className="eyebrow">Technical Highlights</p>
              <ul>
                <li>Configured Raspberry Pi OS on CM5 with an NVMe root filesystem</li>
                <li>Prioritized NVMe boot through EEPROM configuration</li>
                <li>Set up key-based SSH, Ethernet-first networking, and Tailscale access</li>
                <li>Disabled Wi-Fi through NetworkManager for reliability and security</li>
                <li>Monitored CPU temperature, memory, zram swap, and storage mounts</li>
                <li>Automated backups and permissions maintenance with cron jobs</li>
                <li>Administered two simultaneous modded Minecraft server instances</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="section alt" id="contact">
          <div className="container contact-panel">
            <div className="contact-heading">
              <p className="eyebrow">Contact</p>
              <h2 className="section-title">Let's Connect</h2>
              <p className="contact-intro">
                I'm always open to talking through software projects,
                internships, collaboration ideas, or new opportunities.
              </p>
            </div>
            <div className="contact-copy">
              <div className="contact-methods" aria-label="Contact options">
                <p className="contact-method">
                  <span>Email</span>
                  <a href="mailto:williamcook0811@gmail.com">williamcook0811@gmail.com</a>
                </p>
                <p className="contact-method">
                  <span>LinkedIn</span>
                  <a href="https://www.linkedin.com/in/willaurum" target="_blank" rel="noreferrer">linkedin.com/in/willaurum</a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter mark="William Cook" />
    </>
  );
}
