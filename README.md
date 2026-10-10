# Ukadiche Modak — cinematic website prototype

React, Vite, Tailwind CSS and GSAP ScrollTrigger.

## Run

`npm install` then `npm run dev -- --host 0.0.0.0`.

Production: `npm run build`; serve `dist/`.

## Content and assets

Business: Ukadiche Modak (उकडीचे मोदक), Shop No. 10, Polite Hermitage, Shivtej Nagar Road, Shivatej Nagar, Pimpri-Chinchwad, Maharashtra 411019. Phone and WhatsApp: +91 95035 02689.

Source: user's Google Business Profile screen recording, https://drive.google.com/file/d/1uLyTIw_Dm-EmBp1vG2kRHKSBUdn3ZThm/view and Google Maps https://maps.app.goo.gl/Z7iuQg7QLAbgowMh8?g_st=ac . Rating 4.8 / 136 reviews is a recording snapshot, not a live feed. The eleven-year business history is explicitly attributed to the owner's statement. Three review excerpts retain visible customer names. Products, delivery, catering, tiffin, frozen/restaurant enquiries and 24-hour advance ordering come from the recording. Prices and current hours must be confirmed with the business.

Actual product photographs are cropped from the supplied screen recording. Cinematic hero imagery and 79 scroll frames derive from the user-supplied animation, https://drive.google.com/file/d/1V1rTiSXeM8peYXpPXUPD3l6cWB4yXrMC/view . The illustrative mark and colour palette are website concept branding.

## Interaction

GSAP maps the sticky section's scroll progress directly to 79 locally hosted WebP frames at 12 frames/second of source footage. Scrolling backward reverses the reveal. Four concurrent image loaders preload the selected mobile or desktop frames only near the section; a still poster appears while loading. A manual range provides keyboard access and exploration without scroll motion. Reduced-motion users get a static section with the manual control.

The accessible order dialog creates a WhatsApp enquiry addressed to the verified business phone. It does not submit a paid order. The business confirms price and availability. Map, telephone and WhatsApp links are real.

## October 10 UX revision

Products now follow the hero directly. A shorter optional reveal follows the catalogue and has a skip link. The film uses 79 WebP frames, with 300px mobile and 480px desktop sets, loaded only near the section. No decorative entrance animations delay content. Navigation names are Products / Our Story / Reviews / Contact. A mobile bottom bar reserves page space and offers product access and ordering.

At the user's request, nearby menus were researched to suggest prototype Modak pricing. ₹45 per piece and 5-, 11-, and 21-piece packs (₹225, ₹495, ₹945) are illustrative, not the business's confirmed menu. The catalogue and enquiry clearly disclose this. Benchmarks: Bhosari listing https://www.zomato.com/pune/ukadiche-modak-bhosari/order (5 for ₹229, 11 for ₹489) and Pune kitchen https://ghargutigodwa.com/en/products/ukdiche-modak (₹35 per piece, minimum 10). Research date: October 10, 2026. Delivery charges, variants and stock are not inferred from competitors. Chirota Sweet ₹300–₹800 and Green Salad ₹150–₹250 are visible profile-listed ranges; actual pack sizes remain unconfirmed.

The order form validates quantity and date, marks required fields, focuses invalid inputs, adapts to visual viewport resizing, traps focus, restores focus on closing, and offers a telephone alternative. Its post-click status describes opening WhatsApp, never a submitted or confirmed order. Final price and availability are agreed with the kitchen.
