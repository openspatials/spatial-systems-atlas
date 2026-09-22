# How to score a subject against the territory map

**Write to this directory, `tool/data/`. Never to `spatial-tech-map/data/`, which
is a generated export that the next sync erases.**

You are filling one subject's row in a comparison matrix for the Metaverse Standards Forum
Infrastructure Working Group. The map's purpose: say which standard or tool does what, where two of
them overlap, and where nothing reaches. A false claim here is worse than a missing one.

## Read first
- `capabilities.csv` in this folder. Columns: id, group, name, definition, binding. **Score against
  the definition, not the name.** Ninety capabilities; most subjects only touch some.
- `subjects.csv` for the subject's identity and stated version.

## Levels — use exactly these
- `native` — the subject specifies or implements this itself, in its core.
- `via-extension` — supported through a named extension, plug-in, module or optional profile. Say which in the note.
- `partial` — some of the definition is met and some is not. The note must say which part is missing.
- `none` — in scope for something like this subject, but absent.
- `conflicts` — the subject does this in a way that will not interoperate with the common approach. Say how.
- `out-of-scope` — the subject is not the kind of thing that would do this. Use freely; it is a real answer.

## Confidence — use exactly these
- `verified` — you read it in a primary source and can quote it.
- `reported` — a credible secondary source says so and you could not reach a primary one.
- `unverified` — you believe it but could not confirm. Prefer omitting the row.

## Rules
- Primary sources only for `verified`: specification text, official registries, official
  documentation, the project's own repository. Not blogs, not marketing, not encyclopedias.
- Every `native` and `via-extension` row needs at least one source with a URL.
- Do not guess version numbers or dates. Leave them out rather than approximate.
- Where a capability is genuinely contested inside the subject, say so in the note.
- Skip capabilities you cannot assess. A short honest row beats a long invented one.

## Output
Write one file: `coverage/<subject_id>.json`

```json
{
  "subject_id": "threejs",
  "summary": "Three to six sentences. What this subject is, what it covers well, what it leaves to others, and any trap a standards audience should know. Plain English, no jargon, no acronyms spelled short.",
  "coverage": [
    {
      "capability_id": "render.raster",
      "level": "native",
      "note": "one clear sentence",
      "confidence": "verified",
      "sources": [
        {"url": "https://...", "title": "...", "retrieved": "2026-08-22", "kind": "primary", "quote": "short exact quote"}
      ]
    }
  ]
}
```

Return in your final reply only: the count of rows by level, the count by confidence, and the three
findings most likely to matter to a standards working group. Do not paste the JSON.

## Direction: does it read the thing, write it, or both

A coverage row may carry an optional `direction` field, next to `confidence`. It says which way
the support runs for that one claim, and it takes exactly one of `read`, `write` or `both`.

- `read` — the subject can take the thing in but cannot put it back out. A runtime that loads a
  format and ships no exporter for it belongs here.
- `write` — the reverse. It can produce the thing but cannot consume it.
- `both` — it does each way. Where the two sides are uneven, say so in the note; one word cannot
  carry a per-format list.

Leave the key out when the claim is not about moving data in or out, or when you did not settle
the direction. A missing key is not a claim, and every row written before the field existed has
none. Set it only from the same evidence that supports the level, and never from the level alone:
`native` says nothing about which way the data flows.

```json
{"capability_id": "scene.container", "level": "native", "note": "...",
 "confidence": "verified", "direction": "read", "sources": [ ... ]}
```

The field exists so the lopsided cases can be counted and queried. Several runtimes read a format
they cannot write, which decides whether they are a conduit between tools or a terminus, and until
now that fact was buried in note text where nothing could find it.
