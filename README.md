# H91 Supply

One fitting-room store for Hood Star, Hugh, Hugh's Hot Bowls, Satchmos and H91.

Live: https://hugh91.github.io/supply/

## Editing products

Everything the store shows lives in `data/fits.js`:

- **Fits**: each fit has a name, brand, colors and its pieces.
- **Prices**: put a number (e.g. `45`). `null` shows "Price TBA".
- **3D avatar**: add `model: "models/your-file.glb"` to a fit. Fits without one show a placeholder figure.

## Turning on Shopify checkout

1. Create the products in Shopify.
2. In `data/fits.js`, set `shopify.domain` (e.g. `h91-supply.myshopify.com`).
3. Give each piece its Shopify `variantId`.

Checkout then sends the bag straight to a Shopify cart.

## Pages

- `index.html`: the store
- `avatar.html`: full-screen 3D avatar viewer
