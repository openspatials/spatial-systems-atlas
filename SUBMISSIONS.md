# Submissions, corrections and new subjects

This repository holds the **spatial technology map** published by the Metaverse Standards
Forum's Infrastructure Working Group, and its public submission list. See [README.md](README.md)
for the map itself; this page is about telling the maintainers something.

- The map: <https://openspatials.com/msf/map/>
- The matrix view: <https://openspatials.com/msf/map/matrix/>

The map records what each spatial computing system can do: 162 capabilities across 57 subjects —
standards, engines, runtimes, platforms, protocols, world models and capture techniques — with
every claim carrying a level, a confidence and the sources it rests on.

## Filing a submission

Two ways, and they land in the same place.

1. **From the map.** Every map page carries a round comment button in the bottom right corner. It
   opens a small form: what kind of submission, a title, the body, and an optional email address.
   Pressing Submit files the issue here and shows you its number and its address.
2. **Here on GitHub.** Open [a new issue](https://github.com/openspatials/spatial-tech-map/issues/new/choose)
   and pick one of the three forms.

## Submissions are public

Every submission becomes a public issue in this repository. Anyone can read it, and search engines
can index it. Do not put anything in a submission you would not publish.

The one exception is the email address. If you give one on the map's form it is **never written
into the issue**. It is kept privately, keyed to the issue number, so a maintainer can reply to you.
It is not published, not shared and not used for anything else. Leave it blank and the submission
is anonymous.

## The three kinds

- **Map feedback** (`kind:feedback`) — anything about how the map reads, what it shows, or what it
  should show.
- **Correction** (`kind:correction`) — a claim on the map is wrong. Say which subject, which
  capability, and what the evidence is.
- **New subject** (`kind:new-subject`) — a system the map does not carry yet.

## What happens to a submission

Every submission opens with `status:queued`.

Every two weeks, on the Thursday before the Infrastructure Working Group meeting, the maintainers
read everything received since the last pass and decide each one. The label then moves:

- `status:accepted` — the change will be made.
- `status:folded-in` — the change is in the map and published.
- `status:declined` — with a comment saying why.

The dated change list for each pass appears on the map itself, under the comment button, and in
[`CHANGES.md`](https://openspatials.com/msf/map/) as published with the map.

Page labels — `page:map`, `page:atlas`, `page:board` — record which page a submission came from.

## For maintainers

The comment button posts to a Cloudflare Pages Function at `/msf/map/api/submit` on
openspatials.com. That function validates the submission, checks a Cloudflare Turnstile token,
enforces a limit of five submissions an hour per address, creates the issue here through GitHub's
REST API, and stores the optional email address in a private Cloudflare key-value namespace keyed
by issue number. The browser never sees the GitHub token.

**Token note.** The function currently authenticates with a token that carries the `repo` scope
across every repository the account can reach. That is wider than this repository needs. A
fine-grained personal access token with Issues read and write on `openspatials/spatial-tech-map`
alone should replace it. Replacing it is one command:

```
wrangler pages secret put GITHUB_TOKEN --project-name=openspatials-com
```

Nothing else changes; the function reads the same secret name.
