// H91 Supply product data. Edit this file to change what the store shows.
//
// SHOPIFY: once products exist in Shopify, fill in `shopify.domain` and each
// piece's `variantId` (the number in the variant's admin URL). Checkout turns on
// by itself when every piece in the bag has a variantId.
//
// PRICES: use numbers in dollars (e.g. 45). Leave null to show "Price TBA".
// MODEL: a fit with `model` shows the 3D avatar on the stand; without one,
// a placeholder figure in the fit's colors stands in.

window.H91_SHOP = {
  shopify: {
    domain: "",          // e.g. "h91-supply.myshopify.com"
  },
};

window.H91_FITS = [
  {
    id: "plaid",
    name: "The Plaid Fit",
    brand: "H91",
    model: "models/hugh-plaid-v2.glb",
    poster: "models/hugh-plaid-preview.png",
    colors: { hat: "#2E2E2E", top: "#6E6A70", bottom: "#3B4A6B", shoes: "#3A2A20" },
    pieces: [
      { slot: "Head", name: "[Bandana]", price: null, variantId: "" },
      { slot: "Top", name: "[Plaid overshirt]", price: null, variantId: "" },
      { slot: "Bottom", name: "[Denim]", price: null, variantId: "" },
      { slot: "Shoes", name: "[Boots]", price: null, variantId: "" },
    ],
  },
  {
    id: "hood-star",
    name: "Hood Star Fit",
    brand: "HOOD STAR",
    colors: { hat: "#0B0B0B", top: "#FFD400", bottom: "#1E1E1E", shoes: "#FFFFFF" },
    pieces: [
      { slot: "Hat", name: "[Hood Star cap]", price: null, variantId: "" },
      { slot: "Top", name: "[Hood Star tee]", price: null, variantId: "" },
      { slot: "Bottom", name: "[Hood Star cargos]", price: null, variantId: "" },
    ],
  },
  {
    id: "hugh",
    name: "Hugh Fit",
    brand: "HUGH",
    colors: { hat: "#FFFFFF", top: "#FFFFFF", bottom: "#3B4A6B", shoes: "#0B0B0B" },
    pieces: [
      { slot: "Hat", name: "[Hugh beanie]", price: null, variantId: "" },
      { slot: "Top", name: "[Hugh tour tee]", price: null, variantId: "" },
      { slot: "Bottom", name: "[Denim]", price: null, variantId: "" },
    ],
  },
  {
    id: "hot-bowls",
    name: "Hot Bowls Fit",
    brand: "HUGH'S HOT BOWLS",
    colors: { hat: "#B23A2B", top: "#F3E9D2", bottom: "#2B2B2B", shoes: "#FFFFFF" },
    pieces: [
      { slot: "Hat", name: "[Hot Bowls cap]", price: null, variantId: "" },
      { slot: "Top", name: "[Hot Bowls apron tee]", price: null, variantId: "" },
      { slot: "Bottom", name: "[Chef pants]", price: null, variantId: "" },
    ],
  },
  {
    id: "satchmos",
    name: "Satchmos Fit",
    brand: "SATCHMOS",
    colors: { hat: "#5B2A86", top: "#5B2A86", bottom: "#E8C547", shoes: "#FFFFFF" },
    pieces: [
      { slot: "Hat", name: "[Satchmos bucket hat]", price: null, variantId: "" },
      { slot: "Top", name: "[Satchmos crewneck]", price: null, variantId: "" },
      { slot: "Bottom", name: "[Satchmos shorts]", price: null, variantId: "" },
    ],
  },
];
