# Design guidelines

Use a simple, restrained layout with clear typography and comfortable spacing.
Follow the [copywriting style](copywriting-style.md) for text.

## Layout and appearance

- Keep the page narrow and centered, with readable line lengths and distinct sections.
- Stack project and about sections. Use columns only where they improve readability.
- Use Inter, subtle dividers, and a muted palette with contrast in both themes.
- Avoid decorative clutter, excessive panels, and unnecessary animation.
- Keep buttons consistent and external-link arrows small and aligned with the text.
- Place the avatar in the introduction. Preserve official logos' proportions and colors.
- Keep the favicon simple and legible at small sizes.

## Navigation and forms

- Keep contact and back-to-top links on the page, without external-link arrows.
- External links with arrows open in a new tab with `rel="noopener noreferrer"`.
- Make contact links easy to find. Keep secondary profile links near relevant content.
- Match forms to the site's typography and spacing. Use visible labels and mark required fields.
- Retain native validation and show a clear unavailable state when submission is disabled.

## Accessibility and review

- Stack content on small screens; keep comfortable margins and tap targets.
- Prevent horizontal scrolling and use readable input text that avoids mobile zoom.
- Preserve keyboard access, visible focus, a skip link, and reduced-motion support.
- Support system theme preferences and a persistent manual theme toggle.
- Keep essential content and the contact form usable without JavaScript.
- Check small phones and desktop displays in both themes, including navigation and forms.

Implementation details live in [site maintenance](personal-website.md).
