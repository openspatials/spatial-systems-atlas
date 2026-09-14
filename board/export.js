/* The Export chip, and the file it builds from what is on screen.
 *
 * Two of the three choices are links to the files build.py writes beside this page. The third is
 * built here, from the same dataset and the same controls the matrix draws from, in the same
 * shape as the whole-record file so the two can be read by one reader.
 *
 * Contract:
 *   window.MAP.wireExport()    hang the chip, the menu and the three choices, once, at start-up
 *   window.MAP.shownCSV()      the claims on screen as {text, rows, capabilities, subjects}
 *   window.MAP.exportIsOpen()  is the menu open
 *   window.MAP.closeExport(focusChip)  close it
 *   window.__export            {csv, force, last} - a check can read the export without clicking,
 *                              and can hold it to one of the three ways a file is handed over
 */
(function(){
  "use strict";

  var MAP = window.MAP;
  var exportChip = MAP.el.exportChip, exportMenu = MAP.el.exportMenu,
      exportNote = MAP.el.exportNote, exportShown = MAP.el.exportShown;

  var CSV_COLUMNS = ["subject_id", "subject", "kind", "status", "group", "capability_id",
                     "capability", "binding", "level", "confidence", "note", "sources"];

  // RFC 4180: a field is quoted only when it holds a comma, a quote or a line break, and a
  // quote inside a quoted field is doubled. This is what Python's csv writer does, so a row
  // built here and a row built by the script are the same bytes.
  function csvField(v){
    var t = v == null ? "" : String(v);
    return /[",\r\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
  }

  // The claims on screen: the subjects switched on, and the capabilities the filter and the
  // toggle leave standing, judged by the one copy of the row rules every part of the page uses.
  function shownCSV(){
    var D = MAP.D;
    var groupName = {};
    D.groups.forEach(function(g){ groupName[g.id] = g.name; });
    var shown = MAP.shown();
    var caps = D.capabilities.filter(function(c){
      return !!MAP.rowHits(D, c, shown, MAP.filter, MAP.hasEntry);
    });
    var lines = [CSV_COLUMNS.join(",")], rows = 0;
    shown.forEach(function(s){
      caps.forEach(function(c){
        var v = D.coverage[s.id] && D.coverage[s.id][c.id];
        if(!v) return;
        // Local evidence lives on the machine the map is built on, so it gives its title;
        // every other source gives its address. The script does the same.
        var srcs = (v[3] || []).map(function(x){
          return x[2] === "local-evidence" ? (x[1] || "") : (x[0] || "");
        }).filter(function(t){ return t; }).join(" | ");
        lines.push([s.id, s.name, s.kind, s.status || "", groupName[c.group_id] || "", c.id,
                    c.name, c.binding === "connect" ? "protocol" : "format", v[0], v[1] || "",
                    v[2] || "", srcs].map(csvField).join(","));
        rows++;
      });
    });
    return {text: lines.join("\r\n") + "\r\n", rows: rows,
            capabilities: caps.length, subjects: shown.length};
  }

  function say(msg){
    if(!exportNote) return;
    exportNote.textContent = msg || "";
    exportNote.hidden = !msg;
  }

  function legacyCopy(text){
    try{
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "readonly");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand("copy");
      ta.parentNode.removeChild(ta);
      return !!ok;
    }catch(e){ return false; }
  }

  function copyText(text, name){
    function done(ok){
      say(ok ? "This copy of the page cannot save a file or open a tab, so " + name +
               " was copied to the clipboard."
             : "This copy of the page cannot save a file, open a tab or reach the clipboard, " +
               "so " + name + " could not be handed over. Use the whole-record file instead.");
    }
    // The older selection copy is tried first on purpose. This site's permissions policy turns
    // the newer Clipboard API off, and calling it there puts a policy violation in the console
    // even though the copy still happens the older way. The older way needs no permission and
    // works inside the click that asked for it; the newer API is the fallback behind it.
    if(legacyCopy(text)){ done(true); return; }
    var nav = window.navigator;
    if(nav && nav.clipboard && nav.clipboard.writeText){
      nav.clipboard.writeText(text).then(function(){ done(true); }, function(){ done(false); });
      return;
    }
    done(false);
  }

  // Three ways to hand a file over, tried in order, because a copy of this page inside another
  // page is allowed fewer of them. A framed copy is not offered the download at all: the
  // browser refuses it without raising anything this page could catch, so the click would look
  // as if nothing happened. window.open answers null when it is refused, which is catchable.
  // window.open answers null when "noopener" is among the window features, even when the tab
  // really did open, so a page that reads that answer could never tell a refused tab from a
  // good one - and would say the clipboard was used while a tab stood open. Open the tab
  // plainly and cut the opener link on the window that comes back, which is the same
  // protection; null then really means the tab was refused.
  function openTab(url){
    var w = null;
    try{ w = window.open(url, "_blank"); }catch(e){ return null; }
    if(w){ try{ w.opener = null; }catch(e){} }
    return w;
  }

  function offerFile(name, text, mime){
    var forced = window.__export ? window.__export.force : null;
    var framed = true;
    try{ framed = window.self !== window.top; }catch(e){ framed = true; }
    // Two addresses for the same text. The saved file carries its own type, so the browser
    // names and opens it as a spreadsheet. The tab carries plain text instead: a tab sent to a
    // csv address is turned into a download by the browser, and a copy of this page inside
    // another page is not allowed to download, so the tab would come up empty. As plain text
    // the tab shows the rows, which is what the tab is for.
    var url = null, tabUrl = null;
    try{ url = URL.createObjectURL(new Blob([text], {type: mime + ";charset=utf-8"})); }
    catch(e){ url = null; }
    try{ tabUrl = URL.createObjectURL(new Blob([text], {type: "text/plain;charset=utf-8"})); }
    catch(e){ tabUrl = null; }
    var a = document.createElement("a"), how;
    if(url && !framed && "download" in a && forced !== "tab" && forced !== "clipboard"){
      a.href = url;
      a.download = name;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.parentNode.removeChild(a);
      how = "download";
      say("Saved " + name + " to wherever this browser puts its downloads.");
    }else if(tabUrl && forced !== "clipboard" && openTab(tabUrl)){
      how = "tab";
      say("This copy of the page cannot save a file, so " + name + " opened in a new tab.");
    }else{
      how = "clipboard";
      copyText(text, name);
    }
    window.setTimeout(function(){
      try{ if(url) URL.revokeObjectURL(url); }catch(e){}
      try{ if(tabUrl) URL.revokeObjectURL(tabUrl); }catch(e){}
    }, 60000);
    if(window.__export) window.__export.last = how;
    return how;
  }

  function exportIsOpen(){ return !!(exportMenu && !exportMenu.hidden); }

  function openExport(){
    if(!exportMenu) return;
    exportMenu.hidden = false;
    exportChip.setAttribute("aria-expanded", "true");
  }

  function closeExport(focusChip){
    if(!exportMenu || exportMenu.hidden) return;
    exportMenu.hidden = true;
    exportChip.setAttribute("aria-expanded", "false");
    if(focusChip && exportChip) exportChip.focus();
  }

  function wireExport(){
    if(!exportChip || !exportMenu) return;
    // A check can read the export without clicking, and can hold it to one of the three paths.
    window.__export = {csv: shownCSV, force: null, last: null};
    exportChip.addEventListener("click", function(){
      if(exportIsOpen()) closeExport(false); else openExport();
    });
    exportMenu.addEventListener("click", function(e){
      if(e.target.closest("a")) closeExport(false);
    });
    if(exportShown) exportShown.addEventListener("click", function(){
      var built = shownCSV();
      say("Building " + built.rows + " rows\u2026");
      offerFile("territory-shown.csv", built.text, "text/csv");
      closeExport(true);
    });
    document.addEventListener("click", function(e){
      if(!exportIsOpen()) return;
      if(!e.target.closest || !e.target.closest(".exportwrap")) closeExport(false);
    });
    document.addEventListener("focusin", function(e){
      if(!exportIsOpen()) return;
      if(!e.target.closest || !e.target.closest(".exportwrap")) closeExport(false);
    });
  }

  MAP.wireExport = wireExport;
  MAP.shownCSV = shownCSV;
  MAP.exportIsOpen = exportIsOpen;
  MAP.closeExport = closeExport;
})();
