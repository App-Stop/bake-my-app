# Mobile setup and demo preview shells

Implemented from Figma MCP design context and screenshots in cozy:

- Setup: `250:2602`
- Mobile app preview: `250:2666`
- Website preview: `250:3027`
- Admin preview: `250:3462`
- Staff preview: `250:3703`

The demo pages share the 234.577 × 510 phone frame, Back to Home link, horizontal customization palette, four demo tabs and gradient checkout offer. At the 402 × 874 reference viewport, the frame starts at y=76. It scales down on shorter phones; very short landscape screens can scroll the page to reach the controls. Desktop preview layouts retain their existing presentation.

This change covers the surrounding preview pages. The existing app, storefront, dashboard and staff components remain the content inside the frames; their internal responsive designs are deferred. Admin/staff and website previews render their existing content on a 402px canvas scaled to the frame. The mobile app retains its existing native phone rendering.

Setup reuses the existing logo, upload field, text fields and launch flow, with a full-width upload area and a five-column color grid on phones. Skip for now opens the selected demo without submitting a lead. The existing privacy disclosure remains visible below the mobile card. Logo uploads and all ten brand colors remain connected to the shared demo customization state.

`public/figma/demo-preview/color-marker.svg` is the original 18 × 18 selection marker (`7dbf1.svg`) returned for `250:3462`, displayed through a mask and colored to match the selected swatch. Other visible artwork is reused from existing local assets and components. No temporary Figma URLs are used at runtime.

Validation covers 320, 375, 402 and 768px widths, short landscape, desktop smoke checks, demo tab/checkout navigation, logo upload, launch and skip flows, and all ten shared brand colors. Build and targeted ESLint pass. Full ESLint still reports the eight pre-existing `DeliveryPanels.jsx` errors. Google Fonts are network-blocked in this environment, so browser screenshots use fallback text fonts; layout geometry and interactions were checked independently.
