// The shell's frame: how the page, the panel column and the display share the
// window height.
//
// Docked, at any width, the page is held to one window: the panel column runs
// from the header to the fixed footer and scrolls on its own, and so does the
// display. Floating over the display, the page stacks and scrolls as one, as
// it always has. On a phone an open panel is a sheet over the whole display,
// and the page is held to one window as when docked.

import type { CSSProperties } from 'react'

/** Under this width the screen is a phone: panels open as a sheet, with no pin. */
export const PHONE_WIDTH = 600
/** From this width up the panel column always docks. */
export const WIDE_WIDTH = 1100

export type PanelMode = 'docked' | 'floating' | 'sheet'

/**
 * How the panel column sits beside the display. A phone always takes the sheet,
 * whatever docked choice is stored; between a phone and a wide screen the
 * reader's pin choice holds, else the default for the width.
 */
export function panelMode(viewport: number, dockChoice: boolean | null, defaultDocked: boolean): PanelMode {
  if (viewport < PHONE_WIDTH) return 'sheet'
  if (viewport >= WIDE_WIDTH) return 'docked'
  return (dockChoice ?? defaultDocked) ? 'docked' : 'floating'
}

/** Whether the page is held to one window. Only a floating column lets it scroll as one. */
export const pageLocked = (floating: boolean): boolean => !floating

export interface Frame {
  root: CSSProperties
  /** The row that holds the rail, the panel column and the display. */
  body: CSSProperties
  /** The rail and the panel column. */
  side: CSSProperties
  /** The display, with its legend and the footer. */
  main: CSSProperties
}

export function frame(locked: boolean): Frame {
  // The bottom padding is the fixed footer's height, which the footer writes to --footer-h.
  const root: CSSProperties = { paddingBottom: 'var(--footer-h, 0px)', overflowX: 'hidden', maxWidth: '100vw', display: 'flex', flexDirection: 'column' }
  const body: CSSProperties = { display: 'flex', minHeight: 0, flex: 1, maxWidth: '100%' }
  const side: CSSProperties = { display: 'flex', zIndex: 20, flex: '0 0 auto' }
  const main: CSSProperties = { flex: 1, minWidth: 0, maxWidth: '100%', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }
  if (locked) {
    return {
      // Longhands only, so React never mixes overflow with overflowX when the column is pinned or floated.
      root: { ...root, height: '100dvh', overflowY: 'hidden' },
      body: { ...body, alignItems: 'stretch' },
      side: { ...side, position: 'relative' },
      main: { ...main, overflowY: 'auto', minHeight: 0 },
    }
  }
  // Scrolling as one, the column sticks to the top of the window and stops at the footer.
  return {
    root: { ...root, minHeight: '100dvh' },
    body: { ...body, alignItems: 'flex-start' },
    side: { ...side, position: 'sticky', top: 0, alignSelf: 'flex-start', height: 'calc(100dvh - var(--footer-h, 0px))' },
    main,
  }
}
