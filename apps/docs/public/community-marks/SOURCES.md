# Community marks

Assets are original marks from the linked publishers, retained for identification of existing coverage links. Retrieved 2026-09-11; no generated or reconstructed marks.

- `peerlist.png`: https://dqy38fnwh4fqs.cloudfront.net/website/assets/peerlist-full-name-logo.png (linked by peerlist.io)
- `dev.png`: https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8j7kvp660rqzt99zui8e.png (linked by dev.to)
- `tailkits.svg`: https://tailkits.com/_ipx/_/logo.svg
- `all-shadcn.png`: https://allshadcn.b-cdn.net/android-chrome-192x192.png
- `tailwind-resources.svg`: https://tailwindresources.com/images/logo/logo.svg
- `shadcn-templates.svg`: https://shadcntemplates.com/logo/logo.svg
- `builtatlightspeed.png`: pre-existing local publisher icon from builtatlightspeed.com, retained. The official white SVG request returned HTTP429; no replacement was invented.

Other pre-existing coverage assets remain untouched.

## Carousel motion

The landing carousel adapts the overlapping-row and staggered enter/exit pattern
from the user-supplied `logos-carousel.zip` Devouring Details prototype. Only its
animation/layout approach is reused: sample brand graphics, bundled fonts, and
`system.css` are not imported. The production adaptation preserves the overlapping staggered row cycle.
Hover, keyboard focus, document visibility and reduced-motion preferences gate
animation. The pause control is visually hidden until keyboard focus; manual
pause exposes the complete set of seven links. No sample brands are reused.
