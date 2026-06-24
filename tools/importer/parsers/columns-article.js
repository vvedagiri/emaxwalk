/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-article. Base: columns.
 * Source: https://wknd-trendsetters.site/
 * Columns block: NO field hints (per hinting rules). 2 columns, 1 content row.
 * Cell 1: image. Cell 2: breadcrumb + heading + byline + meta (richtext).
 */
export default function parse(element, { document }) {
  // Direct child columns of the grid layout.
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Cell 1: the image column.
  const image = element.querySelector('img.cover-image, img');

  // Cell 2: the text column — prefer the column that does NOT hold the image.
  let textColumn = columns.find((col) => !col.querySelector('img'));
  if (!textColumn && columns.length > 1) {
    textColumn = image && image.closest(':scope > div') === columns[0] ? columns[1] : columns[1];
  }

  // Empty-block guard
  if (!image && !textColumn) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Columns block: place content directly, no field comments.
  const imageCell = image || '';
  const textCell = textColumn ? Array.from(textColumn.childNodes) : '';

  const cells = [[imageCell, textCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
