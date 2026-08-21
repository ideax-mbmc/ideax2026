import { useRef, useEffect, useState } from 'react'
import { buildMuseum, setupTorchFlicker } from '../engine/museum'
import { loadPaintingImages } from '../engine/images'
import { createPlayer, createInputState, updatePlayer } from '../engine/player'
import { createRendererState, resize, render, renderMinimap, renderHud } from '../engine/renderer'
import { SPRITE_DEFS } from '../engine/textures'
import './AsciiWorld.css'

export default function AsciiWorld({ onReturn }) {
  const canvasRef = useRef(null)
  const minimapRef = useRef(null)
  const hudTRRef = useRef(null)
  const hudBLRef = useRef(null)
  const stageRef = useRef(null)
  const inputRef = useRef(null)
  const joyBaseRef = useRef(null)
  const joyKnobRef = useRef(null)
  const [showOverlay, setShowOverlay] = useState(true)
  const [isTouch] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: none) and (pointer: coarse)').matches
  )
  const overlayVisibleRef = useRef(showOverlay)

  useEffect(() => {
    overlayVisibleRef.current = showOverlay
  }, [showOverlay])

  useEffect(() => {
    const canvas = canvasRef.current
    const mmCanvas = minimapRef.current
    if (!canvas || !mmCanvas) return

    const ctx = canvas.getContext("2d")
    const mmCtx = mmCanvas.getContext("2d")

    const museum = buildMuseum()
    const paintingLookup = {}
    museum.paintings.forEach(p => { paintingLookup[`${p.x},${p.y}`] = p; })
    loadPaintingImages(museum.paintings)
    const torches = setupTorchFlicker(museum.torches)
    for (const s of museum.sprites) {
      const d = SPRITE_DEFS[s.type]
      s.collide = d.collide
      s.radius = d.radius
    }

    const player = createPlayer(museum.spawn)
    const input = createInputState()
    inputRef.current = input
    const rendererState = createRendererState()

    resize(rendererState, canvas)

    const onResize = () => resize(rendererState, canvas)
    window.addEventListener("resize", onResize)

    const onPointerLockChange = () => {
      input.mouseLocked = document.pointerLockElement === canvas || document.pointerLockElement === document.body
      setShowOverlay(!input.mouseLocked)
    }
    document.addEventListener("pointerlockchange", onPointerLockChange)

    const onMouseMove = (e) => {
      if (!input.mouseLocked || input.mapOpen) return
      player.angle += e.movementX * 0.0022
      player.pitch = Math.max(-rendererState.PITCH_LIMIT, Math.min(rendererState.PITCH_LIMIT, player.pitch - e.movementY * 0.045))
    }
    document.addEventListener("mousemove", onMouseMove)

    const onKeyDown = (e) => {
      input.keys[e.code] = true
      if (e.code === "KeyM" && !e.repeat) input.mapOpen = !input.mapOpen
    }
    const onKeyUp = (e) => { input.keys[e.code] = false }
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)

    let removeTouchListeners = () => {}
    if (isTouch) {
      const JOY_RADIUS = 52
      const PITCH_LIMIT = rendererState.PITCH_LIMIT
      let joyId = null
      let joyOrigin = null
      let lookId = null
      let lookLast = null

      const placeJoy = (x, y) => {
        const base = joyBaseRef.current
        if (!base) return
        base.style.display = 'block'
        base.style.left = `${x}px`
        base.style.top = `${y}px`
        const knob = joyKnobRef.current
        if (knob) knob.style.transform = 'translate(0px, 0px)'
      }

      const moveKnob = (dx, dy) => {
        const knob = joyKnobRef.current
        if (knob) knob.style.transform = `translate(${dx}px, ${dy}px)`
      }

      const hideJoy = () => {
        const base = joyBaseRef.current
        if (base) base.style.display = 'none'
      }

      const onTouchStart = (e) => {
        if (overlayVisibleRef.current) return
        if (e.target && e.target.closest && e.target.closest('button')) return
        for (const t of e.changedTouches) {
          if (t.clientX < window.innerWidth * 0.45 && joyId === null) {
            joyId = t.identifier
            joyOrigin = { x: t.clientX, y: t.clientY }
            placeJoy(t.clientX, t.clientY)
          } else if (lookId === null) {
            lookId = t.identifier
            lookLast = { x: t.clientX, y: t.clientY }
          }
        }
        e.preventDefault()
      }

      const onTouchMove = (e) => {
        if (overlayVisibleRef.current) return
        for (const t of e.changedTouches) {
          if (t.identifier === joyId && joyOrigin) {
            let dx = t.clientX - joyOrigin.x
            let dy = t.clientY - joyOrigin.y
            const d = Math.hypot(dx, dy)
            if (d > JOY_RADIUS) { dx = (dx / d) * JOY_RADIUS; dy = (dy / d) * JOY_RADIUS }
            input.touchMove = { x: dx / JOY_RADIUS, y: -dy / JOY_RADIUS }
            input.touchRun = Math.hypot(dx, dy) >= JOY_RADIUS * 0.98
            moveKnob(dx, dy)
          } else if (t.identifier === lookId && lookLast && !input.mapOpen) {
            player.angle += (t.clientX - lookLast.x) * 0.0045
            player.pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, player.pitch - (t.clientY - lookLast.y) * 0.09))
            lookLast = { x: t.clientX, y: t.clientY }
          }
        }
        e.preventDefault()
      }

      const onTouchEnd = (e) => {
        for (const t of e.changedTouches) {
          if (t.identifier === joyId) {
            joyId = null
            joyOrigin = null
            input.touchMove = { x: 0, y: 0 }
            input.touchRun = false
            hideJoy()
          } else if (t.identifier === lookId) {
            lookId = null
            lookLast = null
          }
        }
      }

      const stage = stageRef.current
      if (stage) {
        stage.addEventListener('touchstart', onTouchStart, { passive: false })
        stage.addEventListener('touchmove', onTouchMove, { passive: false })
        stage.addEventListener('touchend', onTouchEnd)
        stage.addEventListener('touchcancel', onTouchEnd)
        removeTouchListeners = () => {
          stage.removeEventListener('touchstart', onTouchStart)
          stage.removeEventListener('touchmove', onTouchMove)
          stage.removeEventListener('touchend', onTouchEnd)
          stage.removeEventListener('touchcancel', onTouchEnd)
        }
      }
    }

    let last = performance.now()
    const t0 = last
    let raf

    function loop(now) {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const timeSec = (now - t0) / 1000

      updatePlayer(dt, player, input, museum, museum.sprites)
      render(timeSec, ctx, rendererState, player, input, museum, paintingLookup, torches, museum.sprites)
      renderMinimap(mmCtx, mmCanvas, player, museum)

      rendererState.fpsFrames++
      rendererState.fpsTimer += dt
      if (rendererState.fpsTimer >= 0.5) {
        rendererState.fps = Math.round(rendererState.fpsFrames / rendererState.fpsTimer)
        rendererState.fpsFrames = 0
        rendererState.fpsTimer = 0
      }
      renderHud(hudTRRef.current, hudBLRef.current, rendererState.fps, player, rendererState)

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
      document.removeEventListener("pointerlockchange", onPointerLockChange)
      document.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
      removeTouchListeners()
    }
  }, [isTouch])

  const handleOverlayClick = () => {
    if (isTouch) {
      setShowOverlay(false)
      return
    }
    const canvas = canvasRef.current
    canvas?.requestPointerLock?.() ?? document.body?.requestPointerLock?.()
  }

  const toggleMap = () => {
    const input = inputRef.current
    if (input) input.mapOpen = !input.mapOpen
  }

  return (
    <div
      ref={stageRef}
      className={`ascii-world-stage${isTouch ? ' is-touch' : ''}`}
    >
      <canvas ref={canvasRef} className="ascii-world-canvas" />
      <div className="crt-overlay" />
      <div className="fullscreen-vignette" />
      <div className="ascii-world-crosshair">+</div>
      <div className="ascii-world-hud">
        <div className="ascii-world-hud-corner ascii-world-hud-tl">
          <pre className="ascii-world-logo">█ █▀▄ █▀▀ ▄▀█ ▀▄▀
█ █▄▀ ██▄ █▀█ █ █</pre>
        </div>
        <div className="ascii-world-hud-corner ascii-world-hud-tr" ref={hudTRRef} />
        <div className="ascii-world-hud-corner ascii-world-hud-bl" ref={hudBLRef} />
        <div className="ascii-world-hud-corner ascii-world-hud-br">
          <canvas ref={minimapRef} className="ascii-world-minimap" width="120" height="120" />
        </div>
      </div>

      {isTouch && !showOverlay && (
        <>
          <div className="touch-joystick" ref={joyBaseRef} aria-hidden="true">
            <div className="touch-joystick-knob" ref={joyKnobRef} />
          </div>
          <div className="touch-controls">
            <button className="touch-btn" onClick={toggleMap}>MAP</button>
            {onReturn && (
              <button className="touch-btn touch-btn-exit" onClick={onReturn}>EXIT</button>
            )}
          </div>
        </>
      )}

      {showOverlay && (
        <div className="ascii-world-overlay">
          <div className="ascii-world-overlay-content" onClick={handleOverlayClick}>
            <h1>IdeaX welcomes you to its hall of fame</h1>
            {isTouch ? (
              <p>
                A gallery of sponsors, kept within a torch-lit stone keep, rendered entirely in text density.<br />
                <span className="ascii-world-key">left thumb</span> anywhere to walk &middot;
                <span className="ascii-world-key"> right thumb</span> to look around &middot; push the stick to its edge to run &middot;
                <span className="ascii-world-key"> MAP</span> for the full map
              </p>
            ) : (
              <p>
                A gallery of sponsors, kept within a torch-lit stone keep, rendered entirely in text density.<br />
                <span className="ascii-world-key">W A S D</span> to walk &middot; mouse to look freely, any direction &middot;
                <span className="ascii-world-key">SHIFT</span> to hurry &middot; <span className="ascii-world-key">M</span> for the full map &middot; <span className="ascii-world-key">ESC</span> to release cursor
              </p>
            )}
            <div className="ascii-world-blink">[ tap to step inside ]</div>
          </div>
          {onReturn && (
            <button className="return-btn" onClick={onReturn}>
              ← back to terminal
            </button>
          )}
        </div>
      )}
    </div>
  )
}
