# H91 Supply

One fitting-room store for Hood Star, Hugh, Hugh's Hot Bowls, Satchmos and H91.

Live: https://hugh91.github.io/supply/

## How it works

Every look is Hugh in the same pose, rendered from four angles plus a 3D model.
Shoppers switch looks with a tap or swipe, turn Hugh with ↶ ↷ (front, right side, back, left side),
or tap 3D to spin the model. The side mannequins are headless crops of the next and previous looks.

## Files

- `art/looks/<look>_<front|right|back|left>.webp`: the four renders per look (420×880, transparent)
- `models/looks/<look>.glb`: the 3D model per look (loads only when 3D is tapped)
- `art/base/` and `models/base/`: Hugh in the cream base tee, kept for layering single pieces later
- `data/fits.js`: products and looks; `assets/`: the store's code and styles

## Adding a look

1. Render the four angles in the same frame and pose as the existing ones, on white.
2. Cut out the background and save them as `art/looks/<look>_<view>.webp`; add the GLB to `models/looks/`.
3. Add the product to `H91_PIECES` and one line to `H91_FITS` in `data/fits.js`.

## Prices and Shopify checkout

- **Prices**: put a number (e.g. `45`) on each piece. `null` shows "Price TBA".
- **Checkout**: set `shopify.domain` (e.g. `h91-supply.myshopify.com`) and each piece's `variantId`.
  Checkout then sends the bag straight to a Shopify cart.

## Mix and match

Off for now (`mixAndMatch: false`). It turns on once single pieces have their own layer art;
only pieces with a `layer` can be swapped.
