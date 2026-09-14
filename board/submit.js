// submit.js — the comment button and the form behind it, shared by the atlas and the matrix.
//
// The atlas and the matrix each carry one mount point:
//     <div id="submitmount" data-submit-page="atlas"></div>
// and this module builds everything inside it: a round button fixed in the bottom right corner,
// and the form that opens when it is pressed. build_atlas.py and build.py inline this file into
// the two published pages, so nothing here is fetched.
//
// What the form does. It posts to /msf/map/api/submit on this site, which files the submission as
// a public issue on github.com/openspatials/spatial-tech-map and hands back the issue's number and
// address. The email address is optional, is never written into the issue, and is kept privately
// so a maintainer can reply.
//
// Where the form cannot post. The map is also published as a private copy off this site, where
// that address does not exist. This module checks the host it is running on before it offers the
// form: anywhere else it says so plainly and offers the list on GitHub instead. No library, no
// framework, and nothing fetched until the button is pressed.
(function () {
  "use strict";

  var ENDPOINT = "/msf/map/api/submit";
  var LIST = "https://github.com/openspatials/spatial-tech-map/issues";
  var NEW_ISSUE = "https://github.com/openspatials/spatial-tech-map/issues/new/choose";
  // The public half of the Cloudflare Turnstile widget. A site key is meant to be read by
  // anybody; the secret half never leaves the function.
  var SITEKEY = "0x4AAAAAAEqgjvsSDXAjf2mv";
  var TURNSTILE_JS = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

  // The hosts where /msf/map/api/submit exists. Anywhere else the form cannot be sent, and the
  // panel says so rather than failing when somebody presses Submit.
  function canPost() {
    var h = String(window.location.hostname || "").toLowerCase();
    return h === "openspatials.com" || h === "www.openspatials.com" ||
           h === "localhost" || h === "127.0.0.1" ||
           /(^|\.)openspatials-com\.pages\.dev$/.test(h);
  }

  var KINDS = [
    ["feedback", "Feedback", "How the map reads, what it shows, or what it should show."],
    ["correction", "Correction", "A claim on the map is wrong."],
    ["new-subject", "New subject", "A system the map does not carry yet."]
  ];

  var TITLE_MIN = 4, TITLE_MAX = 120, BODY_MIN = 20, BODY_MAX = 5000;

  var CSS = [
    "#submitmount{font-family:var(--f-label),ui-sans-serif,system-ui,sans-serif}",
    // A hidden element has to stay hidden. The browser's own rule for the `hidden` attribute is
    // weaker than any rule written here, so `.sb-back{display:flex}` was beating it: the form sat
    // on the page from the moment it loaded, covering everything, and swallowed the click meant
    // for the comment button. This rule is stronger than both and settles it.
    "#submitmount[hidden],#submitmount [hidden]{display:none}",
    ".sb-open{position:fixed;right:22px;bottom:22px;z-index:60;width:56px;height:56px;",
      "border-radius:50%;border:1px solid var(--ink);background:var(--ink);color:var(--paper);",
      "display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;",
      "box-shadow:0 2px 10px rgba(27,29,26,.28)}",
    ".sb-open:hover{background:var(--ink-soft);border-color:var(--ink-soft)}",
    ".sb-open:focus-visible{outline:2px solid var(--survey);outline-offset:3px}",
    ".sb-open svg{width:26px;height:26px;display:block}",
    "@media (max-width:520px){.sb-open{right:14px;bottom:14px}}",
    ".sb-back{position:fixed;inset:0;z-index:70;background:rgba(27,29,26,.42);",
      "display:flex;align-items:flex-start;justify-content:center;padding:24px 16px;",
      "overflow:auto}",
    ".sb-card{background:var(--paper-raised);border:1px solid var(--rule-strong);",
      "border-radius:var(--c4-band-r,3px);box-shadow:var(--c4-shadow,0 2px 12px rgba(0,0,0,.3));",
      "width:100%;max-width:540px;margin:auto;padding:18px 20px 20px;color:var(--ink)}",
    ".sb-over{font-family:var(--f-mono);font-size:9.5px;letter-spacing:.09em;",
      "text-transform:uppercase;color:var(--survey)}",
    ".sb-title{margin:2px 0 6px;font-family:var(--f-label);font-weight:700;font-size:17px}",
    ".sb-lede{margin:0 0 14px;font-family:var(--f-body);font-size:13px;line-height:1.45;",
      "color:var(--ink-soft)}",
    ".sb-field{margin:0 0 12px}",
    ".sb-lab{display:block;font-family:var(--f-label);font-weight:600;font-size:11px;",
      "letter-spacing:.06em;text-transform:uppercase;color:var(--ink-soft);margin:0 0 5px}",
    ".sb-hint{font-family:var(--f-body);font-size:11.5px;color:var(--ink-faint);",
      "line-height:1.35;margin:4px 0 0}",
    ".sb-in,.sb-ta{width:100%;box-sizing:border-box;font-family:var(--f-body);font-size:13.5px;",
      "color:var(--ink);background:var(--paper);border:1px solid var(--rule-strong);",
      "border-radius:2px;padding:7px 8px}",
    ".sb-ta{min-height:118px;resize:vertical;line-height:1.45}",
    ".sb-in:focus,.sb-ta:focus{outline:2px solid var(--chart);outline-offset:0;",
      "border-color:var(--chart)}",
    ".sb-kinds{display:flex;flex-wrap:wrap;gap:5px}",
    ".sb-kind{font-family:var(--f-label);font-weight:600;font-size:12px;cursor:pointer;",
      "background:var(--paper);color:var(--ink);border:1px solid var(--rule);",
      "border-radius:2px;padding:4px 9px}",
    ".sb-kind[aria-checked=\"true\"]{background:var(--ink);color:var(--paper);",
      "border-color:var(--ink)}",
    ".sb-kind:focus-visible{outline:2px solid var(--survey);outline-offset:2px}",
    ".sb-pot{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}",
    ".sb-acts{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:14px}",
    ".sb-go,.sb-no{font-family:var(--f-label);font-weight:600;font-size:12.5px;cursor:pointer;",
      "border-radius:2px;padding:7px 14px;border:1px solid var(--ink)}",
    ".sb-go{background:var(--ink);color:var(--paper)}",
    ".sb-go[disabled]{opacity:.5;cursor:default}",
    ".sb-no{background:var(--paper);color:var(--ink);border-color:var(--rule-strong)}",
    ".sb-go:focus-visible,.sb-no:focus-visible{outline:2px solid var(--survey);outline-offset:2px}",
    ".sb-say{margin:12px 0 0;font-family:var(--f-body);font-size:13px;line-height:1.45;",
      "color:var(--ink)}",
    ".sb-say.bad{color:var(--survey)}",
    ".sb-say a{color:var(--chart)}",
    ".sb-test{margin:12px 0 0;min-height:0}"
  ].join("");

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, k)) node.setAttribute(k, attrs[k]);
      }
    }
    if (text != null) node.textContent = text;
    return node;
  }

  function start() {
    var mount = document.getElementById("submitmount");
    if (!mount || mount.getAttribute("data-submit-ready") === "1") return;
    mount.setAttribute("data-submit-ready", "1");
    var page = mount.getAttribute("data-submit-page") || "map";

    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    // ---- the button ---------------------------------------------------------
    // A circle in the bottom right with a comment icon drawn here rather than fetched. It is a
    // real button, so it is reachable by keyboard and reads as one; the hover text and the label
    // say the same thing.
    var openBtn = el("button", {
      type: "button", "class": "sb-open", id: "submitopen",
      title: "Comment on this map", "aria-label": "Comment on this map",
      "aria-haspopup": "dialog", "aria-expanded": "false"
    });
    openBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ' +
      'focusable="false"><path d="M20.5 12.4c0 3.9-3.8 7.1-8.5 7.1-1 0-2-.15-2.9-.42L4 20.5l1.5-3.6' +
      'C4.2 15.7 3.5 14.1 3.5 12.4c0-3.9 3.8-7.1 8.5-7.1s8.5 3.2 8.5 7.1Z"></path>' +
      '<path d="M8.6 11.6h6.8M8.6 14.3h4.3"></path></svg>';
    mount.appendChild(openBtn);

    // ---- the form -----------------------------------------------------------
    var back = el("div", { "class": "sb-back", hidden: "hidden" });
    var card = el("div", {
      "class": "sb-card", role: "dialog", "aria-modal": "true", "aria-labelledby": "sbtitle"
    });
    back.appendChild(card);

    card.appendChild(el("div", { "class": "sb-over" }, "Metaverse Standards Forum · spatial technology map"));
    card.appendChild(el("h2", { "class": "sb-title", id: "sbtitle" }, "Comment on this map"));

    var lede = el("p", { "class": "sb-lede" });
    card.appendChild(lede);

    var form = el("form", { novalidate: "novalidate" });
    card.appendChild(form);

    // Kind: three choices, one of them always on, worked by arrow keys the way the page's other
    // choices are.
    var kindWrap = el("div", { "class": "sb-field" });
    kindWrap.appendChild(el("span", { "class": "sb-lab", id: "sbkindlab" }, "What kind"));
    var kinds = el("div", { "class": "sb-kinds", role: "radiogroup", "aria-labelledby": "sbkindlab" });
    var kindBtns = [];
    var kind = KINDS[0][0];
    KINDS.forEach(function (k, i) {
      var b = el("button", {
        type: "button", "class": "sb-kind", role: "radio",
        "aria-checked": i === 0 ? "true" : "false", tabindex: i === 0 ? "0" : "-1",
        title: k[2], "data-kind": k[0]
      }, k[1]);
      b.addEventListener("click", function () { pickKind(i); });
      kinds.appendChild(b);
      kindBtns.push(b);
    });
    kinds.addEventListener("keydown", function (ev) {
      var at = kindBtns.indexOf(document.activeElement);
      if (at < 0) return;
      var next = null;
      if (ev.key === "ArrowRight" || ev.key === "ArrowDown") next = (at + 1) % kindBtns.length;
      if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") next = (at + kindBtns.length - 1) % kindBtns.length;
      if (next === null) return;
      ev.preventDefault();
      pickKind(next);
      kindBtns[next].focus();
    });
    function pickKind(i) {
      kind = KINDS[i][0];
      kindBtns.forEach(function (b, j) {
        b.setAttribute("aria-checked", i === j ? "true" : "false");
        b.setAttribute("tabindex", i === j ? "0" : "-1");
      });
    }
    kindWrap.appendChild(kinds);
    form.appendChild(kindWrap);

    var titleWrap = el("div", { "class": "sb-field" });
    titleWrap.appendChild(el("label", { "class": "sb-lab", "for": "sbtitlefield" }, "Title"));
    var titleIn = el("input", {
      "class": "sb-in", id: "sbtitlefield", type: "text", maxlength: String(TITLE_MAX),
      autocomplete: "off", spellcheck: "true", required: "required",
      placeholder: "One line saying what this is about"
    });
    titleWrap.appendChild(titleIn);
    form.appendChild(titleWrap);

    var bodyWrap = el("div", { "class": "sb-field" });
    bodyWrap.appendChild(el("label", { "class": "sb-lab", "for": "sbbodyfield" }, "Your comment"));
    var bodyIn = el("textarea", {
      "class": "sb-ta", id: "sbbodyfield", maxlength: String(BODY_MAX), required: "required",
      placeholder: "What you noticed, and what you would expect instead. For a correction, name the subject and the capability, and give one address where it can be checked."
    });
    bodyWrap.appendChild(bodyIn);
    bodyWrap.appendChild(el("p", { "class": "sb-hint" },
      "This becomes a public issue on GitHub. Anyone can read it, so put nothing here you would not publish."));
    form.appendChild(bodyWrap);

    var mailWrap = el("div", { "class": "sb-field" });
    mailWrap.appendChild(el("label", { "class": "sb-lab", "for": "sbmailfield" }, "Email"));
    var mailIn = el("input", {
      "class": "sb-in", id: "sbmailfield", type: "email", maxlength: "254",
      // No address of any kind ships on this page, not even an example one: the field is
      // explained by the line under it instead.
      autocomplete: "email", placeholder: "Only if you want a reply"
    });
    mailWrap.appendChild(mailIn);
    mailWrap.appendChild(el("p", { "class": "sb-hint" },
      "Email (optional, for a reply; never published)."));
    form.appendChild(mailWrap);

    // The honeypot. Off screen, out of the tab order, hidden from a screen reader. A person never
    // fills it in, so anything in it came from a machine and the function refuses it.
    var pot = el("div", { "class": "sb-pot", "aria-hidden": "true" });
    var potIn = el("input", {
      type: "text", name: "website", tabindex: "-1", autocomplete: "off"
    });
    pot.appendChild(el("label", { "for": "sbpot" }, "Leave this empty"));
    potIn.id = "sbpot";
    pot.appendChild(potIn);
    form.appendChild(pot);

    var testWrap = el("div", { "class": "sb-test", id: "sbtest" });
    form.appendChild(testWrap);

    var acts = el("div", { "class": "sb-acts" });
    var goBtn = el("button", { type: "submit", "class": "sb-go" }, "Submit");
    var noBtn = el("button", { type: "button", "class": "sb-no" }, "Cancel");
    acts.appendChild(goBtn);
    acts.appendChild(noBtn);
    form.appendChild(acts);

    var say = el("p", { "class": "sb-say", role: "status", "aria-live": "polite" });
    card.appendChild(say);

    // The one way out when the form itself is not offered, which happens on the private copy of
    // the map and anywhere else this file is opened away from the site.
    var awayActs = el("div", { "class": "sb-acts", hidden: "hidden" });
    var awayBtn = el("button", { type: "button", "class": "sb-no" }, "Close");
    awayActs.appendChild(awayBtn);
    card.appendChild(awayActs);

    mount.appendChild(back);

    // ---- state --------------------------------------------------------------
    // idle, sending, done, refused. Only one of them ever shows.
    var state = "idle", lastFocus = null, widgetId = null, loadingTest = false;
    var waiting = null;
    // The human test renders a moment after the form is opened, and Submit can do nothing
    // until it has. This says whether it can.
    var testReady = false;

    function tell(text, bad, link, linkText) {
      say.textContent = "";
      say.className = "sb-say" + (bad ? " bad" : "");
      if (text) say.appendChild(document.createTextNode(text));
      if (link) {
        if (text) say.appendChild(document.createTextNode(" "));
        var a = el("a", { href: link, target: "_blank", rel: "noopener" }, linkText || link);
        say.appendChild(a);
      }
    }

    function setState(next) {
      state = next;
      var busy = next === "sending";
      goBtn.disabled = busy || next === "done" || !testReady;
      goBtn.textContent = busy ? "Sending…" : (next === "done" ? "Sent" : "Submit");
      noBtn.textContent = next === "done" ? "Close" : "Cancel";
      [titleIn, bodyIn, mailIn].forEach(function (f) { f.disabled = busy || next === "done"; });
      kindBtns.forEach(function (b) { b.disabled = busy || next === "done"; });
    }

    // ---- the human test -----------------------------------------------------
    // Cloudflare Turnstile, invisible. Nothing is fetched until the form is opened for the first
    // time, so a reader who never comments never asks the network for anything.
    function loadTest() {
      if (!canPost()) return;
      if (testReady) { setState(state); return; }
      // Said before anything is fetched, so the form never looks ready before it is.
      tell("Checking that you are a person…");
      if (loadingTest || window.turnstile) { renderTest(); return; }
      loadingTest = true;
      var s = document.createElement("script");
      s.src = TURNSTILE_JS;
      s.async = true;
      s.defer = true;
      s.onload = function () { renderTest(); };
      // A browser that refuses challenges.cloudflare.com lands here. The dead script goes and the
      // waiting flag is cleared, so opening the form again asks once more instead of sitting on
      // "Checking that you are a person…" for ever with no way out of it.
      s.onerror = function () {
        loadingTest = false;
        if (s.parentNode) s.parentNode.removeChild(s);
        testUnavailable();
      };
      document.head.appendChild(s);
    }

    // Said whenever the test cannot be had at all: the script would not load, or the widget
    // would not render. Submit stays off, so the only way out of the panel is the list.
    function testUnavailable() {
      tell("The human test could not be loaded, so this form cannot be sent from here. Please file it on GitHub instead:", true, NEW_ISSUE, "open an issue");
    }

    // The test has rendered: Submit becomes pressable and the waiting line goes.
    function testIsReady() {
      testReady = true;
      if (state === "idle") tell("");
      setState(state);
    }

    // The widget is rendered once, and told to wait rather than run at once, so the test only
    // happens when somebody actually presses Submit. Its callbacks answer whatever `humanToken`
    // is waiting on.
    function renderTest() {
      if (widgetId !== null) { testIsReady(); return; }
      if (!window.turnstile) return;
      var id;
      try {
        id = window.turnstile.render(testWrap, {
          sitekey: SITEKEY,
          execution: "execute",
          appearance: "execute",
          callback: function (token) { settleTest(token, null); },
          // The widget hands its error callback a code. It is the only thing that says why a
          // test failed, so the panel shows it rather than a sentence that fits every failure.
          "error-callback": function (code) {
            var why = String(code == null ? "" : code);
            settleTest(null, "The human test did not pass" + (why ? " (" + why + ")" : "") +
              ". Please try again, or file it on GitHub.");
            return true;
          },
          "expired-callback": function () {
            settleTest(null, "The human test expired before it could be sent. Please press Submit again.");
          },
          "timeout-callback": function () {
            settleTest(null, "The human test did not finish in time. Please press Submit again.");
          }
        });
      } catch (e) {
        id = null;
      }
      widgetId = (id === null || id === undefined) ? null : id;
      if (widgetId === null) testUnavailable(); else testIsReady();
    }

    function settleTest(token, sentence) {
      var w = waiting;
      if (!w) return;
      waiting = null;
      clearTimeout(w.timer);
      if (token) w.resolve(token); else w.reject(new Error(sentence));
    }

    // The token is single use. Ask for a fresh one every time Submit is pressed.
    function humanToken() {
      return new Promise(function (resolve, reject) {
        if (!window.turnstile || widgetId === null) {
          reject(new Error("The human test could not be loaded, so this form cannot be sent from here. Please file it on GitHub instead."));
          return;
        }
        if (waiting) {
          reject(new Error("The human test is still running. Wait a moment and press Submit again."));
          return;
        }
        waiting = {
          resolve: resolve, reject: reject,
          timer: setTimeout(function () {
            settleTest(null, "The human test did not finish in time. Please press Submit again.");
          }, 20000)
        };
        try {
          window.turnstile.reset(widgetId);
          window.turnstile.execute(widgetId);
        } catch (e) {
          settleTest(null, "The human test could not be run here. Please file it on GitHub instead.");
        }
      });
    }

    // ---- opening and closing ------------------------------------------------
    function open() {
      lastFocus = document.activeElement;
      back.hidden = false;
      openBtn.setAttribute("aria-expanded", "true");
      if (canPost()) {
        lede.textContent = "Every comment becomes a public issue on GitHub, and the map's maintainers read them all every two weeks.";
        form.hidden = false;
        awayActs.hidden = true;
        setState("idle");
        tell("");
        loadTest();
        titleIn.focus();
      } else {
        // The private copy of the map, and anywhere else this file is opened. The address the
        // form posts to does not exist here, so the form is not offered at all.
        lede.textContent = "This copy of the map cannot file a submission: the address the form sends to only exists on openspatials.com. The list is public and takes submissions directly.";
        form.hidden = true;
        awayActs.hidden = false;
        tell("File it on the list instead:", false, NEW_ISSUE, "open an issue on GitHub");
        awayBtn.focus();
      }
    }

    function close() {
      back.hidden = true;
      openBtn.setAttribute("aria-expanded", "false");
      if (state === "done") {
        // A finished submission clears out, so the next one starts from an empty form.
        titleIn.value = ""; bodyIn.value = ""; mailIn.value = "";
        setState("idle");
        tell("");
      }
      // Back where the reader was. The body is not somewhere to put focus, so anything that is
      // not a real control hands focus to the button that opened this.
      if (lastFocus && lastFocus.focus && lastFocus !== document.body &&
          document.contains(lastFocus) && lastFocus.offsetParent !== null) {
        lastFocus.focus();
      } else {
        openBtn.focus();
      }
    }

    openBtn.addEventListener("click", open);
    noBtn.addEventListener("click", close);
    awayBtn.addEventListener("click", close);
    back.addEventListener("mousedown", function (ev) { if (ev.target === back) close(); });
    document.addEventListener("keydown", function (ev) {
      if (back.hidden) return;
      if (ev.key === "Escape" || ev.key === "Esc") { ev.preventDefault(); close(); return; }
      // Keep the tab ring inside the card while it is open.
      if (ev.key !== "Tab") return;
      var able = card.querySelectorAll("button:not([disabled]),input:not([disabled]),textarea:not([disabled]),a[href]");
      var list = [];
      for (var i = 0; i < able.length; i++) {
        if (able[i].offsetParent !== null || able[i] === document.activeElement) list.push(able[i]);
      }
      if (!list.length) return;
      var first = list[0], last = list[list.length - 1];
      if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
      else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
    });

    // ---- sending ------------------------------------------------------------
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (state === "sending" || state === "done") return;

      var title = String(titleIn.value || "").trim();
      var body = String(bodyIn.value || "").trim();
      var mail = String(mailIn.value || "").trim();

      if (title.length < TITLE_MIN) {
        tell("The title is too short. Please give it at least " + TITLE_MIN + " characters.", true);
        titleIn.focus();
        return;
      }
      if (body.length < BODY_MIN) {
        tell("The comment is too short. Please write at least " + BODY_MIN + " characters so it can be acted on.", true);
        bodyIn.focus();
        return;
      }

      setState("sending");
      tell("Sending…");

      humanToken().then(function (token) {
        return fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: kind, title: title, body: body, email: mail,
            page: page, address: String(window.location.href || ""),
            website: String(potIn.value || ""), turnstile: token
          })
        });
      }).then(function (res) {
        return res.json().then(function (data) { return { res: res, data: data }; },
                               function () { return { res: res, data: null }; });
      }).then(function (out) {
        var data = out.data;
        if (out.res.ok && data && data.ok && data.number) {
          setState("done");
          say.textContent = "";
          say.className = "sb-say";
          say.appendChild(document.createTextNode("Your submission is number " + data.number + ": "));
          say.appendChild(el("a", { href: data.url, target: "_blank", rel: "noopener" }, data.url));
          say.appendChild(document.createTextNode(
            ". It is public. Comments are folded into the map every two weeks." +
            (data.email_kept ? " Your email address is kept privately and is not on that page." : "")));
          noBtn.focus();
          return;
        }
        setState("idle");
        var sentence = (data && data.message) ||
          "The submission could not be filed just now. Please try again, or file it on GitHub.";
        tell(sentence, true, NEW_ISSUE, "open an issue");
      })["catch"](function (err) {
        setState("idle");
        tell(String((err && err.message) || "The submission could not be sent. Please try again, or file it on GitHub."), true, NEW_ISSUE, "open an issue");
      });
    });

    // The list itself, for anyone who would rather read what is already there. It sits under the
    // form so the form is the first thing offered.
    var listLine = el("p", { "class": "sb-hint" });
    listLine.appendChild(document.createTextNode("Every submission is here: "));
    listLine.appendChild(el("a", { href: LIST, target: "_blank", rel: "noopener",
                                   style: "color:var(--chart)" }, LIST));
    card.appendChild(listLine);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
