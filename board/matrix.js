/* Matrix mode: the rows, and the claim detail a cell opens.
 *
 * One capability is one row: the name block, the binding word, a cell per claim among the
 * subjects switched on, and any conflict note. Which rows are drawn is not decided here -
 * MAP.rowHits in predicates.js decides that for every part of the page.
 *
 * rowHTML is written once and used twice: matrix mode lays out every row it passes, and the
 * claim panel in C4 mode calls it for the capability card just clicked, so a claim opens
 * identically wherever the row is drawn. The cell handler below is bound to both places.
 *
 * Contract:
 *   window.MAP.rowHTML(cap, hits, shownCount)  one capability written out as a row
 *   window.MAP.renderMatrix(shown)             redraw every row for the subjects switched on
 *   window.MAP.closeDetail()                   close the claim detail, if one is open
 */
(function(){
  "use strict";

  var MAP = window.MAP;
  var esc = MAP.esc, cls = MAP.cls, LEVEL_WORDS = MAP.LEVEL_WORDS;

  function rowHTML(c, b, shownCount){
    var hits = b.hits, reach = b.reach, conf = b.conflicts, scored = b.scored;

    var cells = hits.map(function(h){
      var n = (h.sources || []).length;
      return '<button type="button" class="cell '+cls(h.level)+'" data-s="'+esc(h.s.id)+
             '" data-c="'+esc(c.id)+'" aria-expanded="false" title="'+
             esc(h.note || "no note recorded")+'" aria-label="'+esc(h.s.name)+", "+
             esc(LEVEL_WORDS[h.level] || h.level)+", "+n+' source'+(n===1?"":"s")+
             '. Open the claim detail.">'+esc(h.s.name)+'</button>';
    }).join("");
    if(!cells) cells = '<span class="empty">nothing checked here yet</span>';
    else if(reach.length === 0 && scored.length > 0)
      cells += ' <span class="empty">&larr; No native or extension support recorded among checked subjects</span>';

    var notes = conf.map(function(h){
      return '<div class="note"><b>'+h.s.name+' conflicts:</b> '+h.note+'</div>';
    }).join("");

    var bindWord = c.binding==="connect" ? "protocol" : "format";
    // The small mark on a row two independent systems have to agree on. It carries the row's
    // own sentence, so hovering or tabbing to it gives the reason this row was decided that
    // way rather than the general rule, which stays on the legend.
    var must = MAP.isMust(c)
      ? '<div class="mustmark" tabindex="0" data-tip="interop.must" data-tip-text="'+
        esc(c.interop_reason || "")+'">must interoperate</div>'
      : "";
    return '<div class="row'+(must ? " mustrow" : "")+'" data-cap="'+esc(c.id)+
           '" tabindex="-1"><div>'+
           '<div class="cname" tabindex="0" data-tip="'+esc(c.id)+'">'+c.name+'</div>'+
           '<div class="cdef">'+c.definition+'</div>'+
           '<div class="cscore" tabindex="0" data-tip="row.scored">'+
           scored.length+' of '+shownCount+' subjects checked here</div>'+must+'</div>'+
           '<div class="bind '+c.binding+'" tabindex="0" data-tip="binding.'+bindWord+'">'+
           bindWord+'</div>'+
           '<div class="cells">'+cells+'</div>'+notes+'</div>';
  }

  function renderMatrix(shown){
    var D = MAP.D;
    MAP.openCell = null;
    var html = "";
    D.groups.forEach(function(g){
      var caps = D.capabilities.filter(function(c){ return c.group_id === g.id; });
      var rows = "";
      caps.forEach(function(c){
        // One copy of the row rules, in predicates.js, so this mode and the drawing hide the
        // same rows. Null means the row does not pass the filter or the toggle.
        var b = MAP.rowHits(D, c, shown, MAP.filter, MAP.hasEntry);
        if(!b) return;
        rows += rowHTML(c, b, shown.length);
      });
      if(rows) html += '<div class="grpname" tabindex="0" data-tip="'+esc(g.id)+'">'+g.name+
                       '</div><div class="rows">'+rows+'</div>';
    });
    MAP.el.body.innerHTML = html ||
      '<p class="lede">Nothing matches. Turn on more subjects, or choose Everything.</p>';
  }

  // ---- claim detail -------------------------------------------------------
  function sourceItem(x){
    var url = x[0], title = x[1] || "untitled source", kind = x[2] || "", quote = x[3] || "";
    var head;
    if(url && /^https?:\/\//i.test(url))
      head = '<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(title)+'</a>';
    else
      head = '<span class="sprivate">'+esc(title)+' \u2014 local evidence, not public</span>';
    if(kind) head += '<span class="skind">'+esc(kind)+'</span>';
    return '<li>'+head+
           (quote ? '<div class="squote">\u201C'+esc(quote)+'\u201D</div>' : '')+'</li>';
  }

  function detailHTML(s, c, v){
    var srcs = v[3] || [];
    var h = '<div class="detail" role="group" aria-label="Claim detail">'+
            '<div class="dhead">'+esc(s.name)+' \u2014 '+esc(c.name)+'</div>'+
            '<div class="dmeta"><span tabindex="0" data-tip="level.'+esc(v[0])+'">'+
            esc(LEVEL_WORDS[v[0]] || v[0])+'</span> \u00B7 confidence: '+
            '<span tabindex="0" data-tip="confidence.'+esc(v[1])+'">'+esc(v[1])+'</span></div>';
    h += '<div class="dnote">'+(v[2] ? esc(v[2]) : '<i>No note recorded for this claim.</i>')+'</div>';
    h += '<div class="dsub">Sources ('+srcs.length+')</div>';
    h += srcs.length
       ? '<ul class="slist">'+srcs.map(sourceItem).join("")+'</ul>'
       : '<ul class="slist"><li class="sprivate">No source recorded for this claim yet.</li></ul>';
    return h + '<div class="dfoot">Press Escape, or click the cell again, to close.</div></div>';
  }

  function closeDetail(){
    if(!MAP.openCell) return;
    var row = MAP.openCell.parentNode && MAP.openCell.parentNode.parentNode;
    var d = row && row.querySelector(".detail");
    if(d) d.parentNode.removeChild(d);
    MAP.openCell.setAttribute("aria-expanded", "false");
    MAP.openCell = null;
  }

  // The same handler for the matrix rows and for the claim panel in C4 mode, so a cell opens
  // its claim the same way wherever the row is drawn.
  function cellClick(e){
    var b = e.target.closest ? e.target.closest(".cell") : null;
    if(!b) return;
    var again = (b === MAP.openCell);
    closeDetail();
    if(again) return;
    var sid = b.getAttribute("data-s"), cid = b.getAttribute("data-c");
    var subj = MAP.subjById[sid], cap = MAP.capById[cid];
    var v = MAP.D.coverage[sid] && MAP.D.coverage[sid][cid];
    if(!subj || !cap || !v) return;
    var row = b.parentNode.parentNode;
    row.insertAdjacentHTML("beforeend", detailHTML(subj, cap, v));
    b.setAttribute("aria-expanded", "true");
    MAP.openCell = b;
  }
  MAP.el.body.addEventListener("click", cellClick);
  if(MAP.el.claim) MAP.el.claim.addEventListener("click", cellClick);

  MAP.rowHTML = rowHTML;
  MAP.renderMatrix = renderMatrix;
  MAP.closeDetail = closeDetail;
})();
