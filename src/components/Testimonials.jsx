import React, { useState, useEffect, useRef } from 'react'
import { testimonials } from '../utils/testimonialsData'

export default function Testimonials({ outputRef, onReturn }) {
  const [lines, setLines] = useState([])

  // Holds the cancel function while the stream is running; null when done/idle
  const cancelRef = useRef(null)

  // Keep a stable pointer to the latest outputRef value for auto-scroll
  const outputRefLatest = useRef(outputRef)
  useEffect(() => { outputRefLatest.current = outputRef }, [outputRef])

  // ── Keyboard listener (Ctrl+Z or q) ─────────────────────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      if (!cancelRef.current) return // stream not running

      const isCtrlZ = e.ctrlKey && e.key === 'z'
      const isQ     = !e.ctrlKey && !e.altKey && !e.metaKey && e.key === 'q'
      if (!isCtrlZ && !isQ) return

      // Stop the event here so CommandLine's capture-phase focus-steal never fires
      e.preventDefault()
      e.stopPropagation()
      cancelRef.current(isQ ? 'q' : 'ctrl+z')
    }

    // Use capture:true so we run BEFORE CommandLine's global keydown capture handler
    document.addEventListener('keydown', handleKey, true)
    return () => document.removeEventListener('keydown', handleKey, true)
  }, []) // register once; cancelRef is always current

  // ── Stream effect ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    const timeoutIds = []

    const scheduleTimer = (fn, ms) => {
      const id = setTimeout(() => { if (!cancelled) fn() }, ms)
      timeoutIds.push(id)
      return id
    }

    const scrollToBottom = () => {
      const ref = outputRefLatest.current
      const el  = ref && ref.current ? ref.current : ref
      if (el && el.scrollTo) {
        requestAnimationFrame(() => { if (el) el.scrollTop = el.scrollHeight })
      }
    }

    const appendLine = (lineObj) => {
      if (cancelled) return
      setLines((prev) => [...prev, lineObj])
      scrollToBottom()
    }

    const pause = (ms) =>
      new Promise((resolve) => scheduleTimer(resolve, ms))

    const typeOut = (text, lineType, charDelay = 18) =>
      new Promise((resolve) => {
        if (cancelled) { resolve(); return }
        let i = 0
        let built = ''
        appendLine({ type: lineType, text: '' })

        const tick = () => {
          if (cancelled) { resolve(); return }
          if (i >= text.length) { resolve(); return }
          built += text[i++]
          setLines((prev) => {
            if (prev.length === 0) return prev
            const next = [...prev]
            next[next.length - 1] = { ...next[next.length - 1], text: built }
            return next
          })
          scrollToBottom()
          scheduleTimer(tick, charDelay)
        }

        scheduleTimer(tick, charDelay)
      })

    // Expose a cancel function to the keyboard handler
    cancelRef.current = (reason) => {
      if (cancelled) return
      cancelled = true
      timeoutIds.forEach(clearTimeout)
      cancelRef.current = null

      const isQ = reason === 'q'
      setLines((prev) => [
        ...prev,
        { type: 'log-blank' },
        {
          type: 'log-system',
          text: isQ
            ? '[SYSTEM] Quit signal received. Stream terminated.'
            : '[SYSTEM] SIGTSTP received. Stream suspended.',
        },
        { type: 'log-eof', text: '[EOF]    /var/log/testimonials.log' },
      ])
    }

    const run = async () => {
      await pause(300)
      if (cancelled) return

      appendLine({ type: 'log-info',  text: '[INFO]  Connection established. Tailing /var/log/testimonials.log\u2026' })
      appendLine({ type: 'log-hint',  text: '        Press Ctrl+Z to suspend \u00b7 q to quit' })
      appendLine({ type: 'log-blank' })

      for (let idx = 0; idx < testimonials.length; idx++) {
        if (cancelled) return
        const t  = testimonials[idx]
        const ts = new Date().toISOString().replace('T', ' ').slice(0, 19)

        await pause(200)
        if (cancelled) return
        appendLine({ type: 'log-stream', text: `[STREAM] ${ts}  ${t.name} \u2014 ${t.role}` })

        await pause(120)
        if (cancelled) return
        await typeOut(`\u201c${t.quote}\u201d`, 'log-quote', 18)

        if (idx < testimonials.length - 1) {
          await pause(500)
          if (cancelled) return
          appendLine({ type: 'log-blank' })
        }
      }

      await pause(600)
      if (cancelled) return

      cancelRef.current = null // stream done naturally — disable keyboard shortcut
      appendLine({ type: 'log-blank' })
      appendLine({ type: 'log-system', text: '[SYSTEM] Stream closed. End of file reached.' })
      appendLine({ type: 'log-eof',    text: '[EOF]    /var/log/testimonials.log' })
    }

    run()

    return () => {
      cancelled = true
      timeoutIds.forEach(clearTimeout)
      cancelRef.current = null
    }
  }, []) // StrictMode-safe: cancelled flag is local to each effect invocation

  return (
    <div className="tlog-stream">
      {lines.map((line, i) => {
        const isLastLine = i === lines.length - 1
        switch (line.type) {
          case 'log-blank':
            return <div key={i} className="tlog-blank" />
          case 'log-info':
            return <div key={i} className="tlog-line tlog-info">{line.text}</div>
          case 'log-hint':
            return <div key={i} className="tlog-line tlog-hint">{line.text}</div>
          case 'log-stream':
            return <div key={i} className="tlog-line tlog-header">{line.text}</div>
          case 'log-quote':
            return (
              <div key={i} className="tlog-line tlog-quote">
                {line.text}
                {isLastLine && <span className="tlog-cursor" aria-hidden="true" />}
              </div>
            )
          case 'log-system':
            return <div key={i} className="tlog-line tlog-system">{line.text}</div>
          case 'log-eof':
            return <div key={i} className="tlog-line tlog-eof">{line.text}</div>
          default:
            return null
        }
      })}
    </div>
  )
}
