# Ukadiche Modak — cinematic website prototype

React, Vite, Tailwind CSS and GSAP ScrollTrigger.

## Run

`npm install` then `npm run dev -- --host 0.0.0.0`.

Production: `npm run build`; serve `dist/`.

## Content and assets

Business: Ukadiche Modak (उकडीचे मोदक), Shop No. 10, Polite Hermitage, Shivtej Nagar Road, Shivatej Nagar, Pimpri-Chinchwad, Maharashtra 411019. Phone and WhatsApp: +91 95035 02689.

Source: user's Google Business Profile screen recording, https://drive.google.com/file/d/1uLyTIw_Dm-EmBp1vG2kRHKSBUdn3ZThm/view and Google Maps https://maps.app.goo.gl/Z7iuQg7QLAbgowMh8?g_st=ac . Rating 4.8 / 136 reviews is a recording snapshot, not a live feed. The eleven-year business history is explicitly attributed to the owner's statement. Three review excerpts retain visible customer names. Products, delivery, catering, tiffin, frozen/restaurant enquiries and 24-hour advance ordering come from the recording. Prices and current hours must be confirmed with the business.

Actual product photographs are cropped from the supplied screen recording. Cinematic hero and story imagery and 158 scroll frames derive from the user-supplied animation, https://drive.google.com/file/d/1V1rTiSXeM8peYXpPXUPD3l6cWB4yXrMC/view . The illustrative mark and colour palette are website concept branding.

## Interaction

GSAP maps the sticky section's scroll progress directly to 158 locally hosted JPEG frames at 24 frames/second of source footage. Scrolling backward reverses the reveal. Six concurrent image loaders preload frames; a still poster appears while loading. A manual range provides keyboard access and exploration without scroll motion. Reduced-motion users get a static section with the manual control.

The accessible order dialog creates a WhatsApp enquiry addressed to the verified business phone. It does not submit a paid order. The business confirms price and availability. Map, telephone and WhatsApp links are real.
