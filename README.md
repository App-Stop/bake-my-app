# Bake My App

Marketing website and interactive product demos built with React and Vite.

Run npm ci, copy .env.example to .env.local, then run npm run dev (port 5173). Use npm run build for production and npm run preview to serve the build. The included Vercel configuration rewrites routes to the SPA.

Routes: /, /pricing, /contact, /checkout, /checkout/success, /coming-soon, /demo/mobile-app, /demo/website, /demo/admin, and /demo/staff. The preview picker opens demos directly. Pricing, lead forms, and checkout continue to use VITE_API_URL.

The bakery owner panel has been extracted to the independent sibling project D:\Development\bake-my-panel. This project no longer serves /app or contains owner onboarding. The framed admin demo has its own copy of the dashboard in src/landing/demo/admin and in-memory sample setup state in useDemoState.js. Demo menu, branches, and brand customization use separate demo storage keys. The projects have no source or runtime dependency on each other.

Returning visitors can still pre-fill checkout from legacy same-origin setup contact details. Browser storage does not transfer automatically between the landing and panel origins. The owner panel retains prototype data and browser persistence; extraction does not add backend features or authentication.
