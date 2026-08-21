import React, { useState, useEffect } from 'react'
import { COMMANDS } from '../utils/terminalData'

export default function CommandLine({ inputRef, history, onRunCommand, onAppendText }) {
  const [val, setVal] = useState('')
  const [histIndex, setHistIndex] = useState(-1)

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Don't interfere if they are using modifiers (Ctrl, Alt, Meta)
      if (e.ctrlKey || e.altKey || e.metaKey) return

      // Don't interfere if another handler already consumed this event
      if (e.defaultPrevented) return

      // Don't interfere if a focusable element is already active
      const active = document.activeElement
      if (active) {
        const activeTag = active.tagName.toLowerCase()
        if (
          activeTag === 'input' ||
          activeTag === 'textarea' ||
          activeTag === 'button' ||
          activeTag === 'a' ||
          activeTag === 'select' ||
          active.isContentEditable ||
          active.getAttribute('tabindex') !== null
        ) return
      }

      // If the key is a printable character (length === 1) or Backspace/Enter
      if (e.key.length === 1 || e.key === 'Backspace') {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }
    }

    // Use capture phase to catch the event before it reaches other elements
    window.addEventListener('keydown', handleGlobalKeyDown, true)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown, true)
  }, [inputRef])

  const handleSubmit = (e) => {
    e.preventDefault()
    const commandToRun = val
    setVal('')
    setHistIndex(-1)
    onRunCommand(commandToRun)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      let newIdx
      if (histIndex === -1) {
        newIdx = history.length - 1
      } else {
        newIdx = Math.max(0, histIndex - 1)
      }
      setHistIndex(newIdx)
      setVal(history[newIdx] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIndex === -1) return
      const newIdx = histIndex + 1
      if (newIdx >= history.length) {
        setHistIndex(-1)
        setVal('')
      } else {
        setHistIndex(newIdx)
        setVal(history[newIdx] || '')
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const search = val.toLowerCase().trim()
      if (!search) return
      const matches = COMMANDS.filter(c => c.startsWith(search))
      if (matches.length === 1) {
        setVal(matches[0] + ' ')
      } else if (matches.length > 1) {
        onAppendText(matches.join('  '), 'faint')
      }
    }
  }

  return (
    <form className="inputline" onSubmit={handleSubmit} autoComplete="off">
      <span className="prompt">guest@ideax:~$</span>
      <input
        ref={inputRef}
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck="false"
        aria-label="terminal command input"
        placeholder="type 'help' and press enter…"
      />
    </form>
  )
}
