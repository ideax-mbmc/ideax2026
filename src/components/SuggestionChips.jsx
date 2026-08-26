import React from 'react'

export default function SuggestionChips({ onRunCommand }) {
  const chips = [
    { label: '$ home', cmd: 'home' },
    { label: '$ about', cmd: 'about' },
    { label: '$ participation', cmd: 'participation' },
    { label: '$ tracks', cmd: 'tracks' },
    { label: '$ faq', cmd: 'faq' },
    { label: '$ conduct', cmd: 'conduct' },
    { label: '$ hall of fame', cmd: 'hall-of-fame' },
    { label: '$ members', cmd: 'members' },
    { label: '$ recap', cmd: 'recap' },
    { label: '$ prizes', cmd: 'prizes' },
    { label: '$ timeline', cmd: 'timeline' },
    { label: '$ testimonials', cmd: 'testimonials' },
    { label: '$ help', cmd: 'help' },
  ]

  const handleClick = (e, cmd) => {
    e.preventDefault()
    e.stopPropagation()
    onRunCommand(cmd)
  }

  return (
    <div className="chips" aria-label="quick commands">
      {chips.map(chip => (
        <button
          key={chip.cmd}
          type="button"
          className={chip.isPrimary ? 'chip-primary' : chip.isSecondary ? 'chip-secondary' : ''}
          onClick={(e) => handleClick(e, chip.cmd)}
        >
          {chip.label}
        </button>
      ))}
    </div>
  )
}
