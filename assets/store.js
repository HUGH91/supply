(function () {
  "use strict";
  var SHOP = window.H91_SHOP || { shopify: {}, slots: [] };
  var PIECES = window.H91_PIECES || {};
  var FITS = window.H91_FITS || [];
  var SLOTS = SHOP.slots;
  var n = FITS.length;

  var cur = 0;            // preset fit on the stand
  var outfit = {};        // slot id -> piece id (or null)
  var view = "3d";        // "3d" or "layers"
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
    if (withBase && SHOP.base) box.appendChild(layerImg(SHOP.base));
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

  function renderRoom() {
    var prev = FITS[at(cur - 1)], next = FITS[at(cur + 1)];
    fill("standL", [stack(outfitOf(prev), false)]);
    fill("standR", [stack(outfitOf(next), false)]);
    $("tapPrev").setAttribute("aria-label", "Try on the " + prev.name);
    $("tapNext").setAttribute("aria-label", "Try on the " + next.name);

    var m = matchingFit();
    var has3d = m > -1 && !!FITS[m].model;
    var show3d = has3d && view === "3d";
    var mv = $("avatar");
    if (show3d) {
      var f = FITS[m];
      if (mv.getAttribute("src") !== f.model) { mv.setAttribute("poster", f.poster || ""); mv.setAttribute("src", f.model); }
      mv.setAttribute("alt", "3D avatar of Hugh wearing the " + f.name);
    }
    mv.hidden = !show3d;
    $("layered").hidden = show3d;
    if (!show3d) {
      var s = stack(outfit, true);
      s.setAttribute("role", "img");
      s.setAttribute("aria-label", "Hugh wearing " + wornIds().map(function (id) { return PIECES[id].name; }).join(", "));
      fill("layered", [s]);
    }
    $("viewToggle").hidden = !has3d;
    $("view3d").setAttribute("aria-pressed", show3d ? "true" : "false");
    $("viewLayers").setAttribute("aria-pressed", show3d ? "false" : "true");
    fill("bars", FITS.map(function (_, k) { var b = el("span"); if (k <= cur) b.className = "on"; return b; }));
  }

  function renderPanel() {
    var m = matchingFit();
    var fit = m > -1 ? FITS[m] : null;
    $("kicker").textContent = fit ? "WEARING NOW · " + fit.brand + " · " + (m + 1) + " OF " + n : "WEARING NOW · MIX AND MATCH";
    $("fitName").textContent = fit ? fit.name : "Your Custom Fit";

    var rows = SLOTS.slice().reverse().map(function (s) {
      var pid = outfit[s.id], p = PIECES[pid];
      var row = el("div", "piece");
      var sw = el("div", "swatch"); sw.style.background = p ? p.color : "transparent";
      if (!p) sw.classList.add("none");
      var info = el("div", "info");
      info.appendChild(el("div", "slot", s.label.toUpperCase() + (p ? " · " + p.brand : "")));
      info.appendChild(el("div", "pname", p ? p.name : "None"));
      var price = el("div", "price", p ? money(p.price) : "");
      var swap = el("div", "swap");
      var back = el("button", "", "‹"), fwd = el("button", "", "›");
      back.type = "button"; fwd.type = "button";
      back.setAttribute("aria-label", "Previous " + s.label.toLowerCase());
      fwd.setAttribute("aria-label", "Next " + s.label.toLowerCase());
      back.addEventListener("click", function () { cycle(s, -1); });
      fwd.addEventListener("click", function () { cycle(s, 1); });
      swap.append(back, fwd);
      row.append(sw, info, price, swap);
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
  function go(i) { cur = at(i); outfit = outfitOf(FITS[cur]); view = "3d"; render(); }

  function cycle(slot, dir) {
    var opts = Object.keys(PIECES).filter(function (id) { return PIECES[id].slot === slot.id; });
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

  $("tapPrev").addEventListener("click", function () { go(cur - 1); });
  $("tapNext").addEventListener("click", function () { go(cur + 1); });
  $("addFit").addEventListener("click", function () { addPieces(wornIds()); });
  $("railAdd").addEventListener("click", function () { $("addFit").click(); });
  $("view3d").addEventListener("click", function () { view = "3d"; renderRoom(); });
  $("viewLayers").addEventListener("click", function () { view = "layers"; renderRoom(); });
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
  if (hash.indexOf("fit=") === 0) {
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
