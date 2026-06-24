/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards.
 * Source: https://wknd-trendsetters.site/
 * Container block (Cards). Each child = one row with 2 cells:
 *   cell 1: image (field:image, imageAlt collapses to alt)
 *   cell 2: text (field:text) — empty here (image-only gallery), so no hint.
 */
export default function parse(element, { document }) {
  // Each direct child div is one card; extract its image.
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));

  const cells = [];
  cardDivs.forEach((cardDiv) => {
    const image = cardDiv.querySelector('img.cover-image, img');
    if (!image) return;

    // Cell 1: image. Field: image.
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(image);

    // Cell 2: text — empty for image-only cards (no field hint on empty cells).
    cells.push([imageCell, '']);
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
