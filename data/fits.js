// H91 Supply product data. Edit this file to change what the store shows.
//
// LOOKS: every look is Hugh in the same pose, rendered from four angles
// (art/looks/<look>_<view>.webp, 420x880, transparent) plus a 3D model
// (models/looks/<look>.glb). All renders share one frame, so new merch
// rendered the same way lines up exactly.
//
// SHOPIFY: fill in `shopify.domain` and each piece's `variantId` (the number in
// the variant's admin URL). Checkout turns on once every piece in the bag has one.
//
// PRICES: numbers in dollars (e.g. 45). null shows "Price TBA".

window.H91_SHOP = {
  shopify: {
    domain: "",          // e.g. "h91-supply.myshopify.com"
  },
  // Hugh in the cream base tee, for layering single pieces later.
  base: {
    views: {
      front: "art/base/cream-tee-base_front.webp", right: "art/base/cream-tee-base_right.webp",
      back: "art/base/cream-tee-base_back.webp", left: "art/base/cream-tee-base_left.webp",
    },
    model: "models/base/cream-tee-base.glb",
  },
  // Mix and match (swapping single pieces) turns on once pieces have layer art.
  mixAndMatch: false,
  // 3D view is hidden until the 3D models are improved; the files stay in models/.
  show3d: false,
  slots: [
    { id: "shoes", label: "Shoes" },
    { id: "bottoms", label: "Bottoms" },
    { id: "tops", label: "Top" },
    { id: "outerwear", label: "Outerwear", optional: true },
    { id: "headwear", label: "Headwear", optional: true },
  ],
};

window.H91_PIECES = {
  "hood-star-tee":        { brand: "HOOD STAR", slot: "tops", name: "Hood Star tee", detail: "Washed charcoal · Leimert Park print", color: "#3A3633", price: null, variantId: "", layer: null },
  "h91-hoodie":           { brand: "H91", slot: "tops", name: "H91 hoodie", detail: "Forest green · varsity lettering", color: "#24402F", price: null, variantId: "", layer: null },
  "hot-bowls-chore-coat": { brand: "HUGH'S HOT BOWLS", slot: "outerwear", name: "Hot Bowls chore coat", detail: "Cobalt twill · embroidered patch", color: "#1F3C9C", price: null, variantId: "", layer: null },
};

function h91Look(id) {
  return {
    views: {
      front: "art/looks/" + id + "_front.webp", right: "art/looks/" + id + "_right.webp",
      back: "art/looks/" + id + "_back.webp", left: "art/looks/" + id + "_left.webp",
    },
    model: "models/looks/" + id + ".glb",
  };
}

// The looks on the stand and the mannequins, in order.
window.H91_FITS = [
  Object.assign({ id: "hood-star-tee", name: "Hood Star Tee Fit", brand: "HOOD STAR", pieces: ["hood-star-tee"] }, h91Look("hood-star-tee")),
  Object.assign({ id: "h91-hoodie", name: "H91 Hoodie Fit", brand: "H91", pieces: ["h91-hoodie"] }, h91Look("h91-hoodie")),
  Object.assign({ id: "hot-bowls-chore-coat", name: "Hot Bowls Coat Fit", brand: "HUGH'S HOT BOWLS", pieces: ["hot-bowls-chore-coat"] }, h91Look("hot-bowls-chore-coat")),
];
