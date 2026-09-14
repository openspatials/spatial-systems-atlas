// Exports, rebound to the ported model.
//
// Every export states its scope in words before the reader downloads it. The
// old tool had two export paths with different schemas and neither said what it
// contained, so two people could compare spreadsheets that were not the same
// shape and not notice.

import type { Capability, Model, Query } from '../design-model.ts'
import { levelOf, matchingRows } from '../design-model.ts'

const FIELDS = [
  'subject_id', 'subject_name', 'subject_kind', 'subject_status',
  'capability_group', 'capability_id', 'capability_name',
  'binding', 'interop', 'interop_reason',
  'support_level', 'confidence', 'note', 'sources',
] as const

const LEVEL_WORD: Record<string, string> = {
  n: 'built in', x: 'through an extension', p: 'partial',
  z: 'absent', c: 'conflict', o: 'out of scope',
}
const CONF_WORD: Record<string, string> = { v: 'verified', r: 'reported', u: 'unverified' }

const cell = (value: string) => `"${value.replace(/"/g, '""')}"`

export interface ExportScope {
  /** One sentence the reader can check before downloading. */
  sentence: string
  rows: number
  subjects: number
  capabilities: number
  fields: number
}

export function scopeOf(subjectIds: string[], capabilities: Capability[], whole: boolean): ExportScope {
  const rows = subjectIds.length * capabilities.length
  return {
    rows,
    subjects: subjectIds.length,
    capabilities: capabilities.length,
    fields: FIELDS.length,
    sentence: whole
      ? `Every subject and every capability, whatever is selected on screen. Out-of-scope records are included and are marked in the support column. This export ignores the current selection.`
      : `${subjectIds.length} selected subjects across the ${capabilities.length} capabilities that pass the current row filter. Out-of-scope records are included and are marked in the support column.`,
  }
}

export function buildCsv(model: Model, subjectIds: string[], capabilities: Capability[], scope: ExportScope): string {
  const lines: string[] = []
  // The header row says what the file holds, so a spreadsheet on its own is not
  // a mystery a week later.
  lines.push(`# MSF Map export · ${scope.sentence}`)
  lines.push(FIELDS.join(','))

  for (const sid of subjectIds) {
    const subject = model.bySubject.get(sid)
    if (!subject) continue
    for (const c of capabilities) {
      const code = model.cov[sid]?.[c.id]
      const detail = model.det[sid]?.[c.id]
      const level = levelOf(code)
      const group = model.groups.find((g) => g.id === c.g)?.name ?? c.g
      lines.push([
        subject.id, subject.name, subject.kind, subject.status,
        group, c.id, c.name,
        c.bind === 'connect' ? 'protocol' : 'format',
        c.interop, c.why,
        // A missing claim is "not assessed", never "absent".
        level ? LEVEL_WORD[level] : 'not assessed',
        code ? CONF_WORD[code[1]] ?? '' : '',
        detail?.[0] ?? '',
        (detail?.[1] ?? []).map((src) => src[0] ?? src[1]).join(' | '),
      ].map((v) => cell(String(v))).join(','))
    }
  }
  return lines.join('\n')
}

export interface ExportOption {
  label: string
  scope: ExportScope
  run: () => 'saved' | 'blocked'
}

export function exportOptions(model: Model, query: Query): ExportOption[] {
  const selectionCaps = matchingRows(model, query)
  const allIds = model.subjects.map((s) => s.id)

  const make = (label: string, ids: string[], caps: Capability[], whole: boolean, filename: string): ExportOption => {
    const scope = scopeOf(ids, caps, whole)
    return {
      label,
      scope,
      run: () => download(filename, buildCsv(model, ids, caps, scope)),
    }
  }

  return [
    make('This selection, CSV', query.on, selectionCaps, false, 'msf-map-selection.csv'),
    make('Everything, CSV', allIds, model.capabilities, true, 'msf-map-everything.csv'),
  ]
}

/**
 * Some viewers block a download started by the page. Say so rather than
 * appearing to do nothing.
 */
function download(filename: string, text: string): 'saved' | 'blocked' {
  try {
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    return 'saved'
  } catch {
    return 'blocked'
  }
}
