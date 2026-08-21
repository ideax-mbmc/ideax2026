import React, { useEffect, useRef } from 'react'
import './Conduct.css'
import MobileVirtualKeys from './MobileVirtualKeys'

export default function Conduct({ onRunCommand, onReturn }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (onReturn) {
      const handleKeyDown = (e) => {
        const el = containerRef.current
        if (!el) return
        
        const pageAmount = el.clientHeight * 0.8
        const lineAmount = 40

        switch (e.key) {
          case 'q':
          case 'Q':
          case 'Escape':
            onReturn()
            break
          case 'j':
          case 'ArrowDown':
            el.scrollTop += lineAmount
            e.preventDefault()
            break
          case 'k':
          case 'ArrowUp':
            el.scrollTop -= lineAmount
            e.preventDefault()
            break
          case ' ':
          case 'PageDown':
            el.scrollTop += pageAmount
            e.preventDefault()
            break
          case 'b':
          case 'PageUp':
            el.scrollTop -= pageAmount
            e.preventDefault()
            break
          case 'g':
            el.scrollTop = 0
            break
          case 'G':
            el.scrollTop = el.scrollHeight
            break
          default:
            break
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      // Auto focus container to ensure keys are captured if we use tabIndex, but window listener is better.
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onReturn])

  const isFullscreen = !!onReturn

  return (
    <div 
      className={isFullscreen ? 'fullscreen-man' : 'card conduct-card-wrapper'} 
      ref={containerRef}
      tabIndex={isFullscreen ? 0 : -1}
    >
      <div className={isFullscreen ? 'man-content-wrapper' : ''}>
        {!isFullscreen && <h3>code-of-conduct.md</h3>}

      <div className="man-header">
        <span>CONDUCT(1)</span>
        <span className="man-title-center">IdeaX 2026 Manual</span>
        <span>CONDUCT(1)</span>
      </div>

      <div className="man-body">
        <section className="man-section">
          <h4 className="man-heading">NAME</h4>
          <p className="man-indent">
            <strong className="strong">conduct</strong> &mdash; MBMC IdeaX 2026 Code of Conduct &amp; Hackathon Guidelines
          </p>
        </section>

        <section className="man-section">
          <h4 className="man-heading">SYNOPSIS</h4>
          <div className="man-indent">
            <span className="accent">conduct</span> [<em>SECTION...</em>]<br />
            <span className="accent">cat code-of-conduct.md</span>
          </div>
        </section>

        <section className="man-section">
          <h4 className="man-heading">DESCRIPTION</h4>
          <p className="man-indent">
            At <strong className="strong">IdeaX</strong>, we believe in building a community rooted in respect,
            inclusivity, and collaboration. IdeaX is committed to providing a safe, welcoming, and harassment-free environment for all participants, mentors, sponsors, partners, volunteers, and judges across all official online and physical spaces.
          </p>
        </section>

        <section className="man-section">
          <h4 className="man-heading">SECTION 1: SCOPE &amp; COMMITMENT</h4>
          <div className="man-indent">
            <p style={{ marginBottom: '6px' }}>
              <strong className="strong">Scope of Application:</strong> Applies to all participants, mentors, sponsors, partners, volunteers, judges, and anyone affiliated with IdeaX across all official online and physical spaces.
            </p>
            <p>
              <strong className="strong">Our Commitment:</strong> IdeaX is committed to providing a harassment-free experience for everyone, regardless of gender identity, sexual orientation, disability, age, or tech background.
            </p>
          </div>
        </section>

        <section className="man-section">
          <h4 className="man-heading">SECTION 2: EXPECTED BEHAVIOUR</h4>
          <ul className="man-list">
            <li><strong className="strong">Respectful Interaction:</strong> Be respectful of others' opinions, work, and personal space.</li>
            <li><strong className="strong">Inclusive Language:</strong> Use inclusive language and maintain professionalism at all times.</li>
            <li><strong className="strong">Collaboration:</strong> Embrace diverse ideas and interdisciplinary collaboration.</li>
            <li><strong className="strong">Event Rules:</strong> Respect event schedules, deadlines, and community guidelines.</li>
            <li><strong className="strong">Privacy:</strong> Seek consent before photographing or recording others.</li>
          </ul>
        </section>

        <section className="man-section">
          <h4 className="man-heading">SECTION 3: PROHIBITED CONDUCT (ZERO TOLERANCE)</h4>
          <ul className="man-list man-warning-list">
            <li><strong className="strong">Harassment:</strong> Verbal abuse, intimidation, or unwelcome advances in any form.</li>
            <li><strong className="strong">Discrimination:</strong> Offensive speech, discriminatory visuals, or inappropriate gestures.</li>
            <li><strong className="strong">Academic Dishonesty:</strong> Plagiarism or misrepresentation of work.</li>
            <li><strong className="strong">Substance Policy:</strong> Intoxication or possession of illegal substances on premises.</li>
            <li><strong className="strong">Disruption:</strong> Sabotaging, disrupting, or intimidating fellow participants.</li>
          </ul>
        </section>

        <section className="man-section">
          <h4 className="man-heading">SECTION 4: ELIGIBILITY &amp; TEAM RULES</h4>
          <ul className="man-list">
            <li><strong className="strong">Age Limit:</strong> Open to students and young innovators between <strong className="strong">18 and 26 years of age</strong>.</li>
            <li><strong className="strong">Team Size:</strong> Teams must consist of <strong className="strong">2 to 4 members</strong> (interdisciplinary teams encouraged).</li>
            <li><strong className="strong">Single Team Entry:</strong> Each individual may participate in only one team.</li>
            <li><strong className="strong">Verification:</strong> Valid photo ID (e.g. student ID) required upon request.</li>
          </ul>
        </section>

        <section className="man-section">
          <h4 className="man-heading">SECTION 5: PROJECT &amp; SUBMISSIONS</h4>
          <ul className="man-list">
            <li><strong className="strong">Fresh Code:</strong> All submissions must be initiated and completed during the official event timeline.</li>
            <li><strong className="strong">No Pre-made Work:</strong> No code or final assets may be created beforehand (sketching &amp; planning allowed).</li>
            <li><strong className="strong">Ethics:</strong> Projects must respect ethical standards and avoid violence or hate speech.</li>
            <li><strong className="strong">Presentation:</strong> At least one team member must present during the final showcase.</li>
          </ul>
        </section>

        <section className="man-section">
          <h4 className="man-heading">SECTION 6: REPORTING &amp; CONTACT</h4>
          <div className="man-indent">
            <p style={{ marginBottom: '8px' }}>
              Report issues immediately to organizing committee members (recognized by official IdeaX badges &amp; T-shirts). Violations may result in verbal warnings, disqualification, or removal.
            </p>
            <div className="man-contact-box">
              <span className="man-contact-title">ORGANIZING COMMITTEE HOTLINE:</span>
              <div className="man-contact-row">
                <span>Krishna Adhikari:</span> <a href="tel:+9779842362679">+977-984-2362679</a>
              </div>
              <div className="man-contact-row">
                <span>Krijal Paneru:</span> <a href="tel:+9779744289830">+977-974-4289830</a>
              </div>
            </div>
          </div>
        </section>

        <section className="man-section">
          <h4 className="man-heading">SEE ALSO</h4>
          <div className="man-indent">
            {onRunCommand ? (
              <>
                <button type="button" className="cmd-link" onClick={(e) => { e.stopPropagation(); onRunCommand('about') }}>about(1)</button>,{' '}
                <button type="button" className="cmd-link" onClick={(e) => { e.stopPropagation(); onRunCommand('participation') }}>participation(1)</button>,{' '}
                <button type="button" className="cmd-link" onClick={(e) => { e.stopPropagation(); onRunCommand('tracks') }}>tracks(1)</button>,{' '}
                <button type="button" className="cmd-link" onClick={(e) => { e.stopPropagation(); onRunCommand('register') }}>register(1)</button>,{' '}
                <button type="button" className="cmd-link" onClick={(e) => { e.stopPropagation(); onRunCommand('contact') }}>contact(1)</button>
              </>
            ) : (
              'about(1), participation(1), tracks(1), register(1), contact(1)'
            )}
          </div>
        </section>
      </div>

      <div className="man-footer">
        <span>MBMC IdeaX 2026</span>
        <span>August 2026</span>
        <span>CONDUCT(1)</span>
      </div>
      </div>

      {isFullscreen && (
        <div className="man-status-bar">
          <div style={{ paddingBottom: '4px' }}>
            <span className="standout"> Manual page conduct(1) line 1 (press q to quit) </span>
          </div>
          <MobileVirtualKeys />
        </div>
      )}
    </div>
  )
}


