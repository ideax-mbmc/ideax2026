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
    'core-team': false,
  })

  const outputRefLatest = useRef(outputRef)

  useEffect(() => {
    outputRefLatest.current = outputRef
  }, [outputRef])

  // Key listener for exiting with Q or Ctrl+Z
  useEffect(() => {
    const handleKey = (e) => {
      const isCtrlZ = e.ctrlKey && e.key.toLowerCase() === 'z'
      const isQ = e.key.toLowerCase() === 'q' && !e.ctrlKey && !e.altKey && !e.metaKey
      if (isCtrlZ || isQ) {
        e.preventDefault()
        e.stopPropagation()
        if (onReturn) {
          onReturn()
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
              status: ONLINE · directory: /IDEAX_2026/ORGANIZING_TEAM · access: PUBLIC
            </div>
            <div className="tlog-blank" />

            {/* Tree Root */}
            <div className="tree-row">
              <span className="tree-line">IDEAX_2026/</span>
            </div>
            <div className="tree-row">
              <span className="tree-line">└── ORGANIZING_TEAM/</span>
            </div>

            {/* Folders */}
            {organizingTeam.map((dir, dirIdx) => {
              const isLastDir = dirIdx === organizingTeam.length - 1
              const folderPrefix = isLastDir ? "    └── " : "    ├── "
              const childrenGuide = isLastDir ? "        " : "    │   "
              const isExpanded = expanded[dir.id]

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
                      {dir.members.map((member, memIdx) => {
                        const isLastMember = memIdx === dir.members.length - 1
                        const memberConnector = isLastMember ? "└── " : "├── "
                        const memberPrefix = childrenGuide + memberConnector
                        
                        // Prefix for sub-info guides
                        const subInfoGuide = childrenGuide + (isLastMember ? "    " : "│   ")
                        
                        const subInfo = []
                        if (member.program) subInfo.push({ key: 'program', val: member.program })
                        if (member.role) subInfo.push({ key: 'role', val: member.role })

                        return (
                          <div key={member.name} className="member-group">
                            <div className="tree-row">
                              <span className="tree-line">{memberPrefix}</span>
                              <span className="tree-text-content">
                                <span className="member-name">{member.name}</span>
                              </span>
                            </div>

                            {subInfo.map((info, infoIdx) => {
                              const isLastInfo = infoIdx === subInfo.length - 1
                              const infoConnector = isLastInfo ? "└── " : "├── "
                              const infoPrefix = subInfoGuide + infoConnector

                              return (
                                <div key={info.key} className="tree-row">
                                  <span className="tree-line">{infoPrefix}</span>
                                  <span className="tree-text-content">
                                    <span className="info-key">{info.key}: </span>
                                    <span className="info-val">{info.val}</span>
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        )
                      })}
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
            <span className="standout"> tree view (press q to quit · click folders to expand/collapse) </span>
          </div>
          <MobileVirtualKeys />
        </div>
      )}
    </div>
  )
}