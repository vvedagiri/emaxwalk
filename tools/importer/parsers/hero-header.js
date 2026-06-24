/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-header. Base: hero.
 * Source: https://wknd-trendsetters.site/
 * Model fields: image (reference), imageAlt (collapsed -> alt), text (richtext)
 * Library structure: 1 column, up to 3 rows (name, image, text).
 */
export default function parse(element, { document }) {
  // INPUT EXTRACTION (validated against source.html)
  // Text content: heading + subheading + CTA button group live in the first inner column.
  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
  const subheading = element.querySelector('p.subheading, p');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));

  // Image(s): cover images live in the second inner column. The model holds a
  // single image field, so use the first cover image as the hero image.
  const image = element.querySelector('img.cover-image, img');

  // Empty-block guard
  if (!heading && !subheading && ctaLinks.length === 0 && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background/hero image (optional). Field: image (imageAlt collapses to alt).
  if (image) {
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(image);
    cells.push([imageCell]);
  }

  // Row 3: text content (heading + subheading + CTAs) in a single cell. Field: text.
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (heading) textCell.appendChild(heading);
  if (subheading) textCell.appendChild(subheading);
  ctaLinks.forEach((a) => textCell.appendChild(a));
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-header', cells });
  element.replaceWith(block);
}
