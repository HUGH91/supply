# H91 Supply

One fitting-room store for Hood Star, Hugh, Hugh's Hot Bowls, Satchmos and H91.

Live: https://hugh91.github.io/supply/

## Editing products

Everything the store shows lives in `data/fits.js`:

- **Pieces** (`H91_PIECES`): one entry per product, with its brand, slot, name, price and layer image.
- **Fits** (`H91_FITS`): preset outfits shown on the stand and the mannequins. Shoppers can swap any piece to build their own.
- **Prices**: put a number (e.g. `45`). `null` shows "Price TBA".
- **3D avatar**: add `model: "models/your-file.glb"` to a fit for the 3D view.

## Fit art

Whole-fit illustrations (front and back) live in `art/fits/`, and their 3D models in `models/fits/`.
A fit with `art` opens on the Front view, with Back and 3D next to it. `mannequin` sets the headless
image used when the fit stands on a side mannequin.

## Layer art

Every piece is a transparent 2400×4000 image drawn on the tracing template, so any piece stacks on any other.
The full rules are in the art spec doc; the templates are in `art/`.

- `art/template-guide.png`: tracing guide with Hugh's real proportions
- `art/template-overlay.png`: the same outline and guide lines on a transparent layer
- `art/layers/`: stand-in layers. Replace a file with real art under the same name, converted to `.webp`.

Mix and match stays off (`mixAndMatch: false` in `data/fits.js`) until real layer art exists; only pieces with a `layer` can be swapped.

## Turning on Shopify checkout

1. Create the products in Shopify.
2. In `data/fits.js`, set `shopify.domain` (e.g. `h91-supply.myshopify.com`).
3. Give each piece its Shopify `variantId`.

Checkout then sends the bag straight to a Shopify cart.

## Pages

- `index.html`: the store
- `avatar.html`: full-screen 3D avatar viewer
