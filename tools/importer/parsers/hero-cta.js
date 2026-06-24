/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-cta. Base: hero.
 * Source: https://wknd-trendsetters.site/
 * Model fields: image (reference), imageAlt (collapsed -> alt), text (richtext)
 * Library structure: 1 column, up to 3 rows (name, background image, text).
 */
export default function parse(element, { document }) {
  // INPUT EXTRACTION (validated against source.html)
  // Full-bleed background image (cover-image overlay).
  const image = element.querySelector('img.cover-image, img');

  // Overlaid text content lives in the card body.
  const heading = element.querySelector('.card-body h1, .card-body h2, h1, h2, [class*="heading"]');
  const subheading = element.querySelector('.card-body p.subheading, .card-body p, p.subheading, p');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));

  // Empty-block guard
  if (!image && !heading && !subheading && ctaLinks.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (optional). Field: image (imageAlt collapses to alt).
  if (image) {
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(image);
    cells.push([imageCell]);
  }

  // Row 3: heading + subheading + CTA in a single cell. Field: text.
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (heading) textCell.appendChild(heading);
  if (subheading) textCell.appendChild(subheading);
  ctaLinks.forEach((a) => textCell.appendChild(a));
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-cta', cells });
  element.replaceWith(block);
}
