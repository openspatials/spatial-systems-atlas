// The visual vocabulary: the two identities, and the mark for every claim.
//
// Neither identity has been chosen, so both are built and switchable, exactly
// as the accepted design candidate has them.
//
// The seven support meanings each get their own mark, and the permanent legend
// is drawn from this same table so the legend can never drift from the data.

import type { Code, Conf, Level } from '../design-model.ts'
import { confOf, levelOf } from '../design-model.ts'
import type { Theme } from './state.ts'

export const THEMES: Record<Theme, Record<string, string>> = {
  paper: {
    '--bg': '#ECEBE4', '--panel': '#F7F6F1', '--sunk': '#E2E1D8',
    '--ink': '#1B1D1A', '--soft': '#55584E', '--faint': '#7E8177',
    '--rule': '#C7C5B8', '--ruleS': '#A9A79A',
    '--ac': '#2C5F6B', '--acF': '#CFE0E1',
    '--warn': '#8A6634', '--warnF': '#EBDCC2',
    '--bad': '#A33328', '--badF': '#F0D6D0', '--lane': '#3F6B3A',
    '--fl': "'IBM Plex Sans Condensed',sans-serif",
    '--fb': "'IBM Plex Serif',Georgia,serif",
    '--fm': "'IBM Plex Mono',monospace",
    '--r': '2px',
  },
  neutral: {
    '--bg': '#F4F5F7', '--panel': '#FFFFFF', '--sunk': '#EDEFF2',
    '--ink': '#15181C', '--soft': '#525A63', '--faint': '#858D97',
    '--rule': '#E3E6EA', '--ruleS': '#C7CCD3',
    '--ac': '#186A80', '--acF': '#DAEAF0',
    '--warn': '#6B7280', '--warnF': '#E7E9EC',
    '--bad': '#B3261E', '--badF': '#FBE9E7', '--lane': '#3B6B45',
    '--fl': "'Helvetica Neue',Helvetica,Arial,sans-serif",
    '--fb': "'Helvetica Neue',Helvetica,Arial,sans-serif",
    '--fm': "ui-monospace,'SF Mono',Menlo,monospace",
    '--r': '6px',
  },
}

export interface Mark {
  background: string
  border: string
  color: string
  /** What the level means, in words. Used by the legend and by every title. */
  word: string
}

/**
 * One entry per meaning. `null` is the seventh: nobody has checked.
 * "Absent" means somebody checked and it is not there. A missing claim means
 * nobody has checked. These must never be drawn the same way.
 */
const MARKS: Record<Level, Mark> = {
  n: { background: 'var(--acF)', border: '1px solid var(--ac)', color: 'var(--ac)', word: 'Built in' },
  x: { background: 'repeating-linear-gradient(135deg,var(--acF) 0 5px,transparent 5px 10px)', border: '1px solid var(--ac)', color: 'var(--ac)', word: 'Through an extension' },
  p: { background: 'repeating-linear-gradient(135deg,var(--warnF) 0 4px,transparent 4px 8px)', border: '1px solid var(--warn)', color: 'var(--warn)', word: 'Partial' },
  z: { background: 'transparent', border: '1px dashed var(--bad)', color: 'var(--bad)', word: 'Absent — recorded as not supported' },
  c: { background: 'var(--badF)', border: '2px solid var(--bad)', color: 'var(--bad)', word: 'Conflict — will not interoperate' },
  o: { background: 'var(--sunk)', border: '1px solid var(--rule)', color: 'var(--faint)', word: 'Out of scope for this kind of subject' },
}

const NOT_ASSESSED: Mark = {
  background: 'transparent',
  border: '1px dotted var(--ruleS)',
  color: 'var(--faint)',
  word: 'Not assessed yet',
}

const CONFIDENCE_WORD: Record<Conf, string> = {
  v: 'verified',
  r: 'reported',
  u: 'unverified',
}

export interface Reading {
  mark: Mark
  /** A glyph on the cell, so weak evidence is visible without opening the claim. */
  glyph: string
  word: string
  confidence: string | null
}

export function read(code: Code | undefined): Reading {
  const level = levelOf(code)
  const conf = confOf(code)
  const mark = level ? MARKS[level] : NOT_ASSESSED
  return {
    mark,
    glyph: conf === 'u' ? '?' : conf === 'r' ? '·' : '',
    word: mark.word,
    confidence: conf ? CONFIDENCE_WORD[conf] : null,
  }
}

/** The full sentence for a cell's title, so the meaning is never colour alone. */
export const describe = (code: Code | undefined, subject: string, capability: string): string => {
  const r = read(code)
  return `${subject} · ${capability} · ${r.word}${r.confidence ? ` · ${r.confidence}` : ''}`
}

export function cellStyle(code: Code | undefined, size: number): Record<string, string | number> {
  const { mark } = read(code)
  return {
    minWidth: `${size}px`,
    height: `${size}px`,
    padding: '0 3px',
    borderRadius: 'var(--r)',
    fontFamily: 'var(--fm)',
    fontSize: '9px',
    lineHeight: 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: mark.background,
    border: mark.border,
    color: mark.color,
  }
}

/** The permanent legend, drawn from the same table the cells use. */
export const LEGEND: Array<{ code: Code | undefined; label: string; note: string }> = [
  { code: 'nv', label: 'Built in', note: 'the subject ships it' },
  { code: 'xv', label: 'Through an extension', note: 'available, not in the core' },
  { code: 'pv', label: 'Partial', note: 'some of it, with limits' },
  { code: 'zv', label: 'Absent', note: 'assessed, and it is not there' },
  { code: 'cv', label: 'Conflict', note: 'two systems will not agree' },
  { code: 'ov', label: 'Out of scope', note: 'not this kind of subject' },
  { code: undefined, label: 'Not assessed', note: 'nobody has checked yet' },
  { code: 'nr', label: 'reported', note: 'second-hand evidence' },
  { code: 'nu', label: 'unverified', note: 'claim not confirmed' },
]
