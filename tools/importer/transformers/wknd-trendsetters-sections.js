/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters section boundaries + section metadata.
 *
 * Runs in afterTransform only. Driven entirely by payload.template.sections
 * (from tools/importer/page-templates.json). For the home-page template there
 * are 7 sections:
 *   rc2 hero-header            style: secondary
 *   rc3 featured-article       style: null
 *   rc4 image-gallery-grid     style: secondary
 *   rc5 testimonials-tabs      style: null
 *   rc6 latest-articles-cards  style: secondary
 *   rc7 faq-accordion          style: null
 *   rc8 cta-inverse-section    style: inverse
 *
 * For each section (processed in reverse so insertions don't shift earlier nodes):
 *   - If section.style is set, append a "Section Metadata" block after the section.
 *   - If the section is not the first, insert an <hr> before it.
 *
 * Section selectors come from page-templates.json, which were derived from the
 * captured DOM in migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const sections = payload && payload.template && payload.template.sections;
  if (!sections || sections.length < 2) return;

  const document = element.ownerDocument;

  // Resolve each section's root element via its selector, relative to the
  // document so the page-templates.json selectors (rooted at #main-content) match.
  const resolved = sections.map((section) => ({
    section,
    el: document.querySelector(section.selector),
  }));

  // Process in reverse order so inserting <hr>/metadata does not move the
  // elements we still have to handle.
  for (let i = resolved.length - 1; i >= 0; i -= 1) {
    const { section, el } = resolved[i];
    if (!el) continue;

    // Section Metadata block immediately after the section, when a style is set.
    if (section.style) {
      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      if (el.nextSibling) {
        el.parentNode.insertBefore(metadataBlock, el.nextSibling);
      } else {
        el.parentNode.appendChild(metadataBlock);
      }
    }

    // Section break before every section except the first.
    if (i > 0) {
      const hr = document.createElement('hr');
      el.parentNode.insertBefore(hr, el);
    }
  }
}
