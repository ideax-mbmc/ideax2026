import React, { useState, useEffect, useRef } from 'react'
import { organizingTeam } from '../utils/membersData'
import MobileVirtualKeys from './MobileVirtualKeys'

export default function Members({ outputRef, onReturn }) {
  const [typedPrompt, setTypedPrompt] = useState('')
  const [introDone, setIntroDone] = useState(false)
  const [expanded, setExpanded] = useState({
    'advisory-board': false,
    'steering-committee': false,
    'student-advisor-team': false,
    'mentors': false,
    'core-team': false,
    'co-lead-team': true,
    'general-management-team': true,
    'development-team': true,
    'technical-team': true,
    'documentation-team': true,
    'design-team': true,
    'content-creation-team': true,
    'outreach-team': true,
    'sponsorship-team': true,
    'logistics-team': true,
    'media-team': true,
  })

  const outputRefLatest = useRef(outputRef)

  useEffect(() => {
    outputRefLatest.current = outputRef
  }, [outputRef])

  const expandAll = () => {
    setExpanded({
      'advisory-board': true,
      'steering-committee': true,
      'student-advisor-team': true,
      'mentors': true,
      'core-team': true,
      'co-lead-team': true,
      'general-management-team': true,
      'development-team': true,
      'technical-team': true,
      'documentation-team': true,
      'design-team': true,
      'content-creation-team': true,
      'outreach-team': true,
      'sponsorship-team': true,
      'logistics-team': true,
      'media-team': true,
    })
  }

  const collapseAll = () => {
    setExpanded({
      'advisory-board': false,
      'steering-committee': false,
      'student-advisor-team': false,
      'mentors': false,
      'core-team': false,
      'co-lead-team': false,
      'general-management-team': false,
      'development-team': false,
      'technical-team': false,
      'documentation-team': false,
      'design-team': false,
      'content-creation-team': false,
      'outreach-team': false,
      'sponsorship-team': false,
      'logistics-team': false,
      'media-team': false,
    })
  }

  // Key listener for exiting with Q, Esc, Ctrl+C, Ctrl+Z or expand/collapse with E / C
  useEffect(() => {
    const handleKey = (e) => {
      const isCtrlZ = e.ctrlKey && e.key.toLowerCase() === 'z'
      const isCtrlC = e.ctrlKey && e.key.toLowerCase() === 'c'
      const isEscape = e.key === 'Escape'
      const isQ = e.key.toLowerCase() === 'q' && !e.ctrlKey && !e.altKey && !e.metaKey
      if (isCtrlZ || isCtrlC || isEscape || isQ) {
        e.preventDefault()
        e.stopPropagation()
        if (onReturn) {
          onReturn()
        }
        return
      }

      if (!e.ctrlKey && !e.altKey && !e.metaKey) {
        if (e.key.toLowerCase() === 'e') {
          e.preventDefault()
          expandAll()
        } else if (e.key.toLowerCase() === 'c') {
          e.preventDefault()
          collapseAll()
        }
      }
    }
    document.addEventListener('keydown', handleKey, true)
    return () => document.removeEventListener('keydown', handleKey, true)
  }, [onReturn])

  // Typewriter intro animation
  useEffect(() => {
    const targetText = 'organizing team'
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      setTypedPrompt(targetText)
      setIntroDone(true)
      return
    }

    let i = 0
    let current = ''
    const intervalId = setInterval(() => {
      if (i < targetText.length) {
        current += targetText[i]
        setTypedPrompt(current)
        i++
      } else {
        clearInterval(intervalId)
        setTimeout(() => {
          setIntroDone(true)
        }, 150)
      }
    }, 45)

    return () => clearInterval(intervalId)
  }, [])

  // Auto-scroll when expanding folders
  const scrollToBottom = () => {
    const ref = outputRefLatest.current
    const el = ref && ref.current ? ref.current : ref
    if (el && el.scrollTo) {
      requestAnimationFrame(() => {
        if (el) el.scrollTop = el.scrollHeight
      })
    }
  }

  useEffect(() => {
    if (introDone) {
      scrollToBottom()
    }
  }, [expanded, introDone])

  const toggleDir = (id) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const isFullscreen = !!onReturn

  return (
    <div className={isFullscreen ? 'tlog-fullscreen' : 'tlog-stream'}>
      <div className="tlog-stream tree-container">
        {/* Typewriter Prompt */}
        <div className="tree-row">
          <span className="tree-line">guest@ideax:~$ </span>
          <span className="tree-text-content">
            {typedPrompt}
            {!introDone && <span className="tlog-cursor" aria-hidden="true" />}
          </span>
        </div>

        {introDone && (
          <>
            <div className="tlog-blank" />
            <div className="tree-row" style={{ color: 'var(--accent3)', fontWeight: 'bold' }}>
              IDEAX 2026 :: ORGANIZING TEAM
            </div>
            <div className="tree-row" style={{ color: 'var(--faint)', fontSize: '0.9em' }}>
              status: ONLINE · directory: /ORGANIZING_TEAM · access: PUBLIC
            </div>
            <div className="tlog-blank" />

            <div className="tree-actions" style={{ display: 'flex', gap: '14px', marginBottom: '10px', fontSize: '0.85em' }}>
              <button type="button" className="cmd-link" onClick={expandAll}>[+ Expand All]</button>
              <button type="button" className="cmd-link" onClick={collapseAll}>[- Collapse All]</button>
            </div>

            {/* Tree Root */}
            <div className="tree-row">
              <span className="tree-line">ORGANIZING_TEAM/</span>
            </div>
            <div className="tree-row">
              <span className="tree-line">│</span>
            </div>

            {/* Folders */}
            {organizingTeam.map((dir, dirIdx) => {
              const isLastDir = dirIdx === organizingTeam.length - 1
              const folderPrefix = isLastDir ? "└── " : "├── "
              const topGuide = isLastDir ? "    " : "│   "
              const isExpanded = !!expanded[dir.id]

              return (
                <div key={dir.id} className="tree-folder">
                  <div className="tree-row">
                    <button
                      type="button"
                      className="tree-folder-btn"
                      onClick={() => toggleDir(dir.id)}
                      aria-expanded={isExpanded}
                      aria-label={`Toggle ${dir.name} directory, currently ${isExpanded ? 'expanded' : 'collapsed'}`}
                    >
                      <span className="tree-line">{folderPrefix}</span>
                      <span className="tree-text-content">
                        <span className="tree-folder-name">{dir.name}/</span>
                      </span>
                    </button>
                  </div>

                  <div className={`directory-content ${isExpanded ? 'expanded' : ''}`} aria-hidden={!isExpanded}>
                    <div className="directory-inner">
                      {/* Direct Members */}
                      {dir.members && dir.members.map((member, memIdx) => {
                        const isLastMember = memIdx === dir.members.length - 1
                        const memberConnector = isLastMember ? "└── " : "├── "
                        const memberPrefix = topGuide + memberConnector

                        return (
                          <div key={member.name} className="member-group">
                            <div className="tree-row">
                              <span className="tree-line">{memberPrefix}</span>
                              <span className="tree-text-content">
                                {member.url ? (
                                  <a
                                    href={member.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="member-name member-link"
                                  >
                                    {member.name}
                                  </a>
                                ) : (
                                  <span className="member-name">{member.name}</span>
                                )}
                              </span>
                            </div>
                          </div>
                        )
                      })}

                      {/* Sub-teams (CORE_TEAM) */}
                      {dir.subTeams && (
                        <>
                          <div className="tree-row">
                            <span className="tree-line">{topGuide}│</span>
                          </div>
                          {dir.subTeams.map((subTeam, subIdx) => {
                            const isLastSubTeam = subIdx === dir.subTeams.length - 1
                            const subTeamPrefix = topGuide + (isLastSubTeam ? "└── " : "├── ")
                            const subTeamGuide = topGuide + (isLastSubTeam ? "    " : "│   ")
                            const isSubExpanded = expanded[subTeam.id] !== false

                            return (
                              <div key={subTeam.id} className="tree-subfolder">
                                <div className="tree-row">
                                  <button
                                    type="button"
                                    className="tree-folder-btn"
                                    onClick={() => toggleDir(subTeam.id)}
                                    aria-expanded={isSubExpanded}
                                    aria-label={`Toggle ${subTeam.name} sub-directory, currently ${isSubExpanded ? 'expanded' : 'collapsed'}`}
                                  >
                                    <span className="tree-line">{subTeamPrefix}</span>
                                    <span className="tree-text-content">
                                      <span className="tree-folder-name">{subTeam.name}/</span>
                                    </span>
                                  </button>
                                </div>

                                <div className={`directory-content ${isSubExpanded ? 'expanded' : ''}`} aria-hidden={!isSubExpanded}>
                                  <div className="directory-inner">
                                    {subTeam.members && subTeam.members.map((subMember, subMemIdx) => {
                                      const isLastSubMember = subMemIdx === subTeam.members.length - 1
                                      const subMemberConnector = isLastSubMember ? "└── " : "├── "
                                      const subMemberPrefix = subTeamGuide + subMemberConnector

                                      return (
                                        <div key={subMember.name} className="member-group">
                                          <div className="tree-row">
                                            <span className="tree-line">{subMemberPrefix}</span>
                                            <span className="tree-text-content">
                                              {subMember.url ? (
                                                <a
                                                  href={subMember.url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="member-name member-link"
                                                >
                                                  {subMember.name}
                                                </a>
                                              ) : (
                                                <span className="member-name">{subMember.name}</span>
                                              )}
                                            </span>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>

                                {/* Spacer line between sub-teams if not last */}
                                {!isLastSubTeam && (
                                  <div className="tree-row">
                                    <span className="tree-line">{topGuide}│</span>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </>
                      )}

                      {/* Spacer line after folder content if not last top directory */}
                      {!isLastDir && (
                        <div className="tree-row">
                          <span className="tree-line">│</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="tlog-blank" />
            <div className="tree-row" style={{ color: 'var(--faint)', fontSize: '0.85em' }}>
              <span className="tree-line">$ tree complete // ORGANIZING TEAM LOADED // IDEAX 2026</span>
              <span className="tlog-cursor" aria-hidden="true" />
            </div>
          </>
        )}
      </div>

      {isFullscreen && (
        <div className="tlog-status-bar">
          <div style={{ paddingBottom: '4px' }}>
            <span className="standout"> tree view (press q to quit · click folders to expand · [e] expand all · [c] collapse all) </span>
          </div>
          <MobileVirtualKeys />
        </div>
      )}
    </div>
  )
}