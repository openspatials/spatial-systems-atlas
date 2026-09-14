/* The search field at the top of the lens bar.
 *
 * One field over three kinds of thing: every capability, by name and by definition; the
 * subjects, by name; and the 12 capability groups, by name. Typing offers what matches; Enter
 * goes to the first one, brings it into view and marks it for three seconds; Escape empties the
 * field. No library, and nothing is fetched.
 *
 * Matching is on words, not on characters. The query is cut into words and a thing matches when
 * every one of those words begins a word of its own text, so "hand" finds "Session handoff and
 * portals" and "andoff" finds nothing. Case is ignored. Three ranks decide the order, best
 * first: the name begins with what was typed, then any word of the name matches, then the
 * definition matches. That is why "transport" goes to Transport protocol rather than to Voice
 * transport, which holds the same word further along.
 *
 * A thing is reached wherever the page can show it. A capability is a row in matrix mode and a
 * card in the diagram's own group view; a subject is its chip in the bar, which both modes
 * carry; a group is a heading in matrix mode and a band title in the diagram. If the filter in
 * force is hiding the row that was asked for, the filter goes back to Everything, and the line
 * under the field says so, rather than the search landing nowhere.
 *
 * Contract:
 *   window.MAP.wireSearch()      hang the field, the list and the keys, once, at start-up
 *   window.MAP.searchFind(text)  the ordered matches, without touching the page
 *   window.MAP.searchGo(item)    go to one match
 *   window.MAP.clearSearch()     empty the field and drop the mark
 *   window.__search              {find, go, results, last, marked} - a check can read the
 *                                search and drive it without a keyboard
 */
(function(){
  "use strict";

  var MAP = window.MAP;
  var MAX_SHOWN = 8;
  var MARK_MS = 3000;

  var index = null, results = [], active = -1;
  var markEl = null, markTimer = 0;

  // ---- words ---------------------------------------------------------------

  function words(t){
    return String(t == null ? "" : t).toLowerCase().split(/[^a-z0-9]+/)
      .filter(function(w){ return w.length > 0; });
  }

  function anyWordStarts(list, token){
    for(var i = 0; i < list.length; i++) if(list[i].indexOf(token) === 0) return true;
    return false;
  }

  function everyTokenStartsAWord(list, tokens){
    for(var i = 0; i < tokens.length; i++)
      if(!anyWordStarts(list, tokens[i])) return false;
    return true;
  }

  // The best rank: the name's own words, taken from the front, in the order they were typed.
  function leadsTheName(nameWords, tokens){
    if(tokens.length > nameWords.length) return false;
    for(var i = 0; i < tokens.length; i++)
      if(nameWords[i].indexOf(tokens[i]) !== 0) return false;
    return true;
  }

  // ---- what can be found ---------------------------------------------------

  function buildIndex(){
    var D = MAP.D, out = [];
    D.capabilities.forEach(function(c, i){
      var nw = words(c.name);
      out.push({kind:"capability", id:c.id, name:c.name, where:c.group_id, order:i,
                nameWords:nw, allWords:nw.concat(words(c.definition)),
                said:"capability"});
    });
    D.subjects.forEach(function(s, i){
      var nw = words(s.name);
      out.push({kind:"subject", id:s.id, name:s.name, order:i, nameWords:nw,
                allWords:nw.concat(words(s.kind)).concat(words(s.status)),
                said:"subject"});
    });
    D.groups.forEach(function(g, i){
      var nw = words(g.name);
      out.push({kind:"group", id:g.id, name:g.name, order:i, nameWords:nw, allWords:nw,
                said:"group of capabilities"});
    });
    return out;
  }

  var KIND_ORDER = {capability:0, subject:1, group:2};

  function find(text){
    if(!MAP.D) return [];
    if(!index) index = buildIndex();
    var tokens = words(text);
    if(!tokens.length) return [];
    var hits = [];
    index.forEach(function(it){
      var rank;
      if(leadsTheName(it.nameWords, tokens)) rank = 0;
      else if(everyTokenStartsAWord(it.nameWords, tokens)) rank = 1;
      else if(everyTokenStartsAWord(it.allWords, tokens)) rank = 2;
      else return;
      hits.push({item:it, rank:rank});
    });
    hits.sort(function(a, b){
      if(a.rank !== b.rank) return a.rank - b.rank;
      var ka = KIND_ORDER[a.item.kind], kb = KIND_ORDER[b.item.kind];
      if(ka !== kb) return ka - kb;
      return a.item.order - b.item.order;
    });
    return hits.map(function(h){ return h.item; });
  }

  // ---- the mark ------------------------------------------------------------

  function unmark(){
    if(markTimer){ window.clearTimeout(markTimer); markTimer = 0; }
    if(markEl){ markEl.classList.remove("hit"); markEl = null; }
  }

  function mark(el){
    unmark();
    markEl = el;
    el.classList.add("hit");
    markTimer = window.setTimeout(function(){ markTimer = 0; unmark(); }, MARK_MS);
    if(el.scrollIntoView) el.scrollIntoView({block:"center", inline:"nearest"});
    if(el.focus){ try{ el.focus({preventScroll:true}); }catch(e){ el.focus(); } }
  }

  function say(msg){
    var note = MAP.el.searchNote;
    if(!note) return;
    note.textContent = msg || "";
    note.hidden = !msg;
  }

  // ---- going to one match --------------------------------------------------

  function cssId(id){ return String(id).replace(/["\\]/g, "\\$&"); }

  // The diagram redraws on its own schedule, so anything that needs a card waits for the
  // drawing to settle rather than looking for a card that is not written yet.
  function afterDrawing(fn){
    var tries = 0;
    (function step(){
      if(!window.__c4pending || tries++ > 180){ fn(); return; }
      (window.requestAnimationFrame || function(f){ return window.setTimeout(f, 16); })(step);
    })();
  }

  function widenIfHidden(){
    if(MAP.filter === "all" && !MAP.hasEntry) return false;
    MAP.filter = "all";
    MAP.hasEntry = false;
    Array.prototype.forEach.call(MAP.el.filters.querySelectorAll("[data-f]"), function(x){
      x.setAttribute("aria-pressed", String(x.dataset.f === "all"));
    });
    MAP.el.hasentry.setAttribute("aria-pressed", "false");
    MAP.refresh();
    return true;
  }

  function rowFor(id){
    return MAP.el.body.querySelector('.row[data-cap="' + cssId(id) + '"]');
  }
  function headingFor(id){
    return MAP.el.body.querySelector('.grpname[data-tip="' + cssId(id) + '"]');
  }
  function cardFor(node){
    return MAP.el.stage ? MAP.el.stage.querySelector('[data-node="' + cssId(node) + '"]') : null;
  }

  function goCapability(it){
    if(MAP.mode === "c4"){
      MAP.setView(it.where);
      afterDrawing(function(){
        var card = cardFor("c:" + it.id);
        if(!card && widenIfHidden()){
          afterDrawing(function(){
            var again = cardFor("c:" + it.id);
            if(again){ mark(again); say(it.name + " \u2014 the filter went back to Everything so "+
                                       "this could be reached."); }
            else say(it.name + " is not drawn in this view.");
          });
          return;
        }
        if(card){ mark(card); say(it.name + " \u2014 " + it.said + "."); }
        else say(it.name + " is not drawn in this view.");
      });
      return;
    }
    var row = rowFor(it.id);
    if(!row && widenIfHidden()){
      row = rowFor(it.id);
      if(row){
        mark(row);
        say(it.name + " \u2014 the filter went back to Everything so this row could be reached.");
        return;
      }
    }
    if(row){ mark(row); say(it.name + " \u2014 " + it.said + "."); }
    else say(it.name + " is not on the page with the subjects switched on.");
  }

  function goSubject(it){
    var chip = MAP.el.subs.querySelector('[data-s="' + cssId(it.id) + '"]');
    if(!chip){ say(it.name + " has no chip on this page."); return; }
    mark(chip);
    say(it.name + " \u2014 subject chip, " + (MAP.on[it.id] ? "switched on." : "switched off."));
  }

  function goGroup(it){
    if(MAP.mode === "c4"){
      MAP.setView(it.id);
      afterDrawing(function(){
        var title = MAP.el.stage.querySelector('.c4-plane-title[data-tip="' + cssId(it.id) + '"]');
        if(title){ mark(title); say(it.name + " \u2014 " + it.said + "."); }
        else say(it.name + " has nothing to draw with the subjects and the filter chosen.");
      });
      return;
    }
    var head = headingFor(it.id);
    if(!head && widenIfHidden()) head = headingFor(it.id);
    if(head){ mark(head); say(it.name + " \u2014 " + it.said + "."); }
    else say(it.name + " has no rows on the page with the subjects switched on.");
  }

  function go(it){
    if(!it) return;
    close();
    MAP.hideTip();
    if(window.__search) window.__search.last = {kind:it.kind, id:it.id, name:it.name};
    if(it.kind === "capability") goCapability(it);
    else if(it.kind === "subject") goSubject(it);
    else goGroup(it);
  }

  // ---- the list under the field --------------------------------------------

  function close(){
    var list = MAP.el.searchList, input = MAP.el.search;
    if(list){ list.hidden = true; list.innerHTML = ""; }
    if(input){
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
    }
    active = -1;
  }

  function paint(){
    var list = MAP.el.searchList, input = MAP.el.search, esc = MAP.esc;
    if(!list) return;
    if(!results.length){ close(); return; }
    var html = "";
    results.slice(0, MAX_SHOWN).forEach(function(it, i){
      html += '<li class="searchitem" role="option" id="searchitem-' + i + '" data-i="' + i +
              '" aria-selected="' + (i === active) + '">' +
              '<span class="searchname">' + esc(it.name) + '</span>' +
              '<span class="searchkind">' + esc(it.said) + '</span></li>';
    });
    list.innerHTML = html;
    list.hidden = false;
    input.setAttribute("aria-expanded", "true");
    if(active >= 0) input.setAttribute("aria-activedescendant", "searchitem-" + active);
    else input.removeAttribute("aria-activedescendant");
  }

  function move(step){
    if(!results.length) return;
    var n = Math.min(results.length, MAX_SHOWN);
    if(active < 0) active = step > 0 ? 0 : n - 1;
    else active = (active + step + n) % n;
    paint();
  }

  function onInput(){
    var text = MAP.el.search.value;
    results = find(text);
    if(window.__search) window.__search.results = results;
    active = -1;
    if(!text.trim()){ close(); say(""); return; }
    if(!results.length){ close(); say("Nothing on the page matches " + text.trim() + "."); return; }
    say(results.length + (results.length === 1 ? " match" : " matches") +
        ". Press Enter for " + results[0].name + ".");
    paint();
  }

  function clearSearch(){
    var input = MAP.el.search;
    if(input) input.value = "";
    results = [];
    if(window.__search) window.__search.results = results;
    close();
    say("");
    unmark();
  }

  function onKey(e){
    var k = e.key;
    if(k === "ArrowDown"){ e.preventDefault(); move(1); return; }
    if(k === "ArrowUp"){ e.preventDefault(); move(-1); return; }
    if(k === "Enter"){
      e.preventDefault();
      var pick = results[active >= 0 ? active : 0];
      if(pick) go(pick);
      else say("Nothing on the page matches that.");
      return;
    }
    if(k === "Escape" || e.keyCode === 27){
      // The page's own Escape closes whatever is open; inside this field it empties the field
      // and stops there, so one key never does two things at once.
      e.stopPropagation();
      e.preventDefault();
      clearSearch();
      return;
    }
    if(k === "Tab") close();
  }

  function wireSearch(){
    var input = MAP.el.search, list = MAP.el.searchList;
    window.__search = {find: find, go: go, results: results, last: null,
                       marked: function(){ return markEl; }};
    if(!input) return;
    input.addEventListener("input", onInput);
    input.addEventListener("keydown", onKey);
    if(list){
      // Pointing at the list must not take the focus off the field before the click lands.
      list.addEventListener("mousedown", function(e){ e.preventDefault(); });
      list.addEventListener("click", function(e){
        var li = e.target.closest ? e.target.closest("[data-i]") : null;
        if(!li) return;
        go(results[Number(li.getAttribute("data-i"))]);
      });
    }
    document.addEventListener("click", function(e){
      if(!e.target.closest || !e.target.closest(".searchwrap")) close();
    });
  }

  MAP.wireSearch = wireSearch;
  MAP.searchFind = find;
  MAP.searchGo = go;
  MAP.clearSearch = clearSearch;
})();
