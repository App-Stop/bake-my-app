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

## Device previews

Every demo offers Desktop, Tablet and Mobile previews, limited by the visitor's device (`demoDevice.js`): phones see Mobile, tablets see Tablet and Mobile, desktops see all three. Touch-only devices are classed by their shorter side (under 600px is a phone); mouse devices by window width (under 640px phone, under 1024px tablet). The choice is shared across demos for the visit. The Customer Mobile App demo is phone-only and shows no switch.

Desktop shows the switch in the demo bar; phones and tablets show it beside Back to Home. Tablet previews use an iPad mini mockup (744 × 1133 canvas, iPad status bar) styled like the iPhone one. Admin and Staff previews render inside a device-sized iframe with the page styles mirrored, so their viewport breakpoints match the previewed device on any screen.

## Admin mobile — 264 frames

The admin dashboard follows Overview (`264:7541`), Branches (`264:7747`), Orders active and completed (`264:8006`, `264:8230`), Menu (`264:8722`), Customers (`264:7904`), Promotions (`264:9057`), Analytics (`264:9197`) and Settings (`264:9325`) below the `sm` breakpoint: app bar with centered logo, full-width time ranges, two-column stats, Quick Access first on Overview, list and card rows in place of tables, category chips on Menu and underlined section tabs on Settings. Tablet and desktop layouts are unchanged. Analytics keeps its existing range options (7D–Lifetime), which select its data sets.

### Admin details, dialogs and staff mobile — 264 frames

- Order detail (`264:8442`–`264:8652`): below `sm` the order drawer is a full page with a back button; the next timeline step is highlighted in the brand color and the action button follows the step (Mark as Ready, Dispatch Order, Mark as Delivered, Complete).
- Menu empty and single-item category states (`264:8901`, `264:8973`).
- Dialogs (`264:9568` branch, `264:9802` category, `264:10048` item, `264:10258`–`264:10528` campaign steps, `264:13552`–`264:11866` brand color and preview) become bottom sheets via the shared `dash-sheet-backdrop` / `dash-sheet` classes in `index.css`. The brand color sheet shows the live preview inline below the presets.
- Staff portal (`264:15671`–`264:16079`): one-row header with time and log out, Orders / Menu switch card, full-page order detail with step-coloured actions, and menu items with description, price and stock on their own line. Tablet keeps the existing `max-lg` layout.
