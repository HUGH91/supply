(function () {
  "use strict";
  var FITS = window.H91_FITS || [];
  var SHOP = window.H91_SHOP || { shopify: {} };
  var n = FITS.length;
  var cur = 0;
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

  // Placeholder figure in a fit's colours
  function figure(c, withHead) {
    var f = el("div", "fig");
    var parts = [
      ["hat", c.hat], ["head", withHead ? "#7A4B2E" : "transparent"], ["neck", withHead ? "#7A4B2E" : "transparent"]
    ];
    parts.forEach(function (p) { var d = el("div", p[0]); d.style.background = p[1]; f.appendChild(d); });
    var torso = el("div", "torso");
    ["arm", "body", "arm"].forEach(function (k) { var d = el("div", k); d.style.background = c.top; torso.appendChild(d); });
    f.appendChild(torso);
    var legs = el("div", "legs");
    for (var i = 0; i < 2; i++) { var l = el("div", "leg"); l.style.background = c.bottom; legs.appendChild(l); }
    f.appendChild(legs);
    var feet = el("div", "feet");
    for (var j = 0; j < 2; j++) { var s = el("div", "shoe"); s.style.background = c.shoes; feet.appendChild(s); }
    f.appendChild(feet);
    return f;
  }

  function renderRoom() {
    var prev = FITS[at(cur - 1)], next = FITS[at(cur + 1)], fit = FITS[cur];
    $("standL").replaceChildren(figure(prev.colors, false));
    $("standR").replaceChildren(figure(next.colors, false));
    $("tapPrev").setAttribute("aria-label", "Try on the " + prev.name);
    $("tapNext").setAttribute("aria-label", "Try on the " + next.name);

    var mv = $("avatar"), ph = $("placeholder");
    if (fit.model) {
      if (mv.getAttribute("src") !== fit.model) {
        mv.setAttribute("poster", fit.poster || "");
        mv.setAttribute("src", fit.model);
      }
      mv.setAttribute("alt", "3D avatar of Hugh wearing the " + fit.name);
      mv.hidden = false; ph.hidden = true;
    } else {
      mv.hidden = true; ph.hidden = false;
      ph.replaceChildren(figure(fit.colors, true), el("div", "soon", "3D model coming soon"));
    }
    $("bars").replaceChildren.apply($("bars"), FITS.map(function (_, k) {
      var s = el("span"); if (k <= cur) s.className = "on"; return s;
    }));
  }

  function renderPanel() {
    var fit = FITS[cur];
    $("kicker").textContent = "WEARING NOW · " + fit.brand + " · " + (cur + 1) + " OF " + n;
    $("fitName").textContent = fit.name;
    var colorFor = { Hat: "hat", Head: "hat", Top: "top", Bottom: "bottom", Shoes: "shoes" };
    var rows = fit.pieces.map(function (p, i) {
      var row = el("div", "piece");
      var sw = el("div", "swatch"); sw.style.background = fit.colors[colorFor[p.slot]] || "#DDD";
      var info = el("div", "info");
      info.appendChild(el("div", "slot", p.slot.toUpperCase()));
      info.appendChild(el("div", "pname", p.name));
      var add = el("button", "add-one", "+");
      add.type = "button";
      add.setAttribute("aria-label", "Add " + p.name + " to bag");
      add.addEventListener("click", function () { addPieces([[fit, i]]); });
      row.append(sw, info, el("div", "price", money(p.price)), add);
      return row;
    });
    $("pieceList").replaceChildren.apply($("pieceList"), rows);
    var chips = FITS.map(function (f, k) {
      var b = el("button", k === cur ? "on" : "", f.brand);
      b.type = "button";
      b.setAttribute("aria-label", "Show the " + f.name);
      b.setAttribute("aria-pressed", k === cur ? "true" : "false");
      b.addEventListener("click", function () { go(k); });
      return b;
    });
    $("chips").replaceChildren.apply($("chips"), chips);
    $("saveBtn").setAttribute("aria-pressed", saved[fit.id] ? "true" : "false");
  }

  function go(i) { cur = at(i); renderRoom(); renderPanel(); }

  function addPieces(list) {
    list.forEach(function (fp) {
      var fit = fp[0], p = fit.pieces[fp[1]];
      var key = fit.id + ":" + fp[1];
      var line = bag.find(function (l) { return l.key === key; });
      if (line) line.qty += 1;
      else bag.push({ key: key, name: p.name, brand: fit.brand, price: p.price, variantId: p.variantId || "", qty: 1 });
    });
    saveBag(); renderBag();
    toast(list.length > 1 ? "Full fit added to bag" : "Added to bag");
  }

  function checkoutUrl() {
    var domain = (SHOP.shopify && SHOP.shopify.domain || "").trim();
    if (!domain || !bag.length) return "";
    if (bag.some(function (l) { return !l.variantId; })) return "";
    return "https://" + domain + "/cart/" + bag.map(function (l) { return l.variantId + ":" + l.qty; }).join(",");
  }

  function renderBag() {
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
    $("bagLines").replaceChildren.apply($("bagLines"), lines);

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

  // Swipe left/right on the room, like a reel
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
  $("addFit").addEventListener("click", function () { addPieces(FITS[cur].pieces.map(function (_, i) { return [FITS[cur], i]; })); });
  $("railAdd").addEventListener("click", function () { $("addFit").click(); });
  $("saveBtn").addEventListener("click", function () { var id = FITS[cur].id; saved[id] = !saved[id]; renderPanel(); toast(saved[id] ? "Fit saved" : "Removed from saved"); });
  $("shareBtn").addEventListener("click", function () {
    var data = { title: "H91 Supply · " + FITS[cur].name, url: location.href.split("#")[0] + "#" + FITS[cur].id };
    if (navigator.share) navigator.share(data).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(function () { toast("Link copied"); });
  });
  $("bagBtn").addEventListener("click", function () { openBag(true); });
  $("closeBag").addEventListener("click", function () { openBag(false); });
  $("scrim").addEventListener("click", function () { openBag(false); });
  $("checkout").addEventListener("click", function (e) { if (!checkoutUrl()) e.preventDefault(); });

  var start = FITS.findIndex(function (f) { return "#" + f.id === location.hash; });
  go(start > -1 ? start : 0);
  renderBag();

  window.H91_STORE = { checkoutUrl: checkoutUrl, go: go, addPieces: addPieces, _bag: function () { return bag; } };
})();
