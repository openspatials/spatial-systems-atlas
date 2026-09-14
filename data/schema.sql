-- Territory map store. One row per claim, every claim traceable to a source.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS capability_group (
  id      TEXT PRIMARY KEY,
  name    TEXT NOT NULL,
  plane   TEXT NOT NULL,           -- topology | engine | interop | entry
  sort    INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS capability (
  id         TEXT PRIMARY KEY,
  group_id   TEXT NOT NULL REFERENCES capability_group(id),
  name       TEXT NOT NULL,
  definition TEXT NOT NULL,        -- what this cell means, so two people score it the same way
  binding    TEXT NOT NULL DEFAULT 'build',   -- build | connect  (chosen when the project is built, or per session)
  -- How much two independent systems have to agree on this capability before the four use
  -- cases work: must, should or none. Decided once, row by row, in
  -- infrastructure-wg/model/INTEROPERABILITY-BOUNDARIES.md, and carried here so the pages and
  -- the queries read the same judgement. interop_reason is the one sentence that page gives
  -- for the value.
  interop    TEXT NOT NULL DEFAULT 'should'
             CHECK (interop IN ('must','should','none')),
  interop_reason TEXT NOT NULL DEFAULT '',
  -- Which of the four use cases the row serves, as a comma-separated list of U1 to U4, taken
  -- from the same boundaries page. A certification lane is the pair (must row, use case): the
  -- lane named in infrastructure-wg/model/CERTIFICATION-LANES.md holds every must row whose
  -- list carries that use case, and nothing else. Empty on a row that needs no agreement.
  interop_uses TEXT NOT NULL DEFAULT '',
  sort       INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS subject (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  kind        TEXT NOT NULL,       -- standard | web-runtime | game-engine | platform | protocol | project
  org         TEXT,
  licence     TEXT,
  url         TEXT,
  status      TEXT,                -- ratified | candidate | draft | proprietary | shipping
  version     TEXT,
  status_date TEXT,
  summary     TEXT                 -- synthesized, cited
);

CREATE TABLE IF NOT EXISTS coverage (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_id    TEXT NOT NULL REFERENCES subject(id),
  capability_id TEXT NOT NULL REFERENCES capability(id),
  level         TEXT NOT NULL,     -- native | partial | via-extension | none | conflicts | out-of-scope
  note          TEXT,
  confidence    TEXT NOT NULL DEFAULT 'unverified',  -- verified | reported | unverified
  -- which way the support runs: read | write | both. NULL when the claim is not about
  -- moving data in or out, or when the direction was never established.
  direction     TEXT CHECK (direction IS NULL OR direction IN ('read','write','both')),
  UNIQUE(subject_id, capability_id)
);

CREATE TABLE IF NOT EXISTS source (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  url       TEXT NOT NULL UNIQUE,
  title     TEXT,
  retrieved TEXT,
  kind      TEXT                   -- primary | secondary | local-evidence
);

-- One row per quote. A claim may cite one address more than once, each time for a
-- different sentence, so the row id is the key: keying on (coverage_id, source_id) threw
-- the second and every later quote away.
CREATE TABLE IF NOT EXISTS evidence (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  coverage_id INTEGER NOT NULL REFERENCES coverage(id),
  source_id   INTEGER NOT NULL REFERENCES source(id),
  quote       TEXT
);

CREATE VIEW IF NOT EXISTS matrix AS
SELECT s.name AS subject, s.kind, cg.plane, cg.name AS grp, c.name AS capability,
       c.interop, c.interop_uses, cov.level, cov.confidence, cov.note, cov.direction
FROM coverage cov
JOIN subject s      ON s.id = cov.subject_id
JOIN capability c   ON c.id = cov.capability_id
JOIN capability_group cg ON cg.id = c.group_id;

CREATE VIEW IF NOT EXISTS overlap AS
SELECT c.id AS capability_id, c.name AS capability,
       COUNT(*) FILTER (WHERE cov.level IN ('native','via-extension')) AS claimants,
       GROUP_CONCAT(s.name, ' | ') AS subjects
FROM coverage cov
JOIN capability c ON c.id = cov.capability_id
JOIN subject s    ON s.id = cov.subject_id
WHERE cov.level IN ('native','via-extension')
GROUP BY c.id;
