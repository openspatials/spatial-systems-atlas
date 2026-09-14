/* The shared rules of the map page.
 *
 * This is the first module the page loads. It opens the one object every other module adds to,
 * declares the state they all read, reads the page's handles once, and holds the row rules both
 * modes judge a row with, so neither mode can hide a row the other shows.
 *
 * Contract:
 *   window.MAP.D, .on, .filter, .hasEntry, .mode, .c4View, .explOn, .subjById, .capById,
 *          .openCell, .metricBasis   the state the modules share; switch.js sets it and drives it
 *   window.MAP.el               the page's elements, read once, so every module names the same one
 *   window.MAP.esc(text)        HTML escaping for anything written into markup
 *   window.MAP.cls(level)       a level word turned into a class name
 *   window.MAP.LEVEL_WORDS      the level words as the legend says them
 *   window.MAP.shown()          the subjects switched on, in the dataset's own order
 *   window.MAP.rowHits(data, cap, shown, filter, entryOnly)
 *          -> null when the row is hidden, otherwise {hits, reach, conflicts, partial, scored,
 *          sole, absent}. The one copy of the row rules: matrix.js, c4.js and export.js all
 *          call it, so every part of the page hides exactly the same rows.
 */
(function(){
  "use strict";

  var MAP = window.MAP = window.MAP || {};

  // ---- the state every module reads ---------------------------------------
  MAP.D = null;              // the dataset, once it is parsed
  MAP.on = {};               // subject id -> switched on
  MAP.filter = "all";        // the chosen filter chip
  MAP.hasEntry = false;      // the "only rows with an entry" toggle
  MAP.mode = "matrix";       // "matrix" or "c4"
  MAP.c4View = "landscape";  // the C4 view showing
  MAP.explOn = true;         // the explanations switch
  MAP.subjById = {};
  MAP.capById = {};
  MAP.openCell = null;       // the cell whose claim detail is open, if any
  MAP.metricBasis = "production";  // which subjects the coverage metric counts

  // The statuses the coverage metric calls production, under its first selector position. A
  // subject outside this set is still drawn, still counted on the claims line, and simply does
  // not carry the metric under "Production subjects".
  MAP.PRODUCTION_STATUS = {"shipping":1, "ratified":1, "board-approved":1, "mixed":1};

  // The rows two independent systems have to agree on, judged once in
  // infrastructure-wg/model/INTEROPERABILITY-BOUNDARIES.md and carried on every capability as
  // `interop`. One test, used by the filter chip, by the mark on the rows and cards, and by
  // the metric's third selector, so all three always name the same set.
  MAP.isMust = function(cap){ return !!cap && cap.interop === "must"; };

  MAP.mustCaps = function(data){
    return (data && data.capabilities ? data.capabilities : []).filter(MAP.isMust);
  };

  // ---- the page's handles, read once --------------------------------------
  // Every module is loaded at the end of the body, so the elements are all here by now.
  MAP.el = {
    subs:       document.getElementById("subs"),
    body:       document.getElementById("body"),
    stat:       document.getElementById("stat"),
    modes:      document.getElementById("modes"),
    filters:    document.getElementById("filters"),
    hasentry:   document.getElementById("hasentry"),
    panel:      document.getElementById("c4panel"),
    views:      document.getElementById("c4views"),
    claim:      document.getElementById("c4claim"),
    stage:      document.getElementById("stage"),
    explChip:   document.getElementById("explchip"),
    explHint:   document.getElementById("explhint"),
    exportChip: document.getElementById("exportchip"),
    exportMenu: document.getElementById("exportmenu"),
    exportNote: document.getElementById("exportnote"),
    exportShown: document.getElementById("exportshown"),
    search:     document.getElementById("search"),
    searchList: document.getElementById("searchlist"),
    searchNote: document.getElementById("searchnote"),
    metric:     document.getElementById("metric"),
    metricNote: document.getElementById("metricnote"),
    metricBasis: document.getElementById("metricbasis"),
    layersLink: document.getElementById("layerslink"),
    atlasLink:  document.getElementById("atlaslink"),
    commentBtn: document.getElementById("commentbtn"),
    commentNote: document.getElementById("commentnote")
  };

  // ---- the small helpers more than one module needs ------------------------
  MAP.LEVEL_WORDS = {"native":"built in", "via-extension":"through an extension",
                     "partial":"partial", "none":"absent",
                     "conflicts":"conflicts \u2014 these will not work together",
                     "out-of-scope":"out of scope"};

  MAP.cls = function(level){ return String(level).replace(/[^a-z]/g, ""); };

  MAP.esc = function(t){
    return String(t == null ? "" : t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };

  MAP.shown = function(){
    return MAP.D.subjects.filter(function(s){ return MAP.on[s.id]; });
  };

  // ---- the row rules -------------------------------------------------------

  function claim(data, subjectId, capId){
    var row = data.coverage && data.coverage[subjectId];
    return row ? row[capId] : null;
  }

  /* A row is judged only against the subjects that are switched on. Returns null when the row is
   * hidden, otherwise the split of its claims, so the caller does not walk the coverage twice.
   * Matrix mode reads hits[].sources and hits[].note to draw its cells; the drawing reads the
   * level and the subject. */
  MAP.rowHits = function(data, cap, shown, filter, entryOnly){
    var hits = [];
    shown.forEach(function(s){
      var v = claim(data, s.id, cap.id);
      if (v) hits.push({ s: s, level: v[0], conf: v[1], note: v[2], sources: v[3] || [] });
    });
    var reach = hits.filter(function(h){
      return h.level === "native" || h.level === "via-extension";
    });
    var conflicts = hits.filter(function(h){ return h.level === "conflicts"; });
    var partial = hits.filter(function(h){ return h.level === "partial"; });
    var absent = hits.filter(function(h){ return h.level === "none"; });
    var scored = hits.filter(function(h){ return h.level !== "out-of-scope"; });
    var sole = hits.filter(function(h){ return h.level === "native"; });

    if (filter === "overlap" && reach.length < 2) return null;
    if (filter === "thin" && sole.length !== 1) return null;
    if (filter === "gap" && (reach.length > 0 || scored.length === 0)) return null;
    if (filter === "conflict" && conflicts.length === 0) return null;
    if (filter === "connect" && cap.binding !== "connect") return null;
    // The boundary the model decided for this row. "must" means at least one of the four use
    // cases fails outright unless two independent systems agree here, so this chip is the map
    // read against the rows a test would have to cover.
    if (filter === "interop" && cap.interop !== "must") return null;
    if (entryOnly && scored.length === 0) return null;

    return { hits: hits, reach: reach, conflicts: conflicts, partial: partial,
             absent: absent, scored: scored, sole: sole };
  };
})();
