/* The written explanation of one item on the page.
 *
 * One box for the whole page, refilled and moved. Shown on hover and on keyboard focus,
 * dismissed when the pointer or the focus leaves, on Escape, and on scroll. No library.
 * Any item can carry one: it needs a data-tip attribute holding a key of the tooltips the
 * dataset carries.
 *
 * The switch that turns the explanations off lives in switch.js; this file reads MAP.explOn.
 * Off means no box opens anywhere and no item carries aria-describedby, so a screen reader is
 * not pointed at one either. The chip that does the switching keeps its own explanation in both
 * states, so the way back is always explained.
 *
 * Contract:
 *   window.MAP.showTip(el)   open the box for one element, or close it if it has nothing to say
 *   window.MAP.hideTip()     close the box and take aria-describedby off whatever carried it
 */
(function(){
  "use strict";

  var MAP = window.MAP;
  var tipEl = null, tipFor = null;

  function hideTip(){
    if(tipEl) tipEl.hidden = true;
    if(tipFor){ tipFor.removeAttribute("aria-describedby"); tipFor = null; }
  }

  function showTip(el){
    // With the switch off, only the switch itself explains itself.
    if(!MAP.explOn && el !== MAP.el.explChip){ hideTip(); return; }
    if(el === tipFor) return;
    var D = MAP.D;
    // A row can carry its own sentence on the element, which the keyed explanations cannot
    // hold: every marked row has a different reason. The key is the fallback.
    var text = el.getAttribute("data-tip-text") ||
               (D && D.tooltips ? D.tooltips[el.getAttribute("data-tip")] : null);
    if(!text){ hideTip(); return; }
    if(!tipEl){
      tipEl = document.createElement("div");
      tipEl.className = "tip";
      tipEl.id = "item-tip";
      tipEl.setAttribute("role", "tooltip");
      document.body.appendChild(tipEl);
    }
    if(tipFor) tipFor.removeAttribute("aria-describedby");
    tipEl.textContent = text;
    tipEl.hidden = false;
    tipFor = el;
    el.setAttribute("aria-describedby", "item-tip");
    var r = el.getBoundingClientRect();
    var w = tipEl.offsetWidth, h = tipEl.offsetHeight;
    var left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8));
    var top = r.bottom + 8;
    if(top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 8);
    tipEl.style.left = left + "px";
    tipEl.style.top = top + "px";
  }

  function tipTarget(node){
    return node && node.closest ? node.closest("[data-tip],[data-tip-text]") : null;
  }

  document.addEventListener("mouseover", function(e){
    var t = tipTarget(e.target);
    if(t) showTip(t);
    else if(tipFor && !tipFor.contains(e.target)) hideTip();
  });
  document.addEventListener("mouseout", function(e){
    if(!tipFor) return;
    var t = tipTarget(e.target);
    if(t === tipFor && !(e.relatedTarget && tipFor.contains(e.relatedTarget))) hideTip();
  });
  document.addEventListener("focusin", function(e){
    var t = tipTarget(e.target);
    if(t) showTip(t); else hideTip();
  });
  document.addEventListener("focusout", function(e){
    if(tipFor && tipTarget(e.target) === tipFor) hideTip();
  });
  window.addEventListener("scroll", hideTip, true);
  window.addEventListener("resize", hideTip);

  MAP.showTip = showTip;
  MAP.hideTip = hideTip;
})();
