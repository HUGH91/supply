// H91 Supply product data. Edit this file to change what the store shows.
//
// LAYERS: every piece has a `layer` image drawn on the 2400x4000 template
// (see the art spec). Files in art/layers/ are stand-ins until the real
// drawings arrive; replace a file with the same name and the store updates.
//
// SHOPIFY: fill in `shopify.domain` and each piece's `variantId` (the number in
// the variant's admin URL). Checkout turns on once every piece in the bag has one.
//
// PRICES: numbers in dollars (e.g. 45). null shows "Price TBA".

window.H91_SHOP = {
  shopify: {
    domain: "",          // e.g. "h91-supply.myshopify.com"
  },
  base: "art/layers/base_front.webp",
  // Mix and match (swapping single pieces) turns on once real layer art exists
  // for every piece. Until then shoppers switch whole fits.
  mixAndMatch: false,
  // Bottom to top. Optional slots can be left empty when mixing and matching.
  slots: [
    { id: "shoes", label: "Shoes" },
    { id: "bottoms", label: "Bottoms" },
    { id: "tops", label: "Top" },
    { id: "outerwear", label: "Outerwear", optional: true },
    { id: "headwear", label: "Headwear", optional: true },
  ],
};

window.H91_PIECES = {
  "boots-brown":        { brand: "H91", slot: "shoes", name: "[Boots]", color: "#3A2A20", price: null, variantId: "", layer: "art/layers/h91_shoes_boots_brown.webp" },
  "sneakers-white":     { brand: "H91", slot: "shoes", name: "[White sneakers]", color: "#F2F2F2", price: null, variantId: "", layer: "art/layers/h91_shoes_sneakers_white.webp" },
  "sneakers-black":     { brand: "H91", slot: "shoes", name: "[Black sneakers]", color: "#1A1A1A", price: null, variantId: "", layer: "art/layers/h91_shoes_sneakers_black.webp" },

  "denim":              { brand: "H91", slot: "bottoms", name: "[Denim]", color: "#3B4A6B", price: null, variantId: "", layer: "art/layers/h91_bottoms_denim_indigo.webp" },
  "hs-cargos":          { brand: "HOOD STAR", slot: "bottoms", name: "[Hood Star cargos]", color: "#2A2A2A", price: null, variantId: "", layer: "art/layers/hood-star_bottoms_cargos_black.webp" },
  "hb-chef-pants":      { brand: "HUGH'S HOT BOWLS", slot: "bottoms", name: "[Chef pants]", color: "#3A3A3A", price: null, variantId: "", layer: "art/layers/hot-bowls_bottoms_chef-pants_charcoal.webp" },
  "sa-shorts":          { brand: "SATCHMOS", slot: "bottoms", name: "[Satchmos shorts]", color: "#E8C547", price: null, variantId: "", layer: "art/layers/satchmos_bottoms_shorts_gold.webp" },

  "plain-tee":          { brand: "H91", slot: "tops", name: "[Plain tee]", color: "#F4F4F4", price: null, variantId: "", layer: "art/layers/h91_tops_plain-tee_white.webp" },
  "hs-logo-tee":        { brand: "HOOD STAR", slot: "tops", name: "[Hood Star tee]", color: "#FFD400", price: null, variantId: "", layer: "art/layers/hood-star_tops_logo-tee_yellow.webp" },
  "hugh-tour-tee":      { brand: "HUGH", slot: "tops", name: "[Hugh tour tee]", color: "#FAFAFA", price: null, variantId: "", layer: "art/layers/hugh_tops_tour-tee_white.webp" },
  "hb-apron-tee":       { brand: "HUGH'S HOT BOWLS", slot: "tops", name: "[Hot Bowls apron tee]", color: "#F3E9D2", price: null, variantId: "", layer: "art/layers/hot-bowls_tops_apron-tee_cream.webp" },
  "sa-crewneck":        { brand: "SATCHMOS", slot: "tops", name: "[Satchmos crewneck]", color: "#5B2A86", price: null, variantId: "", layer: "art/layers/satchmos_tops_crewneck_purple.webp" },

  "hs-washed-tee":      { brand: "HOOD STAR", slot: "tops", name: "Hood Star tee", detail: "Washed charcoal · Leimert Park print", color: "#3A3633", price: null, variantId: "", layer: null },
  "h91-hoodie":         { brand: "H91", slot: "tops", name: "H91 hoodie", detail: "Forest green · varsity lettering", color: "#24402F", price: null, variantId: "", layer: null },
  "hb-chore-coat":      { brand: "HUGH'S HOT BOWLS", slot: "outerwear", name: "Hot Bowls chore coat", detail: "Cobalt twill · embroidered patch", color: "#1F3C9C", price: null, variantId: "", layer: null },

  "plaid-overshirt":    { brand: "H91", slot: "outerwear", name: "[Plaid overshirt]", color: "#6E6A70", price: null, variantId: "", layer: "art/layers/h91_outerwear_plaid-overshirt_charcoal.webp" },

  "bandana":            { brand: "H91", slot: "headwear", name: "[Bandana]", color: "#2E2E2E", price: null, variantId: "", layer: "art/layers/h91_headwear_bandana_black.webp" },
  "hs-cap":             { brand: "HOOD STAR", slot: "headwear", name: "[Hood Star cap]", color: "#0B0B0B", price: null, variantId: "", layer: "art/layers/hood-star_headwear_cap_black.webp" },
  "hugh-beanie":        { brand: "HUGH", slot: "headwear", name: "[Hugh beanie]", color: "#FFFFFF", price: null, variantId: "", layer: "art/layers/hugh_headwear_beanie_white.webp" },
  "hb-cap":             { brand: "HUGH'S HOT BOWLS", slot: "headwear", name: "[Hot Bowls cap]", color: "#B23A2B", price: null, variantId: "", layer: "art/layers/hot-bowls_headwear_cap_red.webp" },
  "sa-bucket":          { brand: "SATCHMOS", slot: "headwear", name: "[Satchmos bucket hat]", color: "#5B2A86", price: null, variantId: "", layer: "art/layers/satchmos_headwear_bucket-hat_purple.webp" },
};

// Preset fits shown on the stand and the mannequins.
// `art` = front/back illustrations, `model` = 3D view, `draft: true` = hidden.
window.H91_FITS = [
  { id: "hood-star-tee", name: "Hood Star Tee Fit", brand: "HOOD STAR", model: "models/fits/hood-star-tee.glb",
    art: { front: "art/fits/hood-star-tee_front.webp", back: "art/fits/hood-star-tee_back.webp" },
    pieces: ["hs-washed-tee"] },
  { id: "h91-hoodie", name: "H91 Hoodie Fit", brand: "H91", model: "models/fits/h91-hoodie.glb",
    art: { front: "art/fits/h91-hoodie_front.webp", back: "art/fits/h91-hoodie_back.webp" },
    pieces: ["h91-hoodie"] },
  { id: "hot-bowls-coat", name: "Hot Bowls Coat Fit", brand: "HUGH'S HOT BOWLS", model: "models/fits/hot-bowls-coat.glb",
    art: { front: "art/fits/hot-bowls-coat_front.webp", back: "art/fits/hot-bowls-coat_back.webp" },
    pieces: ["hb-chore-coat"] },
  { id: "plaid", name: "The Plaid Fit", brand: "H91", model: "models/hugh-plaid-v2.glb", poster: "models/hugh-plaid-preview.png",
    mannequin: "art/fits/plaid_mannequin.webp",
    pieces: ["boots-brown", "denim", "plain-tee", "plaid-overshirt", "bandana"] },
  // Stand-in fits for testing mix and match; hidden until their art is real.
  { id: "hood-star", name: "Hood Star Fit", brand: "HOOD STAR", draft: true,
    pieces: ["sneakers-white", "hs-cargos", "hs-logo-tee", "hs-cap"] },
  { id: "hugh", name: "Hugh Fit", brand: "HUGH", draft: true,
    pieces: ["sneakers-black", "denim", "hugh-tour-tee", "hugh-beanie"] },
  { id: "hot-bowls", name: "Hot Bowls Fit", brand: "HUGH'S HOT BOWLS", draft: true,
    pieces: ["sneakers-white", "hb-chef-pants", "hb-apron-tee", "hb-cap"] },
  { id: "satchmos", name: "Satchmos Fit", brand: "SATCHMOS", draft: true,
    pieces: ["sneakers-white", "sa-shorts", "sa-crewneck", "sa-bucket"] },
];
