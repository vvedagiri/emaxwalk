/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters site-wide cleanup.
 *
 * All selectors below were verified against migration-work/cleaned.html for
 * https://wknd-trendsetters.site/ — none are guessed.
 *
 * Removes non-authorable site shell/chrome:
 *   - <a class="skip-link">           skip-to-content link (page shell)
 *   - <div class="navbar">            top navigation/megamenu (handled by navigation orchestrator)
 *   - <footer class="footer ...">     site footer (handled by footer orchestrator)
 *   - <div class="breadcrumbs">       breadcrumb navigation (non-authorable)
 *
 * Cleans up attributes/markup the author would never produce:
 *   - data-astro-cid-* framework attributes (e.g. on <body> and FAQ SVGs)
 *   - inline style attributes
 *   - decorative base64 data:image/svg+xml icons (carets, breadcrumb chevrons,
 *     FAQ +/- icons, logo glyphs, social icons) — these carry no authorable content
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Nothing here blocks block parsing for this site; cleanup is deferred to afterTransform.
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site shell. Verified selectors from cleaned.html.
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      '.navbar',
      'footer.footer',
      '.breadcrumbs',
    ]);

    // Remove decorative base64 inline-SVG images. These are icon glyphs (carets,
    // chevrons, FAQ +/- markers, logo/social icons) with no authorable meaning.
    // Real content images use ./images/<hash>.png or remote https URLs and are kept.
    element.querySelectorAll('img[src^="data:image/svg+xml"]').forEach((img) => {
      img.remove();
    });

    // Strip framework / styling attributes that are not authorable.
    element.querySelectorAll('*').forEach((el) => {
      // data-astro-cid-* attributes (Astro framework scoping) seen on <body> and SVGs.
      el.getAttributeNames()
        .filter((name) => name.startsWith('data-astro-cid'))
        .forEach((name) => el.removeAttribute(name));
      el.removeAttribute('style');
    });
  }
}
