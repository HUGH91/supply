(function () {
  "use strict";
  var SHOP = window.H91_SHOP || { shopify: {}, slots: [] };
  var PIECES = window.H91_PIECES || {};
  var FITS = (window.H91_FITS || []).filter(function (f) { return !f.draft; });
  var SLOTS = SHOP.slots;
  var MIX = !!SHOP.mixAndMatch;
  var n = FITS.length;

  var cur = 0;            // preset fit on the stand
  var outfit = {};        // slot id -> piece id (or null)
  var view = "front";     // "front", "right", "back", "left", "3d" or "layers"
  var TURN = ["front", "right", "back", "left"];
  var TURN_LABEL = { front: "Front", right: "Right side", back: "Back", left: "Left side" };
  var saved = {};
  var bag = loadBag();

  var $ = function (id) { return document.getElementById(id); };
  var at = function (i) { return ((i % n) + n) % n; };

  function loadBag() {
    try { return JSON.parse(localStorage.getItem("h91-bag") || "[]"); } catch (e) { return []; }
  }
  function saveBag() {
    try { localStorage.setItem("h91-bag", JSON.stringify(bag)); } catch (e) { /* private mode */ }
  }
  function money(v) { return v == null ? "Price TBA" : "$" + Number(v).toFixed(2).replace(/\.00$/, ""); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function fill(id, kids) { var p = $(id); p.replaceChildren.apply(p, kids); }

  function outfitOf(fit) {
    var o = {};
    SLOTS.forEach(function (s) { o[s.id] = null; });
    fit.pieces.forEach(function (pid) { var p = PIECES[pid]; if (p) o[p.slot] = pid; });
    return o;
  }
  function sameOutfit(a, b) { return SLOTS.every(function (s) { return (a[s.id] || null) === (b[s.id] || null); }); }
  function matchingFit() {
    for (var i = 0; i < n; i++) if (sameOutfit(outfit, outfitOf(FITS[i]))) return i;
    return -1;
  }
  function wornIds() { return SLOTS.map(function (s) { return outfit[s.id]; }).filter(Boolean); }

  // A stack of layer images, bottom to top. withBase=false makes a headless mannequin.
  function stack(o, withBase) {
    var box = el("div", "stack");
    if (withBase && SHOP.base && SHOP.base.views) box.appendChild(layerImg(SHOP.base.views.front));
    SLOTS.forEach(function (s) {
      var p = PIECES[o[s.id]];
      if (p && p.layer) box.appendChild(layerImg(p.layer));
    });
    return box;
  }
  function layerImg(src) {
    var i = el("img"); i.src = src; i.alt = ""; i.decoding = "async"; i.draggable = false;
    return i;
  }

  function defaultView(f) { return f.views ? "front" : (f.model ? "3d" : "layers"); }
  function mannequin(f) {
    var src = f.mannequin || (f.views && f.views.front);
    if (src) { var i = layerImg(src); i.className = "mannequin"; return i; }
    return stack(outfitOf(f), false);
  }
  function turn(dir) {
    var i = TURN.indexOf(view);
    view = i < 0 ? "front" : TURN[(i + dir + 4) % 4];
    renderRoom();
  }
  function viewButton(label, aria, pressed, onClick) {
    var b = el("button", "", label); b.type = "button";
    if (aria) b.setAttribute("aria-label", aria);
    if (pressed != null) b.setAttribute("aria-pressed", pressed ? "true" : "false");
    b.addEventListener("click", onClick);
    return b;
  }

  function renderRoom() {
    var prev = FITS[at(cur - 1)], next = FITS[at(cur + 1)];
    fill("standL", [mannequin(prev)]);
    fill("standR", [mannequin(next)]);
    $("tapPrev").setAttribute("aria-label", "Try on the " + prev.name);
    $("tapNext").setAttribute("aria-label", "Try on the " + next.name);

    var m = matchingFit();
    var f = m > -1 ? FITS[m] : null;
    var ok = { "3d": SHOP.show3d !== false && !!(f && f.model), layers: MIX };
    TURN.forEach(function (v) { ok[v] = !!(f && f.views && f.views[v]); });
    if (!ok[view]) view = f ? defaultView(f) : "layers";

    var mv = $("avatar"), art = $("artView"), lay = $("layered");
    var turning = TURN.indexOf(view) > -1;
    mv.hidden = view !== "3d"; art.hidden = !turning; lay.hidden = view !== "layers";
    if (view === "3d") {
      if (mv.getAttribute("src") !== f.model) { mv.setAttribute("poster", f.views ? f.views.front : ""); mv.setAttribute("src", f.model); }
      mv.setAttribute("alt", "3D model of Hugh wearing the " + f.name);
    } else if (turning) {
      art.src = f.views[view];
      art.alt = "Hugh wearing the " + f.name + ", " + TURN_LABEL[view].toLowerCase() + " view";
    } else {
      var st = stack(outfit, true);
      st.setAttribute("role", "img");
      st.setAttribute("aria-label", "Hugh wearing " + wornIds().map(function (id) { return PIECES[id].name; }).join(", "));
      fill("layered", [st]);
    }

    // View controls: the angle label itself turns Hugh (Front → Right side → Back → Left side)
    var kids = [];
    if (f && f.views) {
      var lab = viewButton(turning ? TURN_LABEL[view] : "Front", "Turn: showing " + (turning ? TURN_LABEL[view] : "3D") + ". Tap for the next angle", null, function () { turn(1); });
      lab.className = "angle";
      kids.push(lab);
    }
    $("turnL").hidden = $("turnR").hidden = !(f && f.views);
    if (ok["3d"]) kids.push(viewButton("3D", "Show in 3D", view === "3d", function () { view = view === "3d" ? "front" : "3d"; renderRoom(); }));
    if (MIX) kids.push(viewButton("Mix", "Mix and match", view === "layers", function () { view = "layers"; renderRoom(); }));
    fill("viewToggle", kids);
    $("viewToggle").hidden = kids.length < 1;
    fill("bars", FITS.map(function (_, k) { var b = el("span"); if (k <= cur) b.className = "on"; return b; }));
  }

  function renderPanel() {
    var m = matchingFit();
    var fit = m > -1 ? FITS[m] : null;
    $("kicker").textContent = fit ? "WEARING NOW · " + fit.brand + " · " + (m + 1) + " OF " + n : "WEARING NOW · MIX AND MATCH";
    $("fitName").textContent = fit ? fit.name : "Your Custom Fit";

    var shown = SLOTS.slice().reverse().filter(function (s) { return MIX || outfit[s.id]; });
    var rows = shown.map(function (s) {
      var pid = outfit[s.id], p = PIECES[pid];
      var row = el("div", "piece");
      var sw = el("div", "swatch"); sw.style.background = p ? p.color : "transparent";
      if (!p) sw.classList.add("none");
      var info = el("div", "info");
      info.appendChild(el("div", "slot", s.label.toUpperCase() + (p ? " · " + p.brand : "")));
      info.appendChild(el("div", "pname", p ? p.name : "None"));
      if (p && p.detail) info.appendChild(el("div", "detail", p.detail));
      var price = el("div", "price", p ? money(p.price) : "");
      var swap = el("div", "swap");
      var back = el("button", "", "‹"), fwd = el("button", "", "›");
      back.type = "button"; fwd.type = "button";
      back.setAttribute("aria-label", "Previous " + s.label.toLowerCase());
      fwd.setAttribute("aria-label", "Next " + s.label.toLowerCase());
      back.addEventListener("click", function () { cycle(s, -1); });
      fwd.addEventListener("click", function () { cycle(s, 1); });
      swap.append(back, fwd);
      row.append(sw, info, price);
      if (MIX) row.appendChild(swap);
      if (p) {
        var add = el("button", "add-one", "+");
        add.type = "button";
        add.setAttribute("aria-label", "Add " + p.name + " to bag");
        add.addEventListener("click", function () { addPieces([pid]); });
        row.appendChild(add);
      } else {
        row.appendChild(el("span", "add-gap"));
      }
      return row;
    });
    fill("pieceList", rows);
    var count = wornIds().length;
    $("addFit").textContent = count > 1 ? "Add the full fit to bag" : "Add to bag";
    $("lede").textContent = MIX
      ? "Everything on the model is for sale. Swap any piece with ‹ › to build your own fit."
      : "Everything on the model is for sale" + (count > 1 ? ". Get the whole fit or one piece." : ".");

    fill("chips", FITS.map(function (f, k) {
      var b = el("button", k === m ? "on" : "", f.brand);
      b.type = "button";
      b.setAttribute("aria-label", "Show the " + f.name);
      b.setAttribute("aria-pressed", k === m ? "true" : "false");
      b.addEventListener("click", function () { go(k); });
      return b;
    }));
    $("saveBtn").setAttribute("aria-pressed", saved[saveKey()] ? "true" : "false");
  }

  function saveKey() { var m = matchingFit(); return m > -1 ? FITS[m].id : "custom:" + wornIds().join("+"); }
  function render() { renderRoom(); renderPanel(); }
  function go(i) { cur = at(i); outfit = outfitOf(FITS[cur]); view = defaultView(FITS[cur]); render(); }

  function cycle(slot, dir) {
    // Only pieces with layer art can be swapped onto the model
    var opts = Object.keys(PIECES).filter(function (id) { return PIECES[id].slot === slot.id && PIECES[id].layer; });
    if (slot.optional) opts.unshift(null);
    var i = opts.indexOf(outfit[slot.id] || null);
    outfit[slot.id] = opts[((i + dir) % opts.length + opts.length) % opts.length];
    view = "layers";
    render();
  }

  function addPieces(ids) {
    ids.forEach(function (pid) {
      var p = PIECES[pid];
      var line = bag.find(function (l) { return l.key === pid; });
      if (line) line.qty += 1;
      else bag.push({ key: pid, name: p.name, brand: p.brand, price: p.price, variantId: p.variantId || "", qty: 1 });
    });
    saveBag(); renderBag();
    toast(ids.length > 1 ? "Full fit added to bag" : "Added to bag");
  }

  function checkoutUrl() {
    var domain = (SHOP.shopify && SHOP.shopify.domain || "").trim();
    if (!domain || !bag.length) return "";
    if (bag.some(function (l) { return !l.variantId; })) return "";
    return "https://" + domain + "/cart/" + bag.map(function (l) { return l.variantId + ":" + l.qty; }).join(",");
  }

  function renderBag() {
    // Keep bag lines in step with the latest product data (prices, variant IDs);
    // drop lines for products that no longer exist.
    bag = bag.filter(function (l) { return PIECES[l.key]; });
    bag.forEach(function (l) { var p = PIECES[l.key]; l.price = p.price; l.variantId = p.variantId || ""; l.name = p.name; l.brand = p.brand; });
    var count = bag.reduce(function (s, l) { return s + l.qty; }, 0);
    $("bagCount").textContent = count;
    var lines = bag.map(function (l, i) {
      var row = el("div", "line");
      var info = el("div", "info");
      info.style.flex = "1";
      info.appendChild(el("div", "slot", l.brand));
      info.appendChild(el("div", "pname", l.name));
      info.appendChild(el("div", "price", money(l.price)));
      var q = el("div", "qty");
      var minus = el("button", "", "−"); minus.type = "button"; minus.setAttribute("aria-label", "Remove one " + l.name);
      var plus = el("button", "", "+"); plus.type = "button"; plus.setAttribute("aria-label", "Add one more " + l.name);
      minus.addEventListener("click", function () { l.qty -= 1; if (l.qty < 1) bag.splice(i, 1); saveBag(); renderBag(); });
      plus.addEventListener("click", function () { l.qty += 1; saveBag(); renderBag(); });
      q.append(minus, el("span", "", String(l.qty)), plus);
      row.append(info, q);
      return row;
    });
    if (!lines.length) lines = [el("p", "empty", "Your bag is empty. Tap a fit to start.")];
    fill("bagLines", lines);

    var priced = bag.every(function (l) { return l.price != null; });
    $("bagTotal").textContent = bag.length && priced
      ? money(bag.reduce(function (s, l) { return s + l.price * l.qty; }, 0)) : "—";
    var url = checkoutUrl(), btn = $("checkout");
    if (url) { btn.href = url; btn.removeAttribute("aria-disabled"); $("checkoutNote").hidden = true; }
    else { btn.removeAttribute("href"); btn.setAttribute("aria-disabled", "true"); $("checkoutNote").hidden = false; }
  }

  var toastTimer;
  function toast(msg) {
    var t = $("toast"); t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 1600);
  }
  function openBag(open) {
    $("drawer").hidden = !open; $("scrim").hidden = !open;
    if (open) $("closeBag").focus();
  }

  // Swipe left/right on the room, like a reel (not when spinning the 3D model)
  var sx = null;
  $("room").addEventListener("touchstart", function (e) {
    sx = e.target.closest && e.target.closest("model-viewer") ? null : e.touches[0].clientX;
  }, { passive: true });
  $("room").addEventListener("touchend", function (e) {
    if (sx == null) return;
    var dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1));
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !$("drawer").hidden) openBag(false);
  });

  $("turnL").addEventListener("click", function () { turn(-1); });
  $("turnR").addEventListener("click", function () { turn(1); });
  $("tapPrev").addEventListener("click", function () { go(cur - 1); });
  $("tapNext").addEventListener("click", function () { go(cur + 1); });
  $("addFit").addEventListener("click", function () { addPieces(wornIds()); });
  $("railAdd").addEventListener("click", function () { $("addFit").click(); });
  $("saveBtn").addEventListener("click", function () {
    var key = saveKey(); saved[key] = !saved[key]; renderPanel(); toast(saved[key] ? "Fit saved" : "Removed from saved");
  });
  $("shareBtn").addEventListener("click", function () {
    var m = matchingFit();
    var url = location.href.split("#")[0] + "#" + (m > -1 ? FITS[m].id : "fit=" + wornIds().join("+"));
    var data = { title: "H91 Supply · " + (m > -1 ? FITS[m].name : "My custom fit"), url: url };
    if (navigator.share) navigator.share(data).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { toast("Link copied"); });
  });
  $("bagBtn").addEventListener("click", function () { openBag(true); });
  $("closeBag").addEventListener("click", function () { openBag(false); });
  $("scrim").addEventListener("click", function () { openBag(false); });
  $("checkout").addEventListener("click", function (e) { if (!checkoutUrl()) e.preventDefault(); });

  // Start from a shared link: #plaid, or #fit=piece+piece (a custom fit)
  var hash = location.hash.slice(1);
  var startFit = FITS.findIndex(function (f) { return f.id === hash; });
  go(startFit > -1 ? startFit : 0);
  if (MIX && hash.indexOf("fit=") === 0) {
    var ids = hash.slice(4).split("+").filter(function (id) { return PIECES[id]; });
    if (ids.length) {
      SLOTS.forEach(function (s) { outfit[s.id] = null; });
      ids.forEach(function (id) { outfit[PIECES[id].slot] = id; });
      view = "layers"; render();
    }
  }
  renderBag();

  window.H91_STORE = { checkoutUrl: checkoutUrl, go: go, cycle: cycle, outfit: function () { return outfit; }, view: function () { return view; } };
})();
