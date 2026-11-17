# Mobile setup and demo preview shells

Implemented from Figma MCP design context and screenshots in cozy:

- Setup: `250:2602`
- Mobile app preview: `250:2666`
- Website preview: `250:3027`
- Admin preview: `250:3462`
- Staff preview: `250:3703`

The demo pages share a phone frame with a 402:874 aspect ratio, Back to Home link, horizontal customization palette, four demo tabs and gradient checkout offer. A ResizeObserver fits the preview to the space remaining after the controls. All three control bars are 48px tall with 44px touch targets, 12px gaps, and 24px plus the bottom safe-area inset below checkout. Short landscape screens place the controls beside the preview. Desktop preview layouts retain their existing presentation.

This change covers the surrounding preview pages. The existing app, storefront, dashboard and staff components remain the content inside the frames; their internal responsive designs are deferred. Admin/staff and website previews render their existing content on a 402px canvas scaled to the frame. The mobile app retains its existing native phone rendering.

Setup preserves the original `250:2602` mobile composition: full-width upload, colors below it, three vertically stacked fields, and stacked launch/skip actions. A ResizeObserver measures the original 402px-wide composition and uniformly scales it into the available viewport, including safe-area padding, without changing its arrangement. Inputs retain a computed 16px size to avoid input zoom. The privacy disclosure remains visible below the card. Skip opens the selected demo without submitting a lead. Logo uploads and all ten brand colors remain connected to the shared demo customization state.

`public/figma/demo-preview/customize.svg` is the original outlined Figma Hand Bold lettering exported from `250:3059`, displayed at its exported 73 × 17 dimensions. It needs no web font. Selected colors use a compact ring around the swatch. The earlier `color-marker.svg` export is retained as a source asset. Other visible artwork is reused from existing local assets and components. No temporary Figma URLs are used at runtime.

Validation uses Chromium mobile emulation for portrait and landscape sizes, desktop smoke checks, demo tab/checkout navigation, logo upload, launch availability, skip, and brand-color changes. It also checks 16px mobile inputs, SVG loading and dimensions, 44px demo touch targets, keyboard-sized viewports, enlarged text, and page overflow. Production build passes. Real-device Safari testing remains separate from browser emulation.
