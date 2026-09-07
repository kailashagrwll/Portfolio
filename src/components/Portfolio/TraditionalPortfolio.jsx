import React, { useState } from 'react';
import { portfolioData } from '../../data/portfolio';
import { soundManager } from '../../audio/soundManager';
import {
  Gamepad2,
  Download,
  Mail,
  ExternalLink,
  Terminal,
  Zap,
  Briefcase,
  GraduationCap,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  ChevronUp,
  Award,
  Phone
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../UI/SocialIcons';

export function TraditionalPortfolio({ onReturnToGame }) {
  const { personal, projects, skills, experience, education, certificates, achievements } = portfolioData;
  const [projectCategory, setProjectCategory] = useState('All');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personal.socials.email);
    setCopiedEmail(true);
    soundManager.playClick();
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(personal.socials.phone);
    setCopiedPhone(true);
    soundManager.playClick();
    setTimeout(() => setCopiedPhone(false), 2200);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    soundManager.playClick();
    setFormSent(true);
  };

  const filteredProjects = projectCategory === 'All'
    ? projects
    : projects.filter(p => p.category.toLowerCase().includes(projectCategory.toLowerCase()));

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="portfolio-2d-container">
      {/* Sticky Navigation Header */}
      <header className="portfolio-2d-navbar glass-panel">
        <div className="nav-brand">
          <span className="brand-dot" />
          <span className="brand-name">{personal.name}</span>
          <span className="brand-badge">B.Tech CSE</span>
        </div>

        <nav className="nav-links">
          <button onClick={() => scrollToSection('about')}>About</button>
          <button onClick={() => scrollToSection('projects')}>Projects</button>
          <button onClick={() => scrollToSection('skills')}>Skills</button>
          <button onClick={() => scrollToSection('training')}>Training & Certs</button>
          <button onClick={() => scrollToSection('contact')}>Contact</button>
        </nav>

        <div className="nav-actions">
          <button
            onClick={onReturnToGame}
            className="btn-return-game"
            title="Return to 3D Explorable World"
          >
            <Gamepad2 size={18} />
            <span>3D Game World</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="portfolio-2d-content">
        {/* ================= HERO ================= */}
        <section className="section-hero">
          <div className="hero-pill">
            <span className="pulse-dot" />
            <span>{personal.status}</span>
          </div>

          <h1 className="hero-heading">
            Computer Science Engineer building <span className="gradient-text">Full-Stack Platforms</span> & Intelligent ML Systems.
          </h1>

          <p className="hero-subheading">
            {personal.bio}
          </p>

          <div className="hero-cta-row">
            <button onClick={onReturnToGame} className="btn-primary-glow">
              <Gamepad2 size={18} />
              <span>Explore 3D World</span>
            </button>
            <button
              onClick={() => {
                soundManager.playCelebration();
                window.print();
              }}
              className="btn-secondary-glass"
            >
              <Download size={18} />
              <span>Print / Save CV</span>
            </button>
            <button onClick={() => scrollToSection('contact')} className="btn-accent-pill">
              <span>Contact Me</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Stats Metrics Banner */}
          <div className="stats-row glass-panel">
            {personal.stats.map((st, i) => (
              <div key={i} className="stat-metric">
                <div className="stat-number gradient-text">{st.value}</div>
                <div className="stat-name">{st.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= ABOUT & EDUCATION ================= */}
        <section id="about" className="section-block">
          <div className="section-title-wrap">
            <span className="section-eyebrow">Profile & Academia</span>
            <h2 className="section-heading">About Me & Education</h2>
          </div>

          <div className="about-grid">
            <div className="about-bio-card glass-panel">
              <h3>Engineer, Problem Solver & Developer</h3>
              <p>
                I am a Computer Science & Engineering student at Lovely Professional University with a strong academic foundation (CGPA 8.37) and a passion for crafting robust systems.
              </p>
              <p>
                With over 200+ DSA problems solved across LeetCode, HackerRank, and Codeforces, I bring strong algorithmic thinking to backend architectures, database design, and machine learning pipelines.
              </p>
              <div className="social-links-row">
                <a href={personal.socials.github} target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="GitHub">
                  <GithubIcon size={18} />
                </a>
                <a href={personal.socials.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="LinkedIn">
                  <LinkedinIcon size={18} />
                </a>
                <a href={`mailto:${personal.socials.email}`} className="social-icon-btn" title="Email">
                  <Mail size={18} />
                </a>
                <a href={`tel:${personal.socials.phone}`} className="social-icon-btn" title="Phone">
                  <Phone size={18} />
                </a>
              </div>
            </div>

            <div className="about-edu-card glass-panel">
              <div className="card-top-icon">
                <GraduationCap size={22} className="neon-cyan-text" />
                <h3>Education Chronology</h3>
              </div>
              {education.map((ed, idx) => (
                <div key={idx} className="edu-entry">
                  <div className="edu-degree">{ed.degree}</div>
                  <div className="edu-school">{ed.institution} • <span className="node-location">{ed.location}</span></div>
                  <div className="edu-period">{ed.period} • <span className="green-text" style={{ fontWeight: 700 }}>{ed.honors}</span></div>
                  <div className="edu-focus">{ed.focus}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= PROJECTS ================= */}
        <section id="projects" className="section-block">
          <div className="section-title-wrap">
            <span className="section-eyebrow">Showcase</span>
            <h2 className="section-heading">Featured Engineering Projects</h2>
          </div>

          <div className="projects-filter-bar">
            {['All', 'Full-Stack', 'Data Analytics', 'Machine Learning'].map((cat) => (
              <button
                key={cat}
                onClick={() => setProjectCategory(cat)}
                className={`filter-btn ${projectCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="projects-grid">
            {filteredProjects.map((proj) => (
              <div key={proj.id} className="project-card glass-panel">
                <div className="project-card-banner" style={{ background: proj.gradient }}>
                  <span className="project-tag">{proj.tag}</span>
                  <Terminal size={36} className="project-header-icon" />
                </div>
                <div className="project-card-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0 }}>{proj.title}</h3>
                    <span style={{ fontSize: '12px', color: '#00f0ff', fontWeight: 600 }}>{proj.period}</span>
                  </div>
                  <p className="project-description">{proj.description}</p>

                  <div className="project-highlights">
                    {proj.highlights.map((hl, i) => (
                      <div key={i} className="hl-row">
                        <span className="hl-bullet">▹</span>
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>

                  <div className="project-tech-tags">
                    {proj.tech.map((t, i) => (
                      <span key={i} className="tech-pill">{t}</span>
                    ))}
                  </div>

                  <div className="project-btn-row">
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary-glow full-width"
                    >
                      <GithubIcon size={16} />
                      <span>View on GitHub</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= SKILLS ================= */}
        <section id="skills" className="section-block">
          <div className="section-title-wrap">
            <span className="section-eyebrow">Disciplines</span>
            <h2 className="section-heading">Skills & Technical Arsenal</h2>
          </div>

          <div className="skills-grid">
            {skills.map((cat, idx) => (
              <div key={idx} className="skill-category-card glass-panel">
                <div className="cat-title-row">
                  <Zap size={18} style={{ color: cat.color }} />
                  <h3 style={{ color: cat.color }}>{cat.category}</h3>
                </div>
                <div className="skills-bars-list">
                  {cat.items.map((skill, si) => (
                    <div key={si} className="skill-bar-item">
                      <div className="bar-labels">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-meta">{skill.exp}</span>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{ width: `${skill.level}%`, backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= TRAINING, CERTS & ACHIEVEMENTS ================= */}
        <section id="training" className="section-block">
          <div className="section-title-wrap">
            <span className="section-eyebrow">Milestones</span>
            <h2 className="section-heading">Training, Certifications & Achievements</h2>
          </div>

          {/* Summer Training Timeline */}
          <div className="timeline-wrapper" style={{ marginBottom: '32px' }}>
            {experience.map((exp, idx) => (
              <div key={idx} className="timeline-node glass-panel">
                <div className="node-marker" />
                <div className="node-header">
                  <div>
                    <h3 className="node-role">{exp.role}</h3>
                    <div className="node-company">{exp.company} • <span className="node-location">{exp.location}</span></div>
                  </div>
                  <span className="node-period">{exp.period}</span>
                </div>
                <p className="node-desc">{exp.description}</p>
                <ul className="node-bullets">
                  {exp.achievements.map((ach, ai) => (
                    <li key={ai}>{ach}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Certifications & Achievements Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {/* Certifications Card */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <Award size={20} className="neon-cyan-text" />
                <h3 style={{ margin: 0, fontSize: '18px' }}>Official Certifications</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {certificates.map((cert, ci) => (
                  <div key={ci} style={{ background: 'rgba(255,255,255,0.04)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>{cert.title}</div>
                    <div style={{ fontSize: '13px', color: '#00f0ff', marginTop: '4px' }}>{cert.issuer} • {cert.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements Card */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <Sparkles size={20} className="green-text" />
                <h3 style={{ margin: 0, fontSize: '18px' }}>Competitive Coding Badges</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {achievements.map((ach, ai) => (
                  <div key={ai} style={{ background: 'rgba(255,255,255,0.04)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#00ff88' }}>{ach.title}</div>
                    <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px' }}>{ach.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= CONTACT ================= */}
        <section id="contact" className="section-block">
          <div className="section-title-wrap">
            <span className="section-eyebrow">Connect</span>
            <h2 className="section-heading">Initiate Contact</h2>
          </div>

          <div className="contact-grid">
            <div className="contact-direct-card glass-panel">
              <h3>Let's build something remarkable</h3>
              <p>
                Interested in discussing software engineering opportunities, full-stack projects, or data analytics? Reach out directly via email, phone, or LinkedIn.
              </p>

              <div className="email-copy-box">
                <Mail size={18} className="neon-cyan-text" />
                <span className="email-text">{personal.socials.email}</span>
                <button onClick={handleCopyEmail} className="copy-btn" title="Copy Email">
                  {copiedEmail ? <Check size={16} className="green-text" /> : <Copy size={16} />}
                </button>
              </div>

              <div className="email-copy-box" style={{ marginTop: '12px' }}>
                <Phone size={18} className="neon-cyan-text" />
                <span className="email-text">{personal.socials.phone}</span>
                <button onClick={handleCopyPhone} className="copy-btn" title="Copy Phone">
                  {copiedPhone ? <Check size={16} className="green-text" /> : <Copy size={16} />}
                </button>
              </div>

              <div className="social-badges-row" style={{ marginTop: '20px' }}>
                <a href={personal.socials.linkedin} target="_blank" rel="noopener noreferrer" className="social-pill">
                  <LinkedinIcon size={16} />
                  <span>LinkedIn Profile</span>
                </a>
                <a href={personal.socials.github} target="_blank" rel="noopener noreferrer" className="social-pill">
                  <GithubIcon size={16} />
                  <span>GitHub (@kailashagrwl)</span>
                </a>
              </div>
            </div>

            <div className="contact-form-card glass-panel">
              <h3>Direct Transmission</h3>
              {formSent ? (
                <div className="form-success-state">
                  <Sparkles size={32} className="neon-cyan-text" />
                  <h4>Signal Received!</h4>
                  <p>Thanks for reaching out, Kailash will get back to you shortly.</p>
                  <button onClick={() => setFormSent(false)} className="btn-secondary-glass">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="contact-form">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name / Recruiter Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Discussing full-stack or software engineering roles, project collaboration..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn-primary-glow full-width">
                    <span>Send Message</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="portfolio-2d-footer">
        <div className="footer-content">
          <div>
            © {new Date().getFullYear()} {personal.name}. Computer Science & Engineering, Lovely Professional University.
          </div>
          <div className="footer-links">
            <button onClick={onReturnToGame} className="footer-link-btn">
              🎮 Return to 3D Game World
            </button>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="footer-link-btn">
              <ChevronUp size={16} />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
