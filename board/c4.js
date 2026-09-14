/* The territory map drawn as planes of cards.
 *
 * The same claims the matrix shows, in the three C4 levels, drawn in the language of the
 * narrative board: planes stacked top to bottom, each a titled band of cards under an eyebrow
 * label, and curves measured between the cards after the browser has laid them out, painted
 * into one absolutely positioned SVG that sits behind the bands so the lines show in the gaps.
 *
 * Everything here is written by this file. No library, no script from anywhere else, no fetch.
 * The only work done on a resize is measuring the cards again and repainting the curves.
 *
 * Contract:
 *   window.C4.views(data)                   -> [{id, label, kind}] in the order to offer them
 *   window.C4.render(el, data, state, view) -> Promise, never rejects
 *        data  : the parsed territory.json object
 *        state : { subjectsOn, filter, entryOnly, onView, onCapability }
 *                subjectsOn is a Set, an array, or an id -> boolean map; a missing selection
 *                reads as all of them. onView(id) is called when a group card is clicked;
 *                onCapability(id) when a capability card is clicked. Both are optional.
 *        view  : "landscape", "groups", or a capability group id
 *        resolves with { ok, view, planes, cards, wires, subjects, capabilities } and never
 *        rejects; an empty view resolves with ok:true and a sentence on the page.
 *   window.C4.rowHits(data, cap, shown, filter, entryOnly) -> the row rules, which live in
 *        predicates.js as window.MAP.rowHits and are only passed on here, so every part of the
 *        page hides exactly the same rows. A page that loads this file without predicates.js
 *        beside it can draw the landscape and the groups, but not one group's own view.
 *   window.C4.wires() -> repaint the curves of the drawing on screen. Called on resize from
 *        inside this file; exported so the page can call it after it moves anything.
 */
(function () {
  "use strict";

  var LEVEL_WORDS = {
    "native": "built in",
    "via-extension": "through an extension",
    "partial": "partial",
    "none": "absent",
    "conflicts": "conflicts \u2014 these will not work together",
    "out-of-scope": "out of scope"
  };

  /* Only these three become a curve. Partial is counted on the capability card instead: with
   * every subject on, drawing partial would put more than four hundred curves into a single
   * group and nothing could be read. Ink, blue and red, the legend's own colours; the stroke
   * comes from the stylesheet so the drawing follows the page between light and dark. */
  var LINE_LEVEL = { "native": 1, "via-extension": 1, "conflicts": 1 };

  var DOT = " \u00B7 ";

  /* The plane a capability group sits on, written in plain words. The database column holds
   * "engine", "interop" and "entry"; those are the project's own shorthand and mean nothing to
   * a reader who has not seen it before, so the card says what each one is instead. The data
   * value itself is untouched. */
  var PLANE_WORDS = { "engine": "inside one system", "interop": "between systems",
                      "entry": "getting content in" };

  // ---- small helpers ------------------------------------------------------

  function esc(t) {
    return String(t == null ? "" : t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function cls(level) { return String(level).replace(/[^a-z]/g, ""); }

  function plural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }

  /* The subjects switched on, in the dataset's own order. A missing or empty selection is read
   * as "all of them", so a caller that has not built its set yet still gets a drawing. */
  function subjectsOn(data, state) {
    var sel = state && state.subjectsOn, has;
    if (!sel) has = function () { return true; };
    else if (typeof sel.has === "function") has = function (id) { return sel.has(id); };
    else if (Object.prototype.toString.call(sel) === "[object Array]")
      has = function (id) { return sel.indexOf(id) >= 0; };
    else has = function (id) { return !!sel[id]; };
    return data.subjects.filter(function (s) { return has(s.id); });
  }

  function claim(data, subjectId, capId) {
    var row = data.coverage && data.coverage[subjectId];
    return row ? row[capId] : null;
  }

  /* The row rules are shared with matrix mode and with the export, so they live in one file of
   * their own, predicates.js, and this one only passes them on. */
  var rowHits = window.MAP && window.MAP.rowHits;

  function capsOfGroup(data, groupId) {
    return data.capabilities.filter(function (c) { return c.group_id === groupId; });
  }

  function displayGroups(data) {
    if (data.display_groups && data.display_groups.length) return data.display_groups;
    var byKind = {}, order = [];
    data.subjects.forEach(function (s) {
      if (!byKind[s.kind]) { byKind[s.kind] = []; order.push(s.kind); }
      byKind[s.kind].push(s.id);
    });
    return order.map(function (k) { return { id: k, name: k, subjects: byKind[k] }; });
  }

  /* The display group a subject is drawn in, by id, so a subject card can carry it as a label
   * without walking the list again. */
  function groupLabels(data) {
    var out = {};
    displayGroups(data).forEach(function (dg) {
      (dg.subjects || []).forEach(function (id) { out[id] = dg.name; });
    });
    return out;
  }

  // ---- the list of views --------------------------------------------------

  function views(data) {
    var out = [{ id: "landscape", label: "Landscape", kind: "landscape" },
               { id: "groups", label: "Groups", kind: "groups" }];
    (data && data.groups ? data.groups : []).forEach(function (g) {
      out.push({ id: g.id, label: g.name, kind: "group" });
    });
    return out;
  }

  // ---- the parts a plane is made of ---------------------------------------

  function planeHTML(no, title, sub, cards, tip) {
    return '<section class="c4-plane">' +
             '<div class="c4-plane-head">' +
               '<span class="c4-plane-no">' + esc(no) + '</span>' +
               '<h3 class="c4-plane-title"' +
                 (tip ? ' tabindex="0" data-tip="' + esc(tip) + '"' : '') + '>' +
                 esc(title) + '</h3>' +
               (sub ? '<span class="c4-plane-sub">' + esc(sub) + '</span>' : '') +
             '</div>' +
             '<div class="c4-cards">' + cards + '</div>' +
           '</section>';
  }

  /* One card. `tag` is button for the two clickable kinds and div for the rest; a div card is
   * still reachable by keyboard, because hovering is not the only way to follow a curve. */
  function cardHTML(o) {
    var tag = o.click ? "button" : "div";
    var attrs = ' class="c4-card' + (o.kind ? " c4-" + o.kind : "") + '"';
    if (o.click) attrs += ' type="button"'; else attrs += ' tabindex="0"';
    if (o.node) attrs += ' data-node="' + esc(o.node) + '"';
    if (o.click) attrs += ' data-click="' + esc(o.click) + '" data-id="' + esc(o.id) + '"';
    if (o.tip) attrs += ' data-tip="' + esc(o.tip) + '"';
    if (o.label) attrs += ' aria-label="' + esc(o.label) + '"';
    // `must` marks a capability two independent systems have to agree on. The attribute draws
    // the edge and the word says it in text, carrying the row's own sentence as its
    // explanation.
    if (o.must) attrs += ' data-must="1"';
    return "<" + tag + attrs + ">" +
             (o.over ? '<span class="c4-card-over">' + esc(o.over) + "</span>" : "") +
             (o.must ? '<span class="c4-must" tabindex="0" data-tip="interop.must" ' +
                       'data-tip-text="' + esc(o.mustWhy || "") +
                       '">must interoperate</span>' : "") +
             '<span class="c4-card-name">' + esc(o.name) + "</span>" +
             (o.meta ? '<span class="c4-card-meta">' + esc(o.meta) + "</span>" : "") +
             (o.note ? '<span class="c4-card-note">' + esc(o.note) + "</span>" : "") +
             (o.foot ? '<span class="c4-card-foot">' + o.foot + "</span>" : "") +
           "</" + tag + ">";
  }

  // ---- level one: the landscape -------------------------------------------

  /* Every subject switched on, in the page's own chip groups, one plane each, and below them
   * the single stack they are all measured against. No curves: this view is about who is on
   * the map, not about which row they reach. */
  function landscape(data, state) {
    var shown = subjectsOn(data, state), onIds = {};
    shown.forEach(function (s) { onIds[s.id] = true; });
    var byId = {};
    data.subjects.forEach(function (s) { byId[s.id] = s; });

    var html = "", planes = 0, cards = 0;
    displayGroups(data).forEach(function (dg) {
      var members = (dg.subjects || []).filter(function (id) { return onIds[id]; });
      if (!members.length) return;
      var inner = members.map(function (id) {
        var s = byId[id];
        var row = data.coverage[s.id] || {}, n = 0;
        for (var capId in row) {
          if (!Object.prototype.hasOwnProperty.call(row, capId)) continue;
          var lvl = row[capId][0];
          if (lvl === "native" || lvl === "via-extension" || lvl === "partial") n++;
        }
        cards++;
        return cardHTML({ kind: "subject", node: "s:" + s.id, tip: s.id, name: s.name,
                          meta: [s.kind, s.status].filter(Boolean).join(DOT),
                          note: "has " + n + " capabilit" + (n === 1 ? "y" : "ies") });
      }).join("");
      planes++;
      html += planeHTML("BAND " + planes, dg.name,
                        plural(members.length, "subject") + " on", inner);
    });

    planes++;
    cards++;
    html += planeHTML("BAND " + planes, "Measured against",
                      "one stack, the same for every subject",
                      cardHTML({ kind: "stack", node: "stack", name: "Open metaverse stack",
                                 meta: "the whole map",
                                 note: data.capabilities.length + " capabilities in " +
                                       data.groups.length + " groups" }));

    return { html: html, lines: [], planes: planes, cards: cards,
             subjects: shown.map(function (s) { return s.id; }), capabilities: [] };
  }

  // ---- level two: the groups ----------------------------------------------

  /* The fourteen capability groups on one plane, and no subject cards: thirty-five subjects
   * against fourteen groups is a wall of curves nobody can read. Each card says how big the
   * group is, how many of the subjects on reach any of it, and how it splits between rows
   * fixed when the content is made and rows agreed when two systems connect. */
  function groups(data, state) {
    var shown = subjectsOn(data, state);
    var cards = 0;
    var inner = data.groups.map(function (g) {
      var caps = capsOfGroup(data, g.id);
      var reached = shown.filter(function (s) {
        return caps.some(function (c) {
          var v = claim(data, s.id, c.id);
          return v && (v[0] === "native" || v[0] === "via-extension");
        });
      }).length;
      var protocol = caps.filter(function (c) { return c.binding === "connect"; }).length;
      cards++;
      return cardHTML({ kind: "group", node: "g:" + g.id, tip: g.id, click: "view", id: g.id,
                        over: g.plane ? (PLANE_WORDS[g.plane] || g.plane) : "",
                        name: g.name,
                        meta: caps.length + " capabilities" + DOT +
                              (caps.length - protocol) + " format" + DOT +
                              protocol + " protocol",
                        note: reached + " of the " + shown.length +
                              " subjects on have some of it",
                        label: g.name + ", " + caps.length + " capabilities, " + reached +
                               " of the " + shown.length +
                               " subjects on have some of it. Open this group." });
    }).join("");

    return { html: planeHTML("BAND 1", "Capability groups",
                             "click a group to open it", inner),
             lines: [], planes: 1, cards: cards,
             subjects: shown.map(function (s) { return s.id; }),
             capabilities: data.capabilities.map(function (c) { return c.id; }) };
  }

  // ---- level three: one group ---------------------------------------------

  /* Two planes. The capabilities of the group that pass the filter on top, the subjects that
   * have a curve below, and one curve per claim at built in, through an extension or conflicts.
   * Partial is counted on the capability card and said in the plane's own line. */
  function group(data, state, groupId) {
    var g = data.groups.filter(function (x) { return x.id === groupId; })[0];
    if (!g) return null;
    var shown = subjectsOn(data, state);
    var filter = (state && state.filter) || "all";
    var entryOnly = !!(state && state.entryOnly);

    var caps = [], bundle = {};
    capsOfGroup(data, g.id).forEach(function (c) {
      var b = rowHits(data, c, shown, filter, entryOnly);
      if (b) { caps.push(c); bundle[c.id] = b; }
    });
    if (!caps.length) return { empty: true, why: "Nothing in " + g.name +
                               " matches the subjects and the filter chosen." };

    // A subject earns a card only if it will have a curve.
    var lines = [], keep = {};
    caps.forEach(function (c) {
      bundle[c.id].hits.forEach(function (h) {
        if (!LINE_LEVEL[h.level]) return;
        keep[h.s.id] = true;
        lines.push({ a: "s:" + h.s.id, b: "c:" + c.id, level: h.level });
      });
    });

    var order = {}, labels = groupLabels(data), i = 0;
    displayGroups(data).forEach(function (dg) {
      (dg.subjects || []).forEach(function (id) { order[id] = i++; });
    });
    var actors = shown.filter(function (s) { return keep[s.id]; }).sort(function (a, b) {
      var x = order[a.id], y = order[b.id];
      if (x === undefined) x = 1e6;
      if (y === undefined) y = 1e6;
      return x - y;
    });

    var capCards = caps.map(function (c) {
      var b = bundle[c.id];
      var word = c.binding === "connect" ? "protocol" : "format";
      var foot = '<span class="c4-t n">built in ' + b.reach.filter(function (h) {
                   return h.level === "native"; }).length + "</span>" +
                 '<span class="c4-t x">extension ' + b.reach.filter(function (h) {
                   return h.level === "via-extension"; }).length + "</span>" +
                 '<span class="c4-t p">partial ' + b.partial.length + "</span>" +
                 '<span class="c4-t c">conflicts ' + b.conflicts.length + "</span>" +
                 '<span class="c4-t z">absent ' + b.absent.length + "</span>";
      // This block is the drawing on its own and never reads window.MAP, so it asks the row
      // its own question rather than borrowing the page's helper.
      var must = c.interop === "must";
      return cardHTML({ kind: "cap", node: "c:" + c.id, tip: c.id, click: "capability",
                        id: c.id, over: word, name: c.name, foot: foot,
                        must: must, mustWhy: c.interop_reason,
                        label: c.name + ", " + word + " capability" +
                               (must ? ", must interoperate" : "") +
                               ". Open the claims on it." });
    }).join("");

    var subCards = actors.map(function (s) {
      return cardHTML({ kind: "subject", node: "s:" + s.id, tip: s.id, name: s.name,
                        over: labels[s.id] || s.kind,
                        meta: [s.kind, s.status].filter(Boolean).join(DOT) });
    }).join("");

    var html = planeHTML("BAND 1", "Capabilities \u00B7 " + g.name,
                         "Partial claims are counted, not drawn.", capCards, g.id) +
               planeHTML("BAND 2", "Subjects",
                         plural(lines.length, "curve") + " from " +
                         plural(actors.length, "subject"), subCards);

    return { html: html, lines: lines, planes: 2, cards: caps.length + actors.length,
             subjects: actors.map(function (s) { return s.id; }),
             capabilities: caps.map(function (c) { return c.id; }) };
  }

  function build(data, state, view) {
    if (!data || !data.groups) return null;
    if (view === "landscape") return landscape(data, state);
    if (view === "groups") return groups(data, state);
    return group(data, state, view);
  }

  // ---- the curves ---------------------------------------------------------

  /* One drawing is on screen at a time. Its element, its board and its curve list are kept
   * here so a resize can measure the cards again without rebuilding anything. */
  var live = null, lastW = 0, lastH = 0, frame = 0;

  function rectIn(board, el) {
    var a = board.getBoundingClientRect(), b = el.getBoundingClientRect();
    return { x: b.left - a.left, y: b.top - a.top, w: b.width, h: b.height };
  }

  /* Measure the cards where the browser actually put them and paint one curve per claim, from
   * the top edge of the subjects plane to the bottom edge of the capabilities plane, so every
   * curve lives in the gap between the two bands. The same shape the narrative board draws. */
  function wires() {
    if (!live || !live.board || !live.board.isConnected) return;
    var board = live.board, svg = live.svg;
    if (!svg) return;
    var bw = board.offsetWidth, bh = board.offsetHeight;
    svg.setAttribute("width", bw);
    svg.setAttribute("height", bh);
    svg.setAttribute("viewBox", "0 0 " + bw + " " + bh);
    lastW = bw; lastH = bh;

    var out = "";
    live.lines.forEach(function (l) {
      var a = live.node[l.a], b = live.node[l.b];
      if (!a || !b) return;
      var pa = a.closest(".c4-plane"), pb = b.closest(".c4-plane");
      if (!pa || !pb) return;
      var A = rectIn(board, a), B = rectIn(board, b);
      var PA = rectIn(board, pa), PB = rectIn(board, pb);
      var ax = A.x + A.w / 2, ay = PA.y;                 // top edge of the subjects plane
      var bx = B.x + B.w / 2, by = PB.y + PB.h;          // bottom edge of the capabilities plane
      var mid = by + (ay - by) / 2;
      out += '<path class="c4-wire ' + cls(l.level) + '" data-a="' + esc(l.a) +
             '" data-b="' + esc(l.b) + '" d="M' + ax.toFixed(1) + " " + ay.toFixed(1) +
             " C " + ax.toFixed(1) + " " + mid.toFixed(1) + ", " + bx.toFixed(1) + " " +
             mid.toFixed(1) + ", " + bx.toFixed(1) + " " + by.toFixed(1) + '"/>';
      out += '<circle class="c4-dot ' + cls(l.level) + '" data-a="' + esc(l.a) +
             '" data-b="' + esc(l.b) + '" cx="' + bx.toFixed(1) + '" cy="' + by.toFixed(1) +
             '" r="2.6"/>';
    });
    svg.innerHTML = out;
    live.paths = Array.prototype.slice.call(svg.childNodes);
  }

  function schedule() {
    if (frame) return;
    frame = (window.requestAnimationFrame || function (f) { return setTimeout(f, 16); })(
      function () { frame = 0; wires(); });
  }

  function onResize() {
    if (!live || !live.board || !live.board.isConnected) return;
    schedule();
  }

  window.addEventListener("resize", onResize);
  if (window.ResizeObserver) {
    // The SVG is absolutely positioned, so painting it never changes the board's own size;
    // the guard below is belt and braces against an observer feeding itself.
    var ro = new ResizeObserver(function () {
      if (!live || !live.board) return;
      if (live.board.offsetWidth === lastW && live.board.offsetHeight === lastH) return;
      schedule();
    });
    window.__c4ro = ro;
  }
  if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
    document.fonts.ready.then(function () { if (live) wires(); });
  }

  // ---- highlighting -------------------------------------------------------

  /* Hover or focus a card and the claims it is part of come forward: its curves, and the cards
   * at the other end of them. Everything else fades. It reads the same way from either plane. */
  function focusOn(key) {
    if (!live) return;
    var board = live.board;
    if (!key) {
      board.classList.remove("c4-focus");
      live.cards.forEach(function (c) { c.classList.remove("c4-on"); });
      (live.paths || []).forEach(function (p) { p.classList.remove("c4-on"); });
      live.focused = null;
      return;
    }
    var near = {};
    near[key] = 1;
    live.lines.forEach(function (l) {
      if (l.a === key) near[l.b] = 1;
      else if (l.b === key) near[l.a] = 1;
    });
    board.classList.add("c4-focus");
    live.cards.forEach(function (c) {
      c.classList.toggle("c4-on", !!near[c.getAttribute("data-node")]);
    });
    (live.paths || []).forEach(function (p) {
      var a = p.getAttribute("data-a"), b = p.getAttribute("data-b");
      p.classList.toggle("c4-on", a === key || b === key);
    });
    live.focused = key;
  }

  function nodeOf(target) {
    return target && target.closest ? target.closest("[data-node]") : null;
  }

  function wire(el, state) {
    el.addEventListener("mouseover", function (e) {
      var n = nodeOf(e.target);
      if (n) focusOn(n.getAttribute("data-node"));
    });
    el.addEventListener("mouseout", function (e) {
      var n = nodeOf(e.target);
      if (!n) return;
      if (e.relatedTarget && n.contains(e.relatedTarget)) return;
      if (document.activeElement && nodeOf(document.activeElement)) return;
      focusOn(null);
    });
    el.addEventListener("focusin", function (e) {
      var n = nodeOf(e.target);
      focusOn(n ? n.getAttribute("data-node") : null);
    });
    el.addEventListener("focusout", function (e) {
      var n = nodeOf(e.target);
      if (n && n.getAttribute("data-node") === (live && live.focused)) focusOn(null);
    });
    el.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("[data-click]") : null;
      if (!b) return;
      var what = b.getAttribute("data-click"), id = b.getAttribute("data-id");
      if (what === "view" && state && typeof state.onView === "function") state.onView(id);
      else if (what === "capability" && state && typeof state.onCapability === "function")
        state.onCapability(id);
    });
  }

  // ---- rendering ----------------------------------------------------------

  function nothing(el, why) {
    el.innerHTML = '<p class="c4-fallback">' + esc(why) +
                   " Turn on more subjects, or choose Everything.</p>";
  }

  function render(el, data, state, view) {
    if (!el) return Promise.resolve({ ok: false, view: view, error: "no element given" });
    var built;
    try {
      built = build(data, state, view);
    } catch (err) {
      live = null;
      el.innerHTML = '<p class="c4-fallback">The drawing could not be built: ' +
                     esc(err && err.message ? err.message : String(err)) + "</p>";
      return Promise.resolve({ ok: false, view: view,
                               error: String(err && err.message ? err.message : err) });
    }
    if (!built) {
      live = null;
      el.innerHTML = '<p class="c4-fallback">There is no view called ' + esc(view) + ".</p>";
      return Promise.resolve({ ok: false, view: view, error: "unknown view" });
    }
    if (built.empty) {
      live = null;
      nothing(el, built.why);
      return Promise.resolve({ ok: true, view: view, empty: true, planes: 0, cards: 0,
                               wires: 0, subjects: [], capabilities: [] });
    }

    el.innerHTML = '<div class="c4-board"><svg class="c4-wires" aria-hidden="true" ' +
                   'xmlns="http://www.w3.org/2000/svg"></svg>' + built.html + "</div>";
    var board = el.querySelector(".c4-board");
    var node = {};
    var cards = Array.prototype.slice.call(board.querySelectorAll("[data-node]"));
    cards.forEach(function (c) { node[c.getAttribute("data-node")] = c; });

    live = { el: el, board: board, svg: board.querySelector(".c4-wires"),
             lines: built.lines, node: node, cards: cards, paths: [], focused: null };
    if (window.__c4ro) { try { window.__c4ro.disconnect(); window.__c4ro.observe(board); }
                         catch (e) {} }
    wire(board, state);
    wires();

    return Promise.resolve({ ok: true, view: view, planes: built.planes, cards: built.cards,
                             wires: built.lines.length, subjects: built.subjects,
                             capabilities: built.capabilities });
  }

  window.C4 = {
    render: render,
    views: views,
    rowHits: rowHits,
    wires: wires,
    LEVEL_WORDS: LEVEL_WORDS
  };
})();

/* C4 mode on the map page: the view chips, the drawing, and the claim panel.
 *
 * The block above is the drawing and knows nothing about this page. This one is the page's side
 * of it: it reads the shared state predicates.js opens, hands it to the drawing, and puts the
 * capability card just clicked on screen as the same row matrix.js draws.
 *
 * Skipped whole when window.MAP is absent, so the drawing above can still be loaded on its own
 * by a bench page that has none of this page's elements.
 *
 * Contract:
 *   window.MAP.drawC4()          redraw the view showing, for the controls as they stand
 *   window.MAP.buildC4Views()    write the view chips, once, at start-up
 *   window.MAP.setView(id)       switch to one view
 *   window.MAP.openClaim(capId)  open the claim panel for one capability
 *   window.MAP.closeClaim()      close it
 */
(function () {
  "use strict";

  var MAP = window.MAP;
  if (!MAP) return;

  // One drawing runs at a time; a control changed while one is in flight is queued, so the
  // picture always ends on the controls as they stand.
  var c4busy = false, c4dirty = false;

  function c4state(){
    return {subjectsOn: MAP.on, filter: MAP.filter, entryOnly: MAP.hasEntry,
            onView: setView, onCapability: openClaim};
  }

  function drawC4(){
    var stageEl = MAP.el.stage;
    if(!MAP.D || !stageEl) return;
    // The panel belongs to one card in the drawing that is about to be replaced.
    closeClaim();
    if(c4busy){ c4dirty = true; return; }
    c4busy = true; c4dirty = false;
    window.__c4pending = true;
    window.C4.render(stageEl, MAP.D, c4state(), MAP.c4View)
      .then(function(r){
        c4busy = false;
        window.__c4 = r;              // the last result, for a check to read
        if(c4dirty) drawC4();
        else window.__c4pending = false;
      });
  }

  // The claim panel: the capability card just clicked, written out as the row the matrix draws,
  // limited to the subjects switched on. Every cell in it opens the same claim detail.
  function closeClaim(){
    MAP.closeDetail();
    var claimEl = MAP.el.claim;
    if(!claimEl) return;
    claimEl.className = "c4-claim hidden";
    claimEl.innerHTML = "";
  }

  function openClaim(capId){
    var claimEl = MAP.el.claim, esc = MAP.esc;
    var c = MAP.capById[capId];
    if(!c || !claimEl) return;
    var shown = MAP.shown();
    var b = MAP.rowHits(MAP.D, c, shown, MAP.filter, MAP.hasEntry);
    if(!b){ closeClaim(); return; }
    MAP.closeDetail();
    MAP.hideTip();
    claimEl.innerHTML = '<div class="c4-claim-head"><span class="setlabel">Claims on this '+
      'capability &mdash; '+esc(c.name)+'</span>'+
      '<button type="button" class="c4-close" id="c4close">Close</button></div>'+
      '<div class="rows">'+MAP.rowHTML(c, b, shown.length)+'</div>';
    claimEl.className = "c4-claim";
    document.getElementById("c4close").addEventListener("click", function(){
      closeClaim();
      var card = MAP.el.stage.querySelector('[data-node="c:'+
                 String(capId).replace(/["\\]/g, "\\$&")+'"]');
      if(card) card.focus();
    });
    claimEl.scrollIntoView({block:"nearest"});
  }

  function setView(id){
    if(!id || id === MAP.c4View){ return; }
    MAP.c4View = id;
    Array.prototype.forEach.call(MAP.el.views.querySelectorAll("[data-v]"), function(x){
      x.setAttribute("aria-pressed", String(x.dataset.v === MAP.c4View));
    });
    closeClaim();
    MAP.hideTip();
    if(MAP.writeHash) MAP.writeHash();
    drawC4();
  }

  function buildC4Views(){
    var viewsEl = MAP.el.views, esc = MAP.esc;
    var html = "";
    window.C4.views(MAP.D).forEach(function(v){
      // A group chip explains what a group view is; the group's own definition is on the
      // plane title inside it.
      var tip = v.kind === "group" ? "c4.view.group" : "c4.view."+v.id;
      html += '<button type="button" class="chip" data-v="'+esc(v.id)+'" aria-pressed="'+
              (v.id === MAP.c4View)+'" data-tip="'+esc(tip)+'">'+esc(v.label)+'</button>';
    });
    viewsEl.innerHTML = html;
    viewsEl.addEventListener("click", function(e){
      var b = e.target.closest("[data-v]"); if(!b) return;
      setView(b.dataset.v);
    });
  }

  MAP.drawC4 = drawC4;
  MAP.buildC4Views = buildC4Views;
  MAP.setView = setView;
  MAP.openClaim = openClaim;
  MAP.closeClaim = closeClaim;
})();
