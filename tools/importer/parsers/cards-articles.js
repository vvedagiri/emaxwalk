/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-articles. Base: cards.
 * Source: https://wknd-trendsetters.site/
 * Container block (Cards). Each child = one row with 2 cells:
 *   cell 1: image (field:image, imageAlt collapses to alt)
 *   cell 2: text (field:text) — tag + date + heading (card is a link).
 */
export default function parse(element, { document }) {
  // Each card is an anchor (article-card / card-link) wrapping image + body.
  const cardLinks = Array.from(element.querySelectorAll(':scope > a.article-card, :scope > a.card-link, :scope > a'));

  const cells = [];
  cardLinks.forEach((card) => {
    const image = card.querySelector('img.cover-image, img');
    const tag = card.querySelector('.tag');
    const date = card.querySelector('.article-card-meta .paragraph-sm, .article-card-meta span:not(.tag)');
    const heading = card.querySelector('h3, h2, h4, [class*="heading"]');
    const href = card.getAttribute('href');

    // Cell 1: image. Field: image.
    let imageCell = '';
    if (image) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(' field:image '));
      frag.appendChild(image);
      imageCell = frag;
    }

    // Cell 2: text content. Field: text. Wrap heading in the card link to preserve href.
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (tag) {
      const tagP = document.createElement('p');
      tagP.append(tag.textContent.trim());
      textCell.appendChild(tagP);
    }
    if (date) {
      const dateP = document.createElement('p');
      dateP.append(date.textContent.trim());
      textCell.appendChild(dateP);
    }
    if (heading) {
      if (href) {
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = heading.textContent.trim();
        const h = document.createElement(heading.tagName.toLowerCase());
        h.appendChild(link);
        textCell.appendChild(h);
      } else {
        textCell.appendChild(heading);
      }
    }

    cells.push([imageCell, textCell]);
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-articles', cells });
  element.replaceWith(block);
}
