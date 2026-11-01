// The page footer: author, contact, how to cite, and the version.
//
// The contact address is not in the page or the bundle as text. It is put
// together after the page loads, so a crawler that reads the HTML or the
// script without running it finds no address to harvest.

import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { RELEASED, VERSION } from '../version.ts'

const SITE = 'https://openspatials.com/msf/atlas/'
const REPO = 'https://github.com/openspatials/spatial-systems-atlas'
// The mailto link, one character code per letter, last letter first.
const CONTACT = [104, 99, 101, 116, 46, 116, 101, 115, 109, 117, 115, 64, 103, 105, 114, 103, 58, 111, 116, 108, 105, 97, 109]

export function Footer({ style }: { style: CSSProperties }) {
  const [mail, setMail] = useState('')
  useEffect(() => { setMail(String.fromCharCode(...CONTACT.slice().reverse())) }, [])

  return (
    <footer style={{ ...style, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span>
        Spatial Systems Atlas by Grig Bilham
        {mail && <> (<a href={mail} style={{ color: 'inherit' }}>email</a>)</>}
      </span>
      <span>
        Cite as: Bilham, G. ({RELEASED.slice(0, 4)}). Spatial Systems Atlas (Version {VERSION}, last update: {RELEASED})
        {' '}[Data set and interface]. <a href={SITE} style={{ color: 'inherit' }}>{SITE}</a>.
        {' '}Data and code: <a href={REPO} style={{ color: 'inherit' }}>{REPO}</a>.
      </span>
      <span>Version {VERSION} · Last update: {RELEASED}</span>
    </footer>
  )
}
