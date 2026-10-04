import React from 'react'

export default function MobileVirtualKeys() {
  const triggerKey = (key, ctrlKey = false) => {
    const event = new KeyboardEvent('keydown', {
      key,
      ctrlKey,
      bubbles: true,
      cancelable: true
    })
    // Dispatch to both document and window to ensure all listeners catch it
    document.dispatchEvent(event)
    window.dispatchEvent(event)
  }

  return (
    <div className="mobile-virtual-keys" aria-hidden="true">
      <button type="button" onClick={(e) => { e.preventDefault(); triggerKey('Escape') }}>Esc</button>
      <button type="button" onClick={(e) => { e.preventDefault(); triggerKey('c', true) }}>Ctrl+C</button>
      <button type="button" onClick={(e) => { e.preventDefault(); triggerKey('z', true) }}>Ctrl+Z</button>
      <button type="button" onClick={(e) => { e.preventDefault(); triggerKey('q') }}>Q</button>
    </div>
  )
}
