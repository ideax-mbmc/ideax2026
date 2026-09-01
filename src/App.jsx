import React, { useState, useEffect, useRef, Suspense, lazy } from 'react'
import TitleBar from './components/TitleBar'
import OutputPane from './components/OutputPane'
import SuggestionChips from './components/SuggestionChips'
import CommandLine from './components/CommandLine'
import LoadingIntro from './components/LoadingIntro'
const AsciiWorld = lazy(() => import('./components/AsciiWorld'))
const Testimonials = lazy(() => import('./components/Testimonials'))
const Conduct = lazy(() => import('./components/Conduct'))
const Members = lazy(() => import('./components/Members'))
import { executeCommand } from './utils/commandHandler'
import { TRACKS, getDynamicTimeline } from './utils/terminalData'
import MobileVirtualKeys from './components/MobileVirtualKeys'

const getInitialLandingItems = () => [
  { type: 'TEXT', text: '[ok] mounting /tracks', cls: 'ok' },
  { type: 'TEXT', text: '[ok] mounting /timeline', cls: 'ok' },
  { type: 'TEXT', text: '[ok] starting register.service', cls: 'ok' },
  { type: 'TEXT', text: '[ok] loading fastfetch…', cls: 'ok' },
  { type: 'BLANK' },
  { type: 'FASTFETCH' },
  { type: 'BLANK' },
  { type: 'REGISTER_BANNER' },
  { type: 'BLANK' },
  { type: 'TEXT', text: 'welcome to MBMC IdeaX 2026.', cls: 'strong' },
  { type: 'TEXT', text: "type 'help' to see available commands, or click a suggestion below.", cls: 'dim' },
  { type: 'BLANK' }
]

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    try { return !sessionStorage.getItem('ideax_intro_seen') } catch (_) { return true }
  })
  const [view, setView] = useState('terminal')
  const [items, setItems] = useState([])
  const [history, setHistory] = useState([])
  const outputRef = useRef(null)
  const inputRef = useRef(null)
  const lastCommandRef = useRef({ cmd: '', time: 0 })

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const runBootSequence = (onDone) => {
    let isCancelled = false
    let timeoutIds = []

    setItems([])

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      document.body.classList.add('reduced-motion')
    }

    const bootTimer = setTimeout(() => {
      if (!isCancelled) document.body.classList.remove('boot')
    }, 950)
    timeoutIds.push(bootTimer)

    const bootLines = [
      ['[ok] mounting /tracks', 'ok'],
      ['[ok] mounting /timeline', 'ok'],
      ['[ok] starting register.service', 'ok'],
      ['[ok] loading fastfetch…', 'ok']
    ]

    let i = 0
    const step = () => {
      if (isCancelled) return
      if (i < bootLines.length) {
        const [text, cls] = bootLines[i]
        setItems(prev => [...prev, { type: 'TEXT', text, cls }])
        i++
        const t = setTimeout(step, reduced ? 0 : 130)
        timeoutIds.push(t)
      } else {
        setItems(getInitialLandingItems())
        const t = setTimeout(() => {
          focusInput()
          if (onDone) onDone()
        }, 50)
        timeoutIds.push(t)
      }
    }

    step()

    return () => {
      isCancelled = true
      timeoutIds.forEach(id => clearTimeout(id))
    }
  }

  const bootCleanupRef = useRef(null)

  const startBootSequence = (onDone) => {
    if (bootCleanupRef.current) {
      bootCleanupRef.current()
    }
    bootCleanupRef.current = runBootSequence(onDone)
  }

  const ROUTE_ALIASES = {
    faqs: 'faq',
    track: 'tracks',
    prize: 'prizes',
    prizepool: 'prizes',
    rules: 'participation',
    eligibility: 'participation',
    signup: 'register',
    apply: 'register',
    schedule: 'timeline',
    dates: 'timeline',
    info: 'about',
    hall: 'hall-of-fame',
    fame: 'hall-of-fame',
    museum: 'hall-of-fame',
    halloffame: 'hall-of-fame',
    'hall-of-fame': 'hall-of-fame',
    testimonial: 'testimonials',
    gallery: 'testimonials',
    testimonials: 'testimonials',
    team: 'organizing-team',
    committee: 'organizing-team',
    members: 'organizing-team',
    mentors: 'organizing-team',
    mentor: 'organizing-team',
    organizers: 'organizing-team',
    organizing: 'organizing-team',
    'organizing-team': 'organizing-team',
    coc: 'code',
    'code-of-conduct': 'code',
    conduct: 'code',
    code: 'code',
    recaps: 'recap',
    cls: 'clear'
  }

  const getRouteFromLocation = () => {
    let path = window.location.pathname.replace(/^\/+|\/+$/g, '').trim().toLowerCase()
    if (!path || path === 'index.html') {
      path = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase()
    }
    return ROUTE_ALIASES[path] || path
  }

  const updateUrlPath = (route) => {
    const newPath = (!route || route === 'home' || route === 'clear' || route === 'cls') ? '/' : `/${route}`
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', newPath)
    }
  }

  const COMMAND_TITLES = {
    about: 'About MBMC IdeaX 2026 | National Hackathon',
    tracks: 'Tracks & Problem Statements | MBMC IdeaX 2026',
    timeline: 'Timeline & Important Dates | MBMC IdeaX 2026',
    prizes: 'Prizes & Rewards (Rs. 111,111) | MBMC IdeaX 2026',
    faq: 'Frequently Asked Questions (FAQ) | MBMC IdeaX 2026',
    faqs: 'Frequently Asked Questions (FAQ) | MBMC IdeaX 2026',
    code: 'Code of Conduct & Rules | MBMC IdeaX 2026',
    conduct: 'Code of Conduct & Rules | MBMC IdeaX 2026',
    coc: 'Code of Conduct & Rules | MBMC IdeaX 2026',
    register: 'Register Now | MBMC IdeaX 2026',
    participation: 'Eligibility & Team Rules | MBMC IdeaX 2026',
    eligibility: 'Eligibility & Team Rules | MBMC IdeaX 2026',
    hall: 'Hall of Fame | MBMC IdeaX 2026',
    museum: 'Hall of Fame | MBMC IdeaX 2026',
    'hall-of-fame': 'Hall of Fame | MBMC IdeaX 2026',
    testimonials: 'Participant Testimonials | MBMC IdeaX 2026',
    gallery: 'Participant Testimonials | MBMC IdeaX 2026',
    'organizing-team': 'Organizing Team | MBMC IdeaX 2026',
    organizers: 'Organizing Team | MBMC IdeaX 2026',
    members: 'Organizing Team | MBMC IdeaX 2026',
    team: 'Organizing Team | MBMC IdeaX 2026',
    committee: 'Organizing Team | MBMC IdeaX 2026',
    recap: 'Past Recaps (2023-2025) | MBMC IdeaX 2026',
    contact: 'Contact & Support | MBMC IdeaX 2026',
    discord: 'Community Discord | MBMC IdeaX 2026',
    countdown: 'Countdown to Kickoff | MBMC IdeaX 2026',
    home: 'MBMC IdeaX 2026 | National Hackathon Nepal | Register Now'
  }

  // Initial load & Boot sequence
  useEffect(() => {
    if (showIntro) return

    const initialRoute = getRouteFromLocation()

    if (['hall-of-fame', 'museum', 'hall', 'fame'].includes(initialRoute)) {
      setView('museum')
      document.title = 'Hall of Fame | MBMC IdeaX 2026'
      updateUrlPath('hall-of-fame')
    } else if (['testimonials', 'gallery'].includes(initialRoute)) {
      setView('gallery')
      document.title = 'Testimonials | MBMC IdeaX 2026'
      updateUrlPath('testimonials')
    } else if (['code', 'conduct', 'coc'].includes(initialRoute)) {
      setView('conduct')
      document.title = 'Code of Conduct & Rules | MBMC IdeaX 2026'
      updateUrlPath('code')
    } else if (['organizing-team', 'organizers', 'members', 'team', 'committee'].includes(initialRoute)) {
      setView('organizing-team')
      document.title = 'Organizing Team | MBMC IdeaX 2026'
      updateUrlPath('organizing-team')
    } else {
      if (bootCleanupRef.current) {
        bootCleanupRef.current()
      }
      bootCleanupRef.current = runBootSequence(() => {
        if (initialRoute && initialRoute !== 'home' && initialRoute !== 'clear') {
          handleRunCommand(initialRoute)
        }
      })
    }

    return () => {
      if (bootCleanupRef.current) {
        bootCleanupRef.current()
      }
      bootCleanupRef.current = null
    }
  }, [showIntro])

  // Keep the input visible when the on-screen keyboard opens (iOS Safari)
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const handleViewportResize = () => {
      if (document.activeElement === inputRef.current && inputRef.current) {
        inputRef.current.scrollIntoView({ block: 'nearest' })
      }
    }
    vv.addEventListener('resize', handleViewportResize)
    return () => vv.removeEventListener('resize', handleViewportResize)
  }, [])

  // Handle URL change via popstate and hashchange
  useEffect(() => {
    if (showIntro) return

    const handleLocationChange = () => {
      const route = getRouteFromLocation()
      if (!route) {
        setView('terminal')
        document.title = COMMAND_TITLES.home
        setTimeout(() => {
          if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight
          }
          focusInput()
        }, 20)
        return
      }

      if (['hall-of-fame', 'museum', 'hall', 'fame'].includes(route)) {
        setView('museum')
        document.title = 'Hall of Fame | MBMC IdeaX 2026'
      } else if (['testimonials', 'gallery'].includes(route)) {
        setView('gallery')
        document.title = 'Testimonials | MBMC IdeaX 2026'
      } else if (['code', 'conduct', 'coc'].includes(route)) {
        setView('conduct')
        document.title = 'Code of Conduct & Rules | MBMC IdeaX 2026'
      } else if (['organizing-team', 'organizers', 'members', 'team', 'committee'].includes(route)) {
        setView('organizing-team')
        document.title = 'Organizing Team | MBMC IdeaX 2026'
      } else if (['home', 'clear', 'cls'].includes(route)) {
        setView('terminal')
        handleClearTerminal()
      } else {
        setView('terminal')
        handleRunCommand(route)
      }
    }

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)
    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [showIntro])

  const handleRunCommand = (raw) => {
    const trimmed = (raw || '').trim()
    const now = Date.now()
    
    // Prevent accidental double execution (e.g. from rapid double clicks or event bubbling)
    if (trimmed !== '' && trimmed === lastCommandRef.current.cmd && (now - lastCommandRef.current.time) < 300) {
      return
    }
    lastCommandRef.current = { cmd: trimmed, time: now }

    // Always add command history if non-empty
    if (trimmed !== '') {
      setHistory(prev => [...prev, trimmed])
    }

    const rawCmd = (trimmed.split(/\s+/)[0] || '').toLowerCase()
    const cmdName = ROUTE_ALIASES[rawCmd] || rawCmd

    if (['home', 'clear', 'cls'].includes(cmdName)) {
      document.title = COMMAND_TITLES.home
      updateUrlPath('')
    } else if (['hall-of-fame', 'museum', 'hall', 'fame'].includes(cmdName)) {
      document.title = 'Hall of Fame | MBMC IdeaX 2026'
      updateUrlPath('hall-of-fame')
    } else if (['testimonials', 'gallery'].includes(cmdName)) {
      document.title = 'Testimonials | MBMC IdeaX 2026'
      updateUrlPath('testimonials')
    } else if (['code', 'conduct', 'coc'].includes(cmdName)) {
      document.title = 'Code of Conduct & Rules | MBMC IdeaX 2026'
      updateUrlPath('code')
    } else if (['organizing-team', 'organizers', 'members', 'team', 'committee'].includes(cmdName)) {
      document.title = 'Organizing Team | MBMC IdeaX 2026'
      updateUrlPath('organizing-team')
    } else if (COMMAND_TITLES[cmdName]) {
      document.title = COMMAND_TITLES[cmdName]
      updateUrlPath(cmdName)
    }

    const echoItem = { type: 'ECHO', command: raw }
    const result = executeCommand(raw, { history, onRunCommand: handleRunCommand })

    if (result && result.type === 'CLEAR') {
      setItems(getInitialLandingItems())
    } else if (result && result.type === 'HOME') {
      setHistory([])
      document.title = COMMAND_TITLES.home
      updateUrlPath('')
      startBootSequence()
    } else if (result && result.type === 'MUSEUM') {
      setItems(prev => [...prev, echoItem])
      setView('museum')
      document.title = 'Hall of Fame | MBMC IdeaX 2026'
    } else if (result && result.type === 'GALLERY') {
      setItems(prev => [...prev, echoItem])
      setView('gallery')
      document.title = 'Testimonials | MBMC IdeaX 2026'
    } else if (result && result.type === 'CONDUCT_VIEW') {
      setItems(prev => [...prev, echoItem])
      setView('conduct')
      document.title = 'Code of Conduct & Rules | MBMC IdeaX 2026'
    } else if (result && result.type === 'ORGANIZING_TEAM') {
      setItems(prev => [...prev, echoItem])
      setView('organizing-team')
      document.title = 'Organizing Team | MBMC IdeaX 2026'
    } else if (result) {
      setItems(prev => [...prev, echoItem, result])
    } else {
      setItems(prev => [...prev, echoItem])
    }

    setTimeout(focusInput, 20)
  }

  const handleClearTerminal = () => {
    setItems(getInitialLandingItems())
    document.title = COMMAND_TITLES.home
    updateUrlPath('')
    focusInput()
  }

  const handleHome = () => {
    setHistory([])
    document.title = COMMAND_TITLES.home
    updateUrlPath('')
    startBootSequence()
  }

  const handleFocusInput = () => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
    focusInput()
  }

  const handleAppendText = (text, cls) => {
    setItems(prev => [...prev, { type: 'TEXT', text, cls }])
  }

  const handleReturnToTerminal = () => {
    setView('terminal')
    document.title = COMMAND_TITLES.home
    updateUrlPath('')
    setTimeout(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight
      }
      focusInput()
    }, 20)
  }

  return (
    <main>
      {view === 'museum' && (
        <section aria-label="Hall of Fame">
          <Suspense fallback={<div className="view-loading">loading hall of fame…</div>}>
            <AsciiWorld onReturn={handleReturnToTerminal} />
          </Suspense>
        </section>
      )}
      
      {view === 'gallery' && (
        <section aria-label="Testimonials">
          <Suspense fallback={<div className="view-loading">loading testimonials…</div>}>
            <Testimonials onReturn={handleReturnToTerminal} />
          </Suspense>
        </section>
      )}
      
      {view === 'conduct' && (
        <section aria-label="Code of Conduct Manual">
          <Suspense fallback={<div className="view-loading">loading code of conduct…</div>}>
            <Conduct onReturn={handleReturnToTerminal} />
          </Suspense>
        </section>
      )}

      {view === 'organizing-team' && (
        <section aria-label="Organizing Team">
          <Suspense fallback={<div className="view-loading">loading organizing team…</div>}>
            <Members onReturn={handleReturnToTerminal} />
          </Suspense>
        </section>
      )}

      <div className="terminal-app" style={{ display: view === 'terminal' ? 'flex' : 'none' }}>
        <div className="scanlines" aria-hidden="true" />
        <div className="vignette" aria-hidden="true" />

        {showIntro ? (
          <LoadingIntro onComplete={() => setShowIntro(false)} />
        ) : (
          <div className="app" id="app">
            <TitleBar
              onClear={handleClearTerminal}
              onHome={handleHome}
              onFocus={handleFocusInput}
            />

            <OutputPane
              items={items}
              onRunCommand={handleRunCommand}
              outputRef={outputRef}
              onFocusInput={handleFocusInput}
            />

            <nav aria-label="Quick commands" className="quick-nav">
              <SuggestionChips onRunCommand={handleRunCommand} />
            </nav>

            <MobileVirtualKeys />

            <CommandLine
              inputRef={inputRef}
              history={history}
              onRunCommand={handleRunCommand}
              onAppendText={handleAppendText}
              isActive={view === 'terminal'}
            />
          </div>
        )}
      </div>
    </main>
  )
}
