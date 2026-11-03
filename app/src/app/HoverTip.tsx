// A small tip behind a button: it opens on hover, keyboard focus or a tap, and
// stays open while the pointer is over it, so the links and buttons inside it can
// be used. Escape, a tap elsewhere or moving the pointer away closes it.

import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

export function HoverTip({ label, trigger, triggerStyle, openStyle, above = false, beside = false, width = 340, children }: {
  /** What the tip is, read out by screen readers for the button and the tip. */
  label: string
  /** What the button shows: an icon or a word. */
  trigger: ReactNode
  triggerStyle: CSSProperties
  /** Extra style for the button while the tip is open. */
  openStyle?: CSSProperties
  /** Open above the button, centred over it and kept inside the window, for a button
   *  in the footer, which spans the whole window. */
  above?: boolean
  /** Open to the left of the button, level with it, for a button in a slim right-hand column. */
  beside?: boolean
  width?: number
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  // The tip's left edge, from the button's left edge, and its width. Below the button
  // it lines up with the button's right edge where it fits, and stays inside the main
  // column, clear of the tool rail, where not. Above, it is centred over the button and
  // stays inside the window.
  const [place, setPlace] = useState({ offset: 0, width })
  const id = useId()
  const wrap = useRef<HTMLSpanElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<number | undefined>(undefined)

  const show = () => {
    window.clearTimeout(closeTimer.current)
    const r = button.current?.getBoundingClientRect()
    if (r) {
      const area = above ? undefined : wrap.current?.closest('main')?.getBoundingClientRect()
      const min = (area?.left ?? 0) + 16
      const max = Math.min(area?.right ?? window.innerWidth, window.innerWidth) - 16
      if (above) {
        const w = Math.min(width, max - min)
        const left = Math.min(Math.max(r.left + r.width / 2 - w / 2, min), max - w)
        setPlace({ offset: left - r.left, width: w })
      } else if (beside) {
        const w = Math.min(width, r.left - 6 - min)
        setPlace({ offset: -(w + 6), width: w })
      } else {
        const w = Math.min(width, max - min)
        const left = Math.min(Math.max(r.right - w, min), max - w)
        setPlace({ offset: left - r.left, width: w })
      }
    }
    setOpen(true)
  }
  // A short delay lets the pointer cross the gap between the button and the tip.
  const hideSoon = () => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), 150)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const onDown = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false) }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])
  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  return (
    <span ref={wrap} style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={show} onMouseLeave={hideSoon}
      onFocus={show}
      onBlur={(e) => { if (!wrap.current?.contains(e.relatedTarget as Node)) setOpen(false) }}>
      <button ref={button} type="button" style={{ ...triggerStyle, ...(open ? openStyle : null) }} onClick={show}
        aria-label={label} aria-expanded={open} aria-controls={id}>
        {trigger}
      </button>
      {open && (
        <div id={id} role="region" aria-label={label}
          style={{ ...S.tip, ...(beside ? { top: 0 } : { [above ? 'bottom' : 'top']: 'calc(100% + 6px)' }), left: place.offset, width: place.width }}>
          {children}
        </div>
      )}
    </span>
  )
}

const S = {
  tip: {
    position: 'absolute', zIndex: 40, boxSizing: 'border-box', padding: '10px 12px',
    background: 'var(--panel)', color: 'var(--ink)', border: '1px solid var(--ruleS)', borderRadius: 6,
    boxShadow: '0 6px 18px rgba(0, 0, 0, .14)', fontFamily: 'var(--fl)', fontSize: 12.5, lineHeight: 1.45,
    letterSpacing: 'normal', textAlign: 'left',
  } as const,
}
