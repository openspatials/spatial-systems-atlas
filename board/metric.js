/* The coverage metric on the header counts line.
 *
 * One question, asked three ways, over a capability list: of the rows being measured, how many
 * does at least one of the subjects being counted have built in; how many built in or through
 * an extension; how many built in, through an extension or partial. Three shares, written as
 * whole numbers, with the count of subjects they were measured over and, when the list is not
 * the whole 117, the count of rows.
 *
 * The three chips make two choices between them. "Production subjects" counts the subjects
 * switched on whose status is shipping, ratified, board-approved or mixed, which is what the
 * working group asked for: what is running now, not what is proposed. "All subjects on" counts
 * every subject switched on, drafts and candidates with them. Both read all 117 rows. The third,
 * "Must-interoperate rows only", counts the same production subjects but narrows the rows to
 * the ones the boundaries page marks must, so the North Star can be read on the rows a test
 * would have to cover rather than on the whole map. The subject switches drive all three: a
 * subject switched off is never counted.
 *
 * The number is a floor. One subject having a capability is not two systems agreeing on it, and
 * this page has no measurement of whether two implementations of the same row work together, so
 * a high number here says the ground is occupied, not that the ground is joined up.
 *
 * The same shape of arithmetic runs on the atlas, from the same dataset, so the two pages agree.
 *
 * Contract:
 *   window.MAP.updateMetric()   recompute and rewrite the line, for the controls as they stand
 *   window.MAP.wireMetric()     hang the two chips, once, at start-up
 *   window.MAP.metricRead()     the numbers, without touching the page
 *   window.__metric             {read, basis, counted} - a check can read the metric without
 *                               clicking anything
 */
(function(){
  "use strict";

  var MAP = window.MAP;

  var FALLBACK_NOTE =
    "Covered counts capabilities, not quality. A capability counts as built in when at least " +
    "one of the subjects being counted has it built in; with extensions adds the ones only an " +
    "extension reaches; with partial adds the ones only partly reached. The first two chips " +
    "choose which subjects count; the third keeps the production subjects and narrows the rows " +
    "to the ones two independent systems must agree on. Treat every figure as a floor on what " +
    "exists, not a verdict on whether two systems will work together.";

  /* The subjects the metric counts: the ones switched on, and under the first and third chips
   * only those whose status is one of the production ones. The status set lives in
   * predicates.js so the page has one copy of it. */
  function counted(){
    var shown = MAP.shown();
    if(MAP.metricBasis === "all") return shown;
    return shown.filter(function(s){ return !!MAP.PRODUCTION_STATUS[s.status]; });
  }

  /* The rows the metric measures. Two of the chips measure all 117; the third measures only the
   * rows marked must, which is the same set the "Must interoperate" filter chip keeps, because
   * both ask predicates.js the one question. */
  function measured(){
    return MAP.metricBasis === "must" ? MAP.mustCaps(MAP.D) : MAP.D.capabilities;
  }

  /* One pass over the coverage of the counted subjects. A capability is asked three questions
   * and answers each of them once, so the three shares always nest: built in cannot exceed with
   * extensions, and with extensions cannot exceed with partial. */
  function metricRead(){
    var D = MAP.D, subs = counted(), caps = measured();
    var total = caps.length;
    var builtIn = 0, withExt = 0, withPartial = 0;
    caps.forEach(function(c){
      var n = false, x = false, p = false;
      for(var i = 0; i < subs.length; i++){
        var row = D.coverage[subs[i].id];
        if(!row) continue;
        var v = row[c.id];
        if(!v) continue;
        if(v[0] === "native") n = true;
        else if(v[0] === "via-extension") x = true;
        else if(v[0] === "partial") p = true;
      }
      if(n) builtIn++;
      if(n || x) withExt++;
      if(n || x || p) withPartial++;
    });
    function pct(k){ return total ? Math.round(k * 100 / total) : 0; }
    return {basis: MAP.metricBasis, subjects: subs.length, total: total,
            allRows: D.capabilities.length,
            builtIn: builtIn, withExtensions: withExt, withPartial: withPartial,
            builtInPct: pct(builtIn), withExtensionsPct: pct(withExt),
            withPartialPct: pct(withPartial),
            subjectIds: subs.map(function(s){ return s.id; }),
            capabilityIds: caps.map(function(c){ return c.id; })};
  }

  function updateMetric(){
    var el = MAP.el.metric;
    if(!el || !MAP.D) return;
    var m = metricRead();
    el.textContent = "Covered: " + m.builtInPct + "% built in \u00B7 " +
                     m.withExtensionsPct + "% with extensions \u00B7 " +
                     m.withPartialPct + "% with partial \u00B7 counting " +
                     m.subjects + " subject" + (m.subjects === 1 ? "" : "s") +
                     // Only the third chip changes the rows, so only it says which rows.
                     (m.total === m.allRows ? "" :
                      " \u00B7 over " + m.total + " must-interoperate rows");
    var note = MAP.el.metricNote;
    if(note && !note.textContent){
      var tips = MAP.D.tooltips || {};
      note.textContent = tips["metric.covered"] || FALLBACK_NOTE;
    }
    var chips = MAP.el.metricBasis;
    if(chips) Array.prototype.forEach.call(chips.querySelectorAll("[data-basis]"), function(b){
      b.setAttribute("aria-pressed", String(b.dataset.basis === MAP.metricBasis));
    });
  }

  function setBasis(next){
    if(next !== "production" && next !== "all" && next !== "must") return;
    if(next === MAP.metricBasis){ updateMetric(); return; }
    MAP.metricBasis = next;
    MAP.hideTip();
    updateMetric();
    if(MAP.writeHash) MAP.writeHash();
  }

  function wireMetric(){
    window.__metric = {read: metricRead,
                       basis: function(){ return MAP.metricBasis; },
                       counted: function(){ return counted().map(function(s){ return s.id; }); },
                       set: setBasis};
    var chips = MAP.el.metricBasis;
    if(!chips) return;
    chips.addEventListener("click", function(e){
      var b = e.target.closest("[data-basis]");
      if(b) setBasis(b.dataset.basis);
    });
  }

  MAP.updateMetric = updateMetric;
  MAP.wireMetric = wireMetric;
  MAP.metricRead = metricRead;
  MAP.setMetricBasis = setBasis;
})();
