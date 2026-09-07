import React, { useState } from 'react';
import { portfolioData } from '../../data/portfolio';
import { soundManager } from '../../audio/soundManager';
import {
  X,
  ExternalLink,
  Mail,
  Copy,
  Check,
  Terminal,
  Briefcase,
  GraduationCap,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from './SocialIcons';

export function InteractionModal({ zone, onClose, onSwitchTo2D }) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [projectCategory, setProjectCategory] = useState('All');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  if (!zone) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolioData.personal.socials.email);
    setCopiedEmail(true);
    soundManager.playClick();
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    soundManager.playClick();
    setFormSent(true);
  };

  const filteredProjects = projectCategory === 'All'
    ? portfolioData.projects
    : portfolioData.projects.filter(p => p.category.includes(projectCategory));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-window glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ borderColor: `${zone.color}66`, boxShadow: `0 0 40px ${zone.color}33` }}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-meta">
            <span className="zone-pill" style={{ backgroundColor: `${zone.color}22`, color: zone.color, borderColor: zone.color }}>
              {zone.subtitle}
            </span>
            <h2 className="modal-title">{zone.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            title="Close [Esc]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-body custom-scrollbar">

          {/* ================= SPAWN BRIEFING ================= */}
          {zone.id === 'spawn' && (
            <div className="zone-content spawn-view">
              <div className="briefing-card">
                <h3>Welcome to the Virtual Island Campus</h3>
                <p>{portfolioData.personal.bio}</p>
                <div className="hero-stats-grid">
                  {portfolioData.personal.stats.map((st, i) => (
                    <div key={i} className="stat-card">
                      <div className="stat-val">{st.value}</div>
                      <div className="stat-lbl">{st.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="guide-stations-grid">
                <h4>Island Destinations</h4>
                <div className="stations-list">
                  {portfolioData.zones.filter(z => z.id !== 'spawn').map((z) => (
                    <div key={z.id} className="station-item">
                      <span className="station-dot" style={{ backgroundColor: z.color }} />
                      <div className="station-info">
                        <strong>{z.title}</strong>: {z.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= ABOUT PAVILION ================= */}
          {zone.id === 'about' && (
            <div className="zone-content about-view">
              <div className="about-profile-header">
                <div className="profile-badge-glow">
                  <div className="profile-initials">KA</div>
                </div>
                <div className="profile-text">
                  <h3>{portfolioData.personal.name}</h3>
                  <p className="profile-subtitle">{portfolioData.personal.title}</p>
                  <p className="profile-location">📍 {portfolioData.personal.location} • <span className="green-status">{portfolioData.personal.status}</span></p>
                </div>
              </div>

              <div className="about-bio-card">
                <h4>Core Philosophy & Background</h4>
                <p>{portfolioData.personal.bio}</p>
                <p>
                  I believe the web should be an adventurous, tactile medium rather than an endless parade of static grey grids. By fusing robust engineering principles with game-engine sensibilities, I help teams stand out in competitive digital landscapes.
                </p>
              </div>

              <div className="about-education-card">
                <div className="card-header-icon">
                  <GraduationCap size={18} className="neon-violet-text" />
                  <h4>Education & Honors</h4>
                </div>
                {portfolioData.education.map((ed, idx) => (
                  <div key={idx} className="education-entry">
                    <div className="ed-degree">{ed.degree}</div>
                    <div className="ed-inst">{ed.institution} • {ed.period}</div>
                    <div className="ed-honors">🎖️ {ed.honors}</div>
                    <div className="ed-focus">Focus: {ed.focus}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= PROJECTS LAB ================= */}
          {zone.id === 'projects' && (
            <div className="zone-content projects-view">
              {/* Category Filter Pills */}
              <div className="category-filter-bar">
                {['All', 'Full-Stack', 'Data Analytics', 'Machine Learning'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProjectCategory(cat)}
                    className={`cat-pill ${projectCategory === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Projects Grid */}
              <div className="projects-cards-grid">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="project-card">
                    <div
                      className="project-visual-header"
                      style={{ background: project.gradient }}
                    >
                      <span className="project-category-tag">{project.tag}</span>
                      <Terminal size={32} className="project-visual-icon" />
                    </div>
                    <div className="project-card-body">
                      <h4>{project.title}</h4>
                      <p className="project-desc">{project.description}</p>

                      <div className="project-highlights-list">
                        {project.highlights.map((h, i) => (
                          <div key={i} className="highlight-item">
                            <span className="bullet">▹</span>
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>

                      {/* Tech stack badges */}
                      <div className="tech-badge-row">
                        {project.tech.map((t, i) => (
                          <span key={i} className="tech-badge">{t}</span>
                        ))}
                      </div>

                      {/* Links */}
                      <div className="project-action-links">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-btn secondary"
                        >
                          <GithubIcon size={15} />
                          <span>Code Repository</span>
                        </a>
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-btn primary"
                        >
                          <ExternalLink size={15} />
                          <span>Live Demo</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SKILLS ARENA ================= */}
          {zone.id === 'skills' && (
            <div className="zone-content skills-view">
              <p className="skills-intro">
                A quantitative overview of technical disciplines, production frameworks, and architecture patterns honed over 5+ years.
              </p>
              <div className="skills-category-grid">
                {portfolioData.skills.map((cat, idx) => (
                  <div key={idx} className="skill-cat-card">
                    <div className="skill-cat-header" style={{ borderBottomColor: `${cat.color}44` }}>
                      <Zap size={16} style={{ color: cat.color }} />
                      <h4 style={{ color: cat.color }}>{cat.category}</h4>
                    </div>
                    <div className="skill-meters-list">
                      {cat.items.map((skill, si) => (
                        <div key={si} className="skill-meter-row">
                          <div className="skill-meter-labels">
                            <span className="skill-name">{skill.name}</span>
                            <span className="skill-exp">{skill.exp} • {skill.level}%</span>
                          </div>
                          <div className="skill-meter-track">
                            <div
                              className="skill-meter-fill"
                              style={{ width: `${skill.level}%`, backgroundColor: cat.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= EXPERIENCE / TRAINING & CERTIFICATES ================= */}
          {zone.id === 'experience' && (
            <div className="zone-content experience-view">
              {/* Summer Training */}
              <h4 style={{ color: '#f59e0b', marginBottom: '12px', fontSize: '16px' }}>Academic & Industrial Training</h4>
              <div className="timeline-container">
                {portfolioData.experience.map((exp, idx) => (
                  <div key={idx} className="timeline-card">
                    <div className="timeline-marker" />
                    <div className="timeline-content">
                      <div className="timeline-meta">
                        <span className="timeline-period">{exp.period}</span>
                        <span className="timeline-location">{exp.location}</span>
                      </div>
                      <h4 className="timeline-role">{exp.role}</h4>
                      <h5 className="timeline-company">{exp.company}</h5>
                      <p className="timeline-desc">{exp.description}</p>
                      <ul className="timeline-achievements">
                        {exp.achievements.map((ach, ai) => (
                          <li key={ai}>{ach}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Certifications */}
              <h4 style={{ color: '#00f0ff', marginTop: '24px', marginBottom: '12px', fontSize: '16px' }}>Verified Certifications</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {portfolioData.certificates.map((cert, ci) => (
                  <div key={ci} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.25)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#f8fafc' }}>{cert.title}</div>
                    <div style={{ fontSize: '12px', color: '#00f0ff', marginTop: '3px' }}>{cert.issuer} • {cert.date}</div>
                  </div>
                ))}
              </div>

              {/* Achievements */}
              <h4 style={{ color: '#00ff88', marginBottom: '12px', fontSize: '16px' }}>Key Competitive Programming Achievements</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                {portfolioData.achievements.map((ach, ai) => (
                  <div key={ai} style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(0, 255, 136, 0.25)', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#00ff88' }}>{ach.title}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '3px' }}>{ach.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= CONTACT RELAY ================= */}
          {zone.id === 'contact' && (
            <div className="zone-content contact-view">
              <div className="contact-two-column">
                {/* Left col: quick channels */}
                <div className="contact-channels-card">
                  <h4>Direct Coordinates</h4>
                  <p>Reach out directly for software engineering roles, full-stack projects, or data analytics collaborations.</p>

                  <div className="email-copy-box">
                    <Mail size={18} className="neon-cyan-text" />
                    <span className="email-text">{portfolioData.personal.socials.email}</span>
                    <button
                      onClick={handleCopyEmail}
                      className="copy-btn"
                      title="Copy email to clipboard"
                    >
                      {copiedEmail ? <Check size={16} className="green-text" /> : <Copy size={16} />}
                    </button>
                  </div>

                  <div className="email-copy-box" style={{ marginTop: '10px' }}>
                    <span style={{ fontSize: '14px' }}>📱</span>
                    <span className="email-text">{portfolioData.personal.socials.phone}</span>
                    <a
                      href={`tel:${portfolioData.personal.socials.phone}`}
                      className="copy-btn"
                      title="Call directly"
                      style={{ color: '#00f0ff', fontSize: '12px', fontWeight: 600 }}
                    >
                      Call
                    </a>
                  </div>

                  <div className="socials-pill-row">
                    <a
                      href={portfolioData.personal.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-pill"
                    >
                      <LinkedinIcon size={16} />
                      <span>LinkedIn Profile</span>
                    </a>
                    <a
                      href={portfolioData.personal.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-pill"
                    >
                      <GithubIcon size={16} />
                      <span>GitHub (@kailashagrwl)</span>
                    </a>
                  </div>
                </div>

                {/* Right col: working interactive form */}
                <div className="contact-form-card">
                  <h4>Transmit Message</h4>
                  {formSent ? (
                    <div className="form-success-banner">
                      <Sparkles size={24} className="neon-cyan-text" />
                      <h5>Message Transmitted!</h5>
                      <p>Thank you for reaching out. I usually reply within 24 hours.</p>
                      <button
                        onClick={() => setFormSent(false)}
                        className="btn-secondary-glass"
                      >
                        Send Another Signal
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="contact-form">
                      <div className="form-group">
                        <label>Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Alex Mercer"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Your Email</label>
                        <input
                          type="email"
                          required
                          placeholder="alex@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Message / Project Scope</label>
                        <textarea
                          rows={4}
                          required
                          placeholder="Tell me about your project, timeline, or opportunity..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                      </div>
                      <button type="submit" className="btn-primary-glow full-width">
                        <span>Send Transmission</span>
                        <ArrowRight size={16} />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary-glass">
            Back to Game [Esc]
          </button>
          <button onClick={onSwitchTo2D} className="btn-accent-pill">
            <span>View Full 2D Portfolio</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
